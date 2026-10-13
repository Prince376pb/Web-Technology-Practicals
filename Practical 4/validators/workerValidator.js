/**
 * Server-Side Validation Module for Labour Connect
 * Demonstrates NodeJS modular architecture and server validation logic.
 */

const ALLOWED_SKILLS = [
  "Plumber",
  "Electrician",
  "Carpenter",
  "Mechanic",
  "Painter",
  "Appliance Repair"
];

/**
 * Validates and sanitizes worker registration data on the server.
 * @param {Object} data - Raw request payload
 * @returns {Object} { isValid: boolean, errors: Object, sanitized: Object }
 */
function validateWorker(data) {
  const errors = {};
  const sanitized = {};

  if (!data || typeof data !== "object") {
    return {
      isValid: false,
      errors: { form: "Invalid request payload. Expected a JSON or form object." },
      sanitized: {}
    };
  }

  // 1. Full Name Validation
  const rawName = typeof data.name === "string" ? data.name.trim() : "";
  if (!rawName) {
    errors.name = "Full name is required on the server.";
  } else if (rawName.length < 3) {
    errors.name = "Name must contain at least 3 characters.";
  } else if (rawName.length > 80) {
    errors.name = "Name cannot exceed 80 characters.";
  } else {
    // Strip dangerous HTML/script characters for safety
    sanitized.name = rawName.replace(/[<>]/g, "");
  }

  // 2. Email Address Validation
  const rawEmail = typeof data.email === "string" ? data.email.trim() : "";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!rawEmail) {
    errors.email = "Email address is required on the server.";
  } else if (!emailRegex.test(rawEmail)) {
    errors.email = "Please enter a valid email address (e.g. name@domain.com).";
  } else if (rawEmail.length > 100) {
    errors.email = "Email address is too long.";
  } else {
    sanitized.email = rawEmail.toLowerCase();
  }

  // 3. Phone Number Validation (Exactly 10 Digits)
  const rawPhone = typeof data.phone === "string" ? data.phone.trim() : "";
  const cleanedPhone = rawPhone.replace(/\D/g, "");
  if (!rawPhone) {
    errors.phone = "Phone number is required on the server.";
  } else if (cleanedPhone.length !== 10) {
    errors.phone = "Phone number must contain exactly 10 digits.";
  } else {
    sanitized.phone = cleanedPhone;
  }

  // 4. Trade / Skill Selection Validation
  const rawSkill = typeof data.skill === "string" ? data.skill.trim() : "";
  if (!rawSkill) {
    errors.skill = "Skill selection is mandatory on the server.";
  } else if (!ALLOWED_SKILLS.includes(rawSkill)) {
    errors.skill = `Invalid trade skill. Allowed trades are: ${ALLOWED_SKILLS.join(", ")}.`;
  } else {
    sanitized.skill = rawSkill;
  }

  // 5. Experience in Years Validation (0 to 50)
  if (data.experience === undefined || data.experience === null || data.experience === "") {
    errors.experience = "Experience in years is required on the server.";
  } else {
    const expNum = Number(data.experience);
    if (isNaN(expNum) || !Number.isInteger(expNum) || expNum < 0 || expNum > 50) {
      errors.experience = "Experience must be an integer between 0 and 50 years.";
    } else {
      sanitized.experience = expNum;
    }
  }

  // 6. Location / Locality Validation
  const rawLocation = typeof data.location === "string" ? data.location.trim() : "";
  if (!rawLocation) {
    errors.location = "Location is required on the server.";
  } else if (rawLocation.length < 2) {
    errors.location = "Location must contain at least 2 characters.";
  } else if (rawLocation.length > 100) {
    errors.location = "Location cannot exceed 100 characters.";
  } else {
    sanitized.location = rawLocation.replace(/[<>]/g, "");
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized
  };
}

module.exports = {
  validateWorker,
  ALLOWED_SKILLS
};
