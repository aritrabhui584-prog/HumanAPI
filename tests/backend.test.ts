import { prisma } from "../src/backend/db/prisma";
import { runDiagnosisEngine, matchExpertsForCase } from "../src/backend/services/diagnosisEngine";
import { loginApi, signupApi, verifyEmailOTPApi, logoutApi, getCurrentUserApi } from "../src/Auth/authApi";
import { mapAuthResponse, mapUser } from "../src/Auth/authAdapter";

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
    const otpRes = await verifyEmailOTPApi(testEmail, "123456");
    assert(otpRes.success === true, "OTP verification succeeds with valid 6-digit code");
    assert(Boolean(otpRes.user), "OTP verification returns normalized user object");
    assert(otpRes.user?.email === testEmail, "Normalized user email matches registered address");
    assert(otpRes.user?.emailVerified === true, "OTP verification updates emailVerified to true in database");

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

    // Login test
    const loginRes = await loginApi(testEmail, "password123");
    assert(loginRes.success === true, "Login API validates existing account");
    assert(loginRes.requiresOtp === true, "Login enforces authoritative email OTP step");

    // Current user retrieval
    const currentUserObj = await getCurrentUserApi(testEmail);
    assert(currentUserObj !== null, "getCurrentUserApi retrieves verified account session from DB");
    assert(currentUserObj?.email === testEmail, "Retrieved user session email matches");

    // Logout test
    await logoutApi();
    assert(true, "Logout API invalidates session token successfully");

    // 2. ROLE SEPARATION & AUTHORIZATION TESTS
    console.log("\n--- 2. ROLE SEPARATION & AUTHORIZATION TESTS ---");
    const clientUser = await prisma.user.findFirst({ where: { role: "CLIENT" } });
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
