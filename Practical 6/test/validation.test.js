/**
 * Automated Test Suite for NodeJS Server-Side Validation
 * Tests valid and invalid input scenarios using Node's built-in assert module.
 * Run via: node test/validation.test.js OR npm test
 */

const assert = require("assert");
const { validateWorker, ALLOWED_SKILLS } = require("../validators/workerValidator");
const workerModel = require("../models/workerModel");

let passedCount = 0;
let totalCount = 0;

function runTest(testName, fn) {
  totalCount++;
  try {
    fn();
    passedCount++;
    console.log(`  ✓ [PASS] ${testName}`);
  } catch (err) {
    console.error(`  ✗ [FAIL] ${testName}`);
    console.error(`     Reason: ${err.message}`);
  }
}

console.log("\n============================================================");
console.log("  Running Labour Connect Server-Side Validation Test Suite");
console.log("============================================================\n");

// ----------------------------------------------------------------------------
// Test Group 1: Invalid Inputs Server-Side Validation
// ----------------------------------------------------------------------------
console.log("Test Group 1: Validation Rules (Invalid Inputs)");

runTest("Rejects empty submission and returns errors for all 6 required fields", () => {
  const result = validateWorker({});
  assert.strictEqual(result.isValid, false);
  assert.ok(result.errors.name, "Name error must exist");
  assert.ok(result.errors.email, "Email error must exist");
  assert.ok(result.errors.phone, "Phone error must exist");
  assert.ok(result.errors.skill, "Skill error must exist");
  assert.ok(result.errors.experience, "Experience error must exist");
  assert.ok(result.errors.location, "Location error must exist");
});

runTest("Rejects name with less than 3 characters", () => {
  const result = validateWorker({
    name: "Al",
    email: "valid@example.com",
    phone: "9876543210",
    skill: "Plumber",
    experience: 5,
    location: "Mumbai"
  });
  assert.strictEqual(result.isValid, false);
  assert.ok(result.errors.name.includes("at least 3 characters"));
});

runTest("Rejects invalid email format without @ or domain", () => {
  const result = validateWorker({
    name: "Ramesh Sharma",
    email: "not-an-email-address",
    phone: "9876543210",
    skill: "Plumber",
    experience: 5,
    location: "Mumbai"
  });
  assert.strictEqual(result.isValid, false);
  assert.ok(result.errors.email.includes("valid email address"));
});

runTest("Rejects phone number with less than 10 digits", () => {
  const result = validateWorker({
    name: "Ramesh Sharma",
    email: "ramesh@example.com",
    phone: "98765",
    skill: "Plumber",
    experience: 5,
    location: "Mumbai"
  });
  assert.strictEqual(result.isValid, false);
  assert.ok(result.errors.phone.includes("exactly 10 digits"));
});

runTest("Rejects phone number with more than 10 digits", () => {
  const result = validateWorker({
    name: "Ramesh Sharma",
    email: "ramesh@example.com",
    phone: "9876543210123",
    skill: "Plumber",
    experience: 5,
    location: "Mumbai"
  });
  assert.strictEqual(result.isValid, false);
  assert.ok(result.errors.phone.includes("exactly 10 digits"));
});

runTest("Rejects unauthorized trade skill not in whitelist", () => {
  const result = validateWorker({
    name: "Ramesh Sharma",
    email: "ramesh@example.com",
    phone: "9876543210",
    skill: "Blacksmithing", // Not in ALLOWED_SKILLS
    experience: 5,
    location: "Mumbai"
  });
  assert.strictEqual(result.isValid, false);
  assert.ok(result.errors.skill.includes("Allowed trades are"));
});

runTest("Rejects negative experience value (< 0)", () => {
  const result = validateWorker({
    name: "Ramesh Sharma",
    email: "ramesh@example.com",
    phone: "9876543210",
    skill: "Plumber",
    experience: -3,
    location: "Mumbai"
  });
  assert.strictEqual(result.isValid, false);
  assert.ok(result.errors.experience.includes("between 0 and 50"));
});

runTest("Rejects experience value greater than 50 years (> 50)", () => {
  const result = validateWorker({
    name: "Ramesh Sharma",
    email: "ramesh@example.com",
    phone: "9876543210",
    skill: "Plumber",
    experience: 75,
    location: "Mumbai"
  });
  assert.strictEqual(result.isValid, false);
  assert.ok(result.errors.experience.includes("between 0 and 50"));
});

