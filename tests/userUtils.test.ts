import { getUserDisplayName, getUserFirstName } from "../src/lib/userUtils";

console.log("==================================================");
console.log("RUNNING USER NAME RESOLUTION TEST SUITE");
console.log("==================================================");

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failed++;
  }
}

// Case 1: firstName = Rahul, lastName = Das
const user1 = { firstName: "Rahul", lastName: "Das" };
assert(getUserFirstName(user1) === "Rahul", "Case 1: First name resolves to Rahul");
assert(getUserDisplayName(user1) === "Rahul Das", "Case 1: Full name resolves to Rahul Das");

// Case 2: firstName = Priya, lastName = ""
const user2 = { firstName: "Priya", lastName: "" };
assert(getUserFirstName(user2) === "Priya", "Case 2: First name resolves to Priya");
assert(getUserDisplayName(user2) === "Priya", "Case 2: Full name resolves to Priya");

// Case 3: displayName = Arjun Mehta
const user3 = { displayName: "Arjun Mehta" };
assert(getUserFirstName(user3) === "Arjun", "Case 3: First name resolves to Arjun");
assert(getUserDisplayName(user3) === "Arjun Mehta", "Case 3: Full name resolves to Arjun Mehta");

// Case 4: Logged-out state (null / undefined)
assert(getUserFirstName(null) === "Member", "Case 4: Logged out user first name defaults to Member");
assert(getUserDisplayName(null) === "Member", "Case 4: Logged out user display name defaults to Member");

// Case 5: Email fallback
const user5 = { email: "alex.smith@company.io" };
assert(getUserFirstName(user5) === "Alex.smith", "Case 5: Email fallback resolves first name");
assert(getUserDisplayName(user5) === "Alex.smith", "Case 5: Email fallback resolves display name");

console.log("==================================================");
console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log("==================================================");

if (failed > 0) {
  process.exit(1);
}
