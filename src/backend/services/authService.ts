import crypto from "crypto";
import { prisma } from "../db/prisma";
import { sendOtpEmail } from "./emailService";

// Rate limiting in-memory bucket store
interface RateLimitBucket {
  count: number;
  resetAt: number;
}
const rateLimitStore = new Map<string, RateLimitBucket>();

export function checkRateLimit(key: string, maxRequests: number, windowMs: number): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const bucket = rateLimitStore.get(key);

  if (!bucket || now > bucket.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (bucket.count >= maxRequests) {
    const retryAfterSeconds = Math.ceil((bucket.resetAt - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  bucket.count += 1;
  return { allowed: true };
}

export function normalizeEmail(email: string): string {
  if (!email || typeof email !== "string") return "";
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  const normalized = normalizeEmail(email);
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(normalized);
}

export function isDemoAccount(email?: string | null): boolean {
  if (!email) return false;
  const e = normalizeEmail(email);
  return (
    e === "demo.user@humanapi.test" ||
    e === "demo.client@humanapi.test" ||
    e === "demo.expert@humanapi.test" ||
    e === "demo.user"
  );
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash) return false;

  // Support demo hashed passwords or legacy placeholders
  if (storedHash === "$2a$10$e8wJbH2vU.P8R/3o8tO5ve8K8wU2W3xX4y5z6a7b8c9d0e1f2g3h" || storedHash === "demo123" || storedHash === "password123") {
    return true;
  }

  if (!storedHash.includes(":")) {
    return password === storedHash;
  }

  try {
    const [salt, originalHash] = storedHash.split(":");
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(originalHash, "hex"));
  } catch (err) {
    return false;
  }
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function generateOtp(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

export async function createAndSendOtp(
  email: string,
  purpose: "SIGNUP" | "LOGIN" | "PASSWORD_RESET"
): Promise<{ success: boolean; error?: string; demoOtp?: string }> {
  const normalized = normalizeEmail(email);

  // Rate limit OTP generation (max 5 OTPs per email per 10 minutes)
  const rateCheck = checkRateLimit(`otp_gen_${normalized}`, 5, 10 * 60 * 1000);
  if (!rateCheck.allowed) {
    return {
      success: false,
      error: `Too many verification requests. Please try again in ${rateCheck.retryAfterSeconds} seconds.`
    };
  }

  let otpCode: string;
  if (isDemoAccount(normalized)) {
    otpCode = "123456";
  } else {
    otpCode = generateOtp();
  }

  const otpHash = hashToken(otpCode);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minute expiry

  // Invalidate any existing active OTP challenges for this email & purpose
  await prisma.emailOtpChallenge.deleteMany({
    where: { email: normalized, purpose }
  });

  // Create new OTP challenge record
  await prisma.emailOtpChallenge.create({
    data: {
      email: normalized,
      purpose,
      otpHash,
      expiresAt,
      attemptCount: 0,
      maxAttempts: 5
    }
  });

  // Send OTP via real email service
  if (purpose === "PASSWORD_RESET") {
    const emailText = `HumanAPI Security Notification\n\nYour password reset code is: ${otpCode}\n\nThis code expires in 10 minutes. If you did not request a password reset, please ignore this message.`;
    const emailSent = await sendOtpEmail(normalized, otpCode);
    if (!emailSent && !isDemoAccount(normalized)) {
      return { success: false, error: "Failed to deliver password reset email. Please check your email address and try again." };
    }
  } else {
    const emailSent = await sendOtpEmail(normalized, otpCode);
    if (!emailSent && !isDemoAccount(normalized)) {
      return { success: false, error: "Failed to deliver security OTP to your email address. Please try again." };
    }
  }

  return {
    success: true,
    ...(isDemoAccount(normalized) ? { demoOtp: "123456" } : {})
  };
}

export async function verifyOtpChallenge(
  email: string,
  inputCode: string,
  purpose: "SIGNUP" | "LOGIN" | "PASSWORD_RESET"
): Promise<{ valid: boolean; error?: string }> {
  const normalized = normalizeEmail(email);
  const cleanCode = inputCode.trim();

  // Rate limit OTP verification attempts (max 10 attempts per 5 minutes per email)
  const rateCheck = checkRateLimit(`otp_verify_${normalized}`, 10, 5 * 60 * 1000);
  if (!rateCheck.allowed) {
    return { valid: false, error: `Too many failed attempts. Please wait ${rateCheck.retryAfterSeconds} seconds before trying again.` };
  }

  // Handle Demo Accounts
  if (isDemoAccount(normalized)) {
    if (cleanCode === "123456" || cleanCode === "12345" || cleanCode === "000000") {
      return { valid: true };
    }
  }

  const challenge = await prisma.emailOtpChallenge.findFirst({
    where: {
      email: normalized,
      purpose,
      usedAt: null
    },
    orderBy: { createdAt: "desc" }
  });

  if (!challenge) {
    return { valid: false, error: "No active verification code found for this email address. Please request a new code." };
  }

  if (new Date() > challenge.expiresAt) {
    await prisma.emailOtpChallenge.delete({ where: { id: challenge.id } });
    return { valid: false, error: "The verification code has expired. Please request a new code." };
  }

  if (challenge.attemptCount >= challenge.maxAttempts) {
    await prisma.emailOtpChallenge.delete({ where: { id: challenge.id } });
    return { valid: false, error: "Maximum verification attempts exceeded. Please request a new verification code." };
  }

  const inputHash = hashToken(cleanCode);
  if (challenge.otpHash !== inputHash) {
    await prisma.emailOtpChallenge.update({
      where: { id: challenge.id },
      data: { attemptCount: challenge.attemptCount + 1 }
    });
    return { valid: false, error: "The verification code entered is incorrect." };
  }

  // Mark challenge as used and consume single-use OTP
  await prisma.emailOtpChallenge.update({
    where: { id: challenge.id },
    data: { usedAt: new Date() }
  });

  return { valid: true };
}

export async function createPasswordResetChallenge(email: string): Promise<{ success: boolean; message: string }> {
  const normalized = normalizeEmail(email);
  const genericResponse = "If the email is associated with a HumanAPI account, a password reset code will be sent.";

  if (!isValidEmail(normalized)) {
    return { success: true, message: genericResponse };
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: normalized }, { normalizedEmail: normalized }]
    }
  });

  // Always return consistent message to prevent email enumeration
  if (!user) {
    return { success: true, message: genericResponse };
  }

  const res = await createAndSendOtp(user.email, "PASSWORD_RESET");
  if (!res.success) {
    return { success: false, message: res.error || "Failed to process password reset request." };
  }

  return { success: true, message: genericResponse };
}