runTest("Rejects location with less than 2 characters", () => {
  const result = validateWorker({
    name: "Ramesh Sharma",
    email: "ramesh@example.com",
    phone: "9876543210",
    skill: "Plumber",
    experience: 5,
    location: "M"
  });
  assert.strictEqual(result.isValid, false);
  assert.ok(result.errors.location.includes("at least 2 characters"));
});

// ----------------------------------------------------------------------------
// Test Group 2: Valid Input & Sanitization
// ----------------------------------------------------------------------------
console.log("\nTest Group 2: Valid Inputs & Sanitization");

runTest("Accepts valid worker registration with proper sanitization", () => {
  const input = {
    name: "  Suresh Kumar  ",
    email: "  Suresh.Kumar@Example.COM ",
    phone: "(987) 654-3210",
    skill: "Electrician",
    experience: "8",
    location: "  Bangalore - Whitefield  "
  };

  const result = validateWorker(input);
  assert.strictEqual(result.isValid, true);
  assert.strictEqual(Object.keys(result.errors).length, 0);

  // Check sanitization
  assert.strictEqual(result.sanitized.name, "Suresh Kumar");
  assert.strictEqual(result.sanitized.email, "suresh.kumar@example.com");
  assert.strictEqual(result.sanitized.phone, "9876543210");
  assert.strictEqual(result.sanitized.skill, "Electrician");
  assert.strictEqual(result.sanitized.experience, 8);
  assert.strictEqual(result.sanitized.location, "Bangalore - Whitefield");
});

runTest("Accepts zero (0) years of experience for entry-level workers", () => {
  const input = {
    name: "Pooja Verma",
    email: "pooja@example.com",
    phone: "9988776655",
    skill: "Painter",
    experience: 0,
    location: "Delhi - Dwarka"
  };

  const result = validateWorker(input);
  assert.strictEqual(result.isValid, true);
  assert.strictEqual(result.sanitized.experience, 0);
});

// ----------------------------------------------------------------------------
// Test Group 3: Data Model Persistence & Dynamic Metrics
// ----------------------------------------------------------------------------
console.log("\nTest Group 3: Server Model, CRUD & Dynamic Metrics");

runTest("Model retrieves workers list with initial demonstration records", () => {
  const workers = workerModel.getAllWorkers();
  assert.ok(Array.isArray(workers));
  assert.ok(workers.length > 0, "Initial workers should be present");
});

runTest("Model adds and retrieves a new worker profile", () => {
  const newWorkerPayload = {
    name: "Test Electrician",
    email: "test.elec@example.com",
    phone: "9123456780",
    skill: "Electrician",
    experience: 6,
    location: "Pune - Shivaji Nagar"
  };

  const added = workerModel.addWorker(newWorkerPayload);
  assert.ok(added.id, "Generated ID must exist");
  assert.strictEqual(added.name, "Test Electrician");

  const found = workerModel.getWorkerById(added.id);
  assert.ok(found, "Added worker must be retrievable by ID");
});

runTest("Model computes server-side statistics dynamically", () => {
  const stats = workerModel.getStatistics();
  assert.ok(typeof stats.totalWorkers === "number");
  assert.ok(typeof stats.availableSkills === "number");
  assert.ok(stats.avgExperience !== undefined);
  assert.ok(typeof stats.uniqueLocations === "number");
});

runTest("Model deletes an existing worker profile", () => {
  const tempWorker = workerModel.addWorker({
    name: "Temporary Worker",
    email: "temp@example.com",
    phone: "9000000000",
    skill: "Carpenter",
    experience: 3,
    location: "Hyderabad"
  });

  const deleteResult = workerModel.deleteWorker(tempWorker.id);
  assert.strictEqual(deleteResult.success, true);

  const check = workerModel.getWorkerById(tempWorker.id);
  assert.strictEqual(check, null, "Deleted worker should no longer exist");
});

// ----------------------------------------------------------------------------
// Summary Report
// ----------------------------------------------------------------------------
console.log("\n============================================================");
console.log(`  Tests Completed: ${passedCount} / ${totalCount} Passed`);
if (passedCount === totalCount) {
  console.log("  Status: ALL VALIDATION & SERVER TESTS PASSED ✓");
} else {
  console.log(`  Status: ${totalCount - passedCount} TESTS FAILED ✗`);
  process.exit(1);
}
console.log("============================================================\n");
