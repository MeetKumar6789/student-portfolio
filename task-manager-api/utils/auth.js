const jwt = require("jsonwebtoken");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

function validateRegisterInput(payload = {}) {
  const email = normalizeEmail(payload.email);
  const password = typeof payload.password === "string" ? payload.password : "";

  if (!email || !EMAIL_PATTERN.test(email)) {
    return { isValid: false, message: "Valid email is required" };
  }

  if (password.length < 6) {
    return { isValid: false, message: "Password must be at least 6 characters long" };
  }

  return { isValid: true, email, password };
}

function validateLoginInput(payload = {}) {
  const email = normalizeEmail(payload.email);
  const password = typeof payload.password === "string" ? payload.password : "";

  if (!email || !EMAIL_PATTERN.test(email)) {
    return { isValid: false, message: "Valid email is required" };
  }

  if (!password || password.length < 6) {
    return { isValid: false, message: "Password must be at least 6 characters long" };
  }

  return { isValid: true, email, password };
}

function validateTaskPayload(payload = {}) {
  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  const priority = typeof payload.priority === "string" ? payload.priority.trim().toLowerCase() : "";
  const description = typeof payload.description === "string" ? payload.description.trim() : "";

  if (!title) {
    return { isValid: false, message: "Title is required" };
  }

  if (!priority) {
    return { isValid: false, message: "Priority is required" };
  }

  if (!["low", "medium", "high"].includes(priority)) {
    return { isValid: false, message: "Priority must be one of: low, medium, high" };
  }

  return {
    isValid: true,
    title,
    priority,
    description,
  };
}

function buildAuthToken(payload = {}) {
  const secret = process.env.JWT_SECRET || "dev-secret-change-me";
  return jwt.sign(payload, secret, { expiresIn: "1h" });
}

module.exports = {
  normalizeEmail,
  validateRegisterInput,
  validateLoginInput,
  validateTaskPayload,
  buildAuthToken,
};