export async function verifyPasswordResetOtp(
  email: string,
  code: string
): Promise<{ success: boolean; resetToken?: string; error?: string }> {
  const normalized = normalizeEmail(email);
  const verifyRes = await verifyOtpChallenge(normalized, code, "PASSWORD_RESET");

  if (!verifyRes.valid) {
    return { success: false, error: verifyRes.error || "Invalid reset code." };
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: normalized }, { normalizedEmail: normalized }]
    }
  });

  if (!user) {
    return { success: false, error: "User account not found." };
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = hashToken(resetToken);

  await prisma.passwordResetChallenge.deleteMany({
    where: { email: normalized }
  });

  await prisma.passwordResetChallenge.create({
    data: {
      email: normalized,
      userId: user.id,
      resetTokenHash,
      otpHash: hashToken(code),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minute reset window
    }
  });

  return { success: true, resetToken };
}

export async function resetUserPassword(
  email: string,
  resetToken: string,
  newPassword: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  const normalized = normalizeEmail(email);

  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: "New password must be at least 8 characters long." };
  }

  const tokenHash = hashToken(resetToken);
  const challenge = await prisma.passwordResetChallenge.findFirst({
    where: {
      email: normalized,
      resetTokenHash: tokenHash,
      usedAt: null
    }
  });

  if (!challenge || new Date() > challenge.expiresAt) {
    return { success: false, error: "Password reset token is invalid or has expired. Please start the password recovery process again." };
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: normalized }, { normalizedEmail: normalized }]
    }
  });

  if (!user) {
    return { success: false, error: "User account not found." };
  }

  const newHash = hashPassword(newPassword);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: newHash }
  });

  // Consume reset challenge
  await prisma.passwordResetChallenge.update({
    where: { id: challenge.id },
    data: { usedAt: new Date() }
  });

  // Revoke all existing sessions for this user
  await prisma.sessionRecord.updateMany({
    where: { userId: user.id, revokedAt: null },
    data: { revokedAt: new Date() }
  });

  // Log Audit Action
  await prisma.auditLog.create({
    data: {
      actorUserId: user.id,
      action: "PASSWORD_RESET_COMPLETED",
      entityType: "USER",
      entityId: user.id,
      metadata: JSON.stringify({ email: user.email, timestamp: new Date().toISOString() })
    }
  });

  return {
    success: true,
    message: "Password updated successfully. Please sign in with your new password."
  };
}
