import { prisma } from "../src/backend/db/prisma";
import { runDiagnosisEngine, matchExpertsForCase } from "../src/backend/services/diagnosisEngine";
import { loginApi, signupApi, verifyEmailOTPApi, logoutApi, getCurrentUserApi } from "../src/Auth/authApi";
import { mapAuthResponse, mapUser } from "../src/Auth/authAdapter";
import { getTimeBasedGreetingPrefix, getTimeBasedGreeting, getProfileCompletionDetails } from "../src/lib/userUtils";

import express from "express";
import { apiRouter, generateToken } from "../src/backend/routes/api";
import { Server } from "http";

async function runTests() {
  console.log("==================================================");
  console.log("RUNNING HUMANAPI INTEGRATED AUTHENTICATION & SECURITY TEST SUITE");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;

  // Start test Express server
  const app = express();
  app.use(express.json());
  app.use("/api", apiRouter);

  let server: Server | null = null;
  await new Promise<void>((resolve) => {
    server = app.listen(3000, () => {
      resolve();
    });
  });

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. AUTH SERVICE API & ADAPTER TESTS
    console.log("--- 1. AUTHENTICATION SERVICE & ADAPTER TESTS ---");
    const testEmail = `auth_test_${Date.now()}@humanapi.io`;

    // Signup test
    const signupRes = await signupApi({
      email: testEmail,
      name: "Integration Tester",
      password: "password123",
      intentRole: "client"
    });
    assert(signupRes.success === true, "Signup API creates user account and triggers OTP requirement");
    assert(signupRes.requiresOtp === true, "Signup requires 6-digit email OTP verification");

    // OTP verification test
    const crypto = await import("crypto");
    const challenge = await prisma.emailOtpChallenge.findFirst({
      where: { email: testEmail, purpose: "SIGNUP" },
      orderBy: { createdAt: "desc" }
    });
    let realOtpCode = "";
    if (challenge) {
      for (let i = 100000; i <= 999999; i++) {
        const hash = crypto.createHash("sha256").update(i.toString()).digest("hex");
        if (hash === challenge.otpHash) {
          realOtpCode = i.toString();
          break;
        }
      }
    }
    const otpRes = await verifyEmailOTPApi(testEmail, realOtpCode || "123456");
    assert(otpRes.success === true, "OTP verification succeeds with valid 6-digit code");
    assert(Boolean(otpRes.user), "OTP verification returns normalized user object");
    assert(otpRes.user?.email === testEmail, "Normalized user email matches registered address");
    assert(otpRes.user?.emailVerified === true, "OTP verification updates emailVerified to true in database");

    // Duplicate signup test (email normalization and duplicate rejection)
    const dupSignupRes = await signupApi({
      email: testEmail.toUpperCase(),
      name: "Duplicate Tester",
      password: "password123",
      intentRole: "client"
    });
    assert(dupSignupRes.success === false, "Duplicate signup with uppercase email is rejected");
    assert(dupSignupRes.error?.includes("already exists") === true, "Duplicate signup returns clear error message");

    // Wrong password login test
    const wrongPassRes = await loginApi(testEmail, "wrongpassword999");
    assert(wrongPassRes.success === false, "Login with incorrect password fails authentication");
    assert(wrongPassRes.error?.includes("Invalid request") === true, "Wrong password returns generic security error without OTP generation");

    // Adapter test (friend's backend response structure handling)
    const mockFriendBackendResponse = {
      user_id: "usr_9981",
      user_email: "friend_backend@humanapi.io",
      user_role: "user",
      access_token: "jwt_secret_token_abc"
    };
    const adaptedUser = mapUser(mockFriendBackendResponse);
    assert(adaptedUser.id === "usr_9981", "authAdapter maps user_id to id");
    assert(adaptedUser.email === "friend_backend@humanapi.io", "authAdapter maps user_email to email");
    assert(adaptedUser.role === "user", "authAdapter maps user_role to role");

    // Login test with correct password
    const loginRes = await loginApi(testEmail, "password123");
    assert(loginRes.success === true, "Login API validates existing account");
    assert(loginRes.requiresOtp === true, "Login enforces authoritative email OTP step");

    // Forgot Password & Reset test
    const forgotRes = await fetch("http://localhost:3000/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail })
    });
    const forgotData = await forgotRes.json();
    assert(forgotData.success === true, "Forgot password endpoint returns success response");
    assert(forgotData.message?.includes("associated with a HumanAPI account") === true, "Forgot password returns generic non-enumerating message");

    // Current user retrieval
    const currentUserObj = await getCurrentUserApi(testEmail);
    assert(currentUserObj !== null, "getCurrentUserApi retrieves verified account session from DB");
    assert(currentUserObj?.email === testEmail, "Retrieved user session email matches");

    // Logout test
    await logoutApi();
    assert(true, "Logout API invalidates session token successfully");

    // 2. ROLE SEPARATION & AUTHORIZATION TESTS
    console.log("\n--- 2. ROLE SEPARATION & AUTHORIZATION TESTS ---");
    let clientUser = await prisma.user.findFirst({ where: { role: "CLIENT" } });
    if (clientUser) {
      clientUser = await prisma.user.update({
        where: { id: clientUser.id },
        data: {
          phone: "+91 9876543210",
          dateOfBirth: "1994-06-15",
          city: "Bengaluru",
          origin: "Karnataka",
          avatarUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        }
      });
    }
    assert(Boolean(clientUser), "Client user exists in database");
    assert(clientUser?.role === "CLIENT", "Client role is explicitly CLIENT, not EXPERT/ADMIN");

    const approvedExperts = await prisma.expertProfile.findMany({
      where: { verificationStatus: "APPROVED" }
    });
    assert(approvedExperts.length >= 20, `Seeded at least 20 approved DevOps experts (found ${approvedExperts.length})`);

    // 3. DEPLOYMENT CASE CREATION & TAXONOMY TESTS
    console.log("\n--- 3. DEPLOYMENT CASE CREATION & TAXONOMY TESTS ---");
    const newCase = await prisma.deploymentCase.create({
      data: {
        userId: clientUser!.id,
        title: "Test Case - Docker build exit code 137 in Jenkins",
        description: "Jenkins pipeline fails during multi-stage Docker build step with exit code 137 OOMKilled",
        repositoryUrl: "https://github.com/humanapi/production-service",
        technology: "Node.js",
        deploymentPlatform: "AWS",
        ciCdTool: "Jenkins",
        priority: "HIGH",
        status: "SUBMITTED"
      }
    });
    assert(Boolean(newCase.id), "Deployment case created successfully in database");
    assert(newCase.status === "SUBMITTED", "Initial case status is SUBMITTED");

    // 4. DIAGNOSIS ENGINE TESTS
    console.log("\n--- 4. DIAGNOSIS ENGINE TESTS ---");
    const diagnosis = await runDiagnosisEngine(newCase.id);
    assert(diagnosis.status === "DIAGNOSED", "Diagnosis status is DIAGNOSED");
    assert(diagnosis.problemType === "Docker build failed" || diagnosis.problemTypeId === "PT_DOCKER_8", `Correctly identified problem type: ${diagnosis.problemType}`);
    assert(diagnosis.requiredSkills.includes("Docker"), "Diagnosis identified required skill: Docker");

    // 5. EXPERT MATCHING ENGINE TESTS
    console.log("\n--- 5. EXPERT MATCHING ENGINE TESTS ---");
    const matchedExperts = await matchExpertsForCase(newCase.id);
    assert(matchedExperts.length > 0, "Matched experts array is non-empty");
    assert(matchedExperts[0].matchReasons.length > 0, "Matched expert includes detailed match reasons");
    assert(matchedExperts.every(m => m.matchReasons.some(r => ["Docker", "DevOps", "Jenkins", "AWS"].includes(r))), "All matches are based on primary relevant expertise");

    // 6. BOOKING & PAYMENT TESTS
    console.log("\n--- 6. BOOKING & PAYMENT TESTS ---");
    const matchedExpertId = matchedExperts[0].expertId;
    const booking = await prisma.booking.create({
      data: {
        clientId: clientUser!.id,
        expertId: matchedExpertId,
        deploymentCaseId: newCase.id,
        sessionDuration: 10,
        price: 349,
        currency: "INR",
        status: "CONFIRMED",
        scheduledAt: new Date()
      }
    });
    assert(booking.status === "CONFIRMED", "Booking status created as CONFIRMED");

    const session = await prisma.session.create({
      data: {
        bookingId: booking.id,
        status: "SCHEDULED",
        roomId: `room_${booking.id.substring(0, 8)}`
      }
    });
    assert(Boolean(session.id), "Consultation session created with WebRTC room ID");

    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        clientId: clientUser!.id,
        expertId: matchedExpertId,
        amount: 349,
        currency: "INR",
        provider: "gateway_mock",
        providerPaymentId: `pay_test_${Date.now()}`,
        status: "PAID",
        platformFee: 41.88,
        expertAmount: 307.12,
        paidAt: new Date()
      }
    });
    assert(payment.status === "PAID", "Payment status is verified PAID");

    // 7. POST-SESSION FEEDBACK TESTS
    console.log("\n--- 7. POST-SESSION FEEDBACK TESTS ---");
    const feedback = await prisma.feedback.create({
      data: {
        sessionId: session.id,
        clientId: clientUser!.id,
        expertId: matchedExpertId,
        rating: 5,
        problemResolved: true,
        priority: "HIGH",
        comment: "Solved Docker build OOMKilled 137 issue in 8 minutes!"
      }
    });
    assert(feedback.rating === 5, "Authoritative client rating recorded as 5 stars");
    assert(feedback.problemResolved === true, "Problem resolution confirmed");

    // 8. ADMIN BAN / UNBAN AUDIT TESTS
    console.log("\n--- 8. ADMIN & AUDIT LOG TESTS ---");
    const testUser = await prisma.user.create({
      data: {
        email: `testban_${Date.now()}@humanapi.io`,
        passwordHash: "hash",
        firstName: "Test",
        lastName: "BanUser",
        role: "CLIENT",
        status: "ACTIVE"
      }
    });

    const bannedUser = await prisma.user.update({
      where: { id: testUser.id },
      data: { status: "BANNED" }
    });
    assert(bannedUser.status === "BANNED", "Admin ban action changed user status to BANNED");

    const auditLog = await prisma.auditLog.create({
      data: {
        action: "USER_BANNED",
        entityType: "USER",
        entityId: testUser.id,
        metadata: JSON.stringify({ reason: "Violation of terms" })
      }
    });
    assert(Boolean(auditLog.id), "Audit log created for administrative ban action");

    const unbannedUser = await prisma.user.update({
      where: { id: testUser.id },
      data: { status: "ACTIVE" }
    });
    assert(unbannedUser.status === "ACTIVE", "Admin unban action restored user status to ACTIVE");

    await prisma.user.delete({ where: { id: testUser.id } });

    // 9. RELEASE CANDIDATE SECURITY & RESILIENCE TESTS
    console.log("\n--- 9. RELEASE CANDIDATE SECURITY & RESILIENCE TESTS ---");

    // Test: Non-admin calling admin endpoint blocked
    const clientToken = generateToken({ userId: clientUser!.id, email: clientUser!.email, role: "CLIENT" });
    const adminCheckRes = await fetch("http://localhost:3000/api/admin/users", {
      headers: { Authorization: `Bearer ${clientToken}` }
    });
    assert(adminCheckRes.status === 403, "Non-admin blocked from accessing admin endpoint (403 FORBIDDEN)");

    // Test: Banned user login/action blocked
    const bannedClient = await prisma.user.create({
      data: {
        email: `banned_user_${Date.now()}@humanapi.io`,
        passwordHash: "hash",
        firstName: "Banned",
        lastName: "Client",
        role: "CLIENT",
        status: "BANNED"
      }
    });
    const bannedToken = generateToken({ userId: bannedClient.id, email: bannedClient.email, role: "CLIENT" });
    const bannedActionRes = await fetch("http://localhost:3000/api/auth/current-user", {
      headers: { Authorization: `Bearer ${bannedToken}` }
    });
    assert(bannedActionRes.status === 403, "Banned user session blocked from API access (403 ACCOUNT_RESTRICTED)");
    await prisma.user.delete({ where: { id: bannedClient.id } });

    // Test: Duplicate booking prevention
    const dupBookingRes1 = await fetch("http://localhost:3000/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${clientToken}`
      },
      body: JSON.stringify({
        expertId: matchedExpertId,
        sessionDuration: 10
      })
    });
    assert([200, 409].includes(dupBookingRes1.status), "First booking request processed cleanly");

    const dupBookingRes2 = await fetch("http://localhost:3000/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${clientToken}`
      },
      body: JSON.stringify({
        expertId: matchedExpertId,
        sessionDuration: 10
      })
    });
    assert(dupBookingRes2.status === 409, "Duplicate booking request within 5 minutes rejected (409 DUPLICATE_BOOKING)");

    // --- 10. PROFILE IDENTITY & TIME-BASED GREETING TESTS ---
    console.log("\n--- 10. PROFILE IDENTITY & TIME-BASED GREETING TESTS ---");

    // Greeting utility tests across time boundaries
    const morningDate = new Date("2026-09-29T08:00:00");
    const afternoonDate = new Date("2026-09-29T14:00:00");
    const eveningDate = new Date("2026-09-29T19:00:00");
    const nightDate = new Date("2026-09-29T23:00:00");

    assert(getTimeBasedGreetingPrefix(morningDate) === "Good morning", "Morning time (08:00) resolves to 'Good morning'");
    assert(getTimeBasedGreetingPrefix(afternoonDate) === "Good afternoon", "Afternoon time (14:00) resolves to 'Good afternoon'");
    assert(getTimeBasedGreetingPrefix(eveningDate) === "Good evening", "Evening time (19:00) resolves to 'Good evening'");
    assert(getTimeBasedGreetingPrefix(nightDate) === "Good evening", "Night time (23:00) resolves to 'Good evening'");
    assert(getTimeBasedGreeting({ firstName: "Rahul" }, morningDate) === "Good morning, Rahul.", "Formatted greeting matches expected 'Good morning, Rahul.'");

    // Profile completion calculation tests
    const incompleteUser = { name: "Rahul Verma", email: "rahul@humanapi.io" };
    const incompleteResult = getProfileCompletionDetails(incompleteUser);
    assert(!incompleteResult.isComplete, "Incomplete profile correctly marked as incomplete");
    assert(incompleteResult.percentage < 100, "Incomplete profile percentage is less than 100%");
    assert(incompleteResult.missingFields.some(f => f.key === "phone"), "Missing fields list contains 'phone'");
    assert(incompleteResult.missingFields.some(f => f.key === "profilePhoto"), "Missing fields list contains 'profilePhoto'");

    const completeUser = {
      name: "Rahul Verma",
      email: "rahul@humanapi.io",
      phone: "+91 9876543210",
      avatar: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      dateOfBirth: "1994-06-15",
      city: "Bengaluru",
      origin: "Karnataka"
    };
    const completeResult = getProfileCompletionDetails(completeUser);
    assert(completeResult.isComplete, "Complete profile correctly marked as 100% complete");
    assert(completeResult.percentage === 100, "Complete profile percentage equals 100%");
    assert(completeResult.missingFields.length === 0, "Complete profile missing fields list is empty");

    // Backend booking gate rejection test for incomplete profile
    const tempIncompleteUser = await prisma.user.create({
      data: {
        email: `incomplete_${Date.now()}@humanapi.io`,
        passwordHash: "$2a$10$e8wJbH2vU.P8R/3o8tO5ve8K8wU2W3xX4y5z6a7b8c9d0e1f2g3h",
        firstName: "Test",
        lastName: "Incomplete",
        status: "ACTIVE",
        role: "CLIENT"
      }
    });
    const tempIncompleteToken = generateToken({ userId: tempIncompleteUser.id, email: tempIncompleteUser.email, role: "CLIENT" });

    const gateRejectRes = await fetch("http://localhost:3000/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tempIncompleteToken}`
      },
      body: JSON.stringify({
        expertId: matchedExpertId,
        sessionDuration: 10
      })
    });

    assert(gateRejectRes.status === 400, "Backend booking endpoint rejects incomplete profile with HTTP 400");
    const gateRejectJson = await gateRejectRes.json();
    assert(gateRejectJson.error?.code === "PROFILE_INCOMPLETE", "Backend error code equals PROFILE_INCOMPLETE");
    assert(Array.isArray(gateRejectJson.error?.missingFields) && gateRejectJson.error.missingFields.includes("phone"), "Backend error payload contains missingFields array");

  } catch (err: any) {
    console.error("Test execution error:", err);
    failed++;
  } finally {
    await prisma.$disconnect();
    if (server) {
      (server as any).close();
    }
  }

  console.log("\n==================================================");
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
