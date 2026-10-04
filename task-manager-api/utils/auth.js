const jwt = require("jsonwebtoken");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isObjectPayload(payload) {
  return payload !== null && typeof payload === "object" && !Array.isArray(payload);
}

function normalizeEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

function validateRegisterInput(payload = {}) {
  if (!isObjectPayload(payload)) {
    return { isValid: false, message: "Request body must be a JSON object" };
  }

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
  if (!isObjectPayload(payload)) {
    return { isValid: false, message: "Request body must be a JSON object" };
  }

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
  if (!isObjectPayload(payload)) {
    return { isValid: false, message: "Request body must be a JSON object" };
  }

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

  if (payload.description !== undefined && typeof payload.description !== "string") {
    return { isValid: false, message: "Description must be a string" };
  }

  if (payload.completed !== undefined && typeof payload.completed !== "boolean") {
    return { isValid: false, message: "Completed must be a boolean" };
  }

  return {
    isValid: true,
    title,
    priority,
    description,
    completed: payload.completed ?? false,
  };
}

function validateTaskUpdatePayload(payload = {}) {
  if (!isObjectPayload(payload)) {
    return { isValid: false, message: "Request body must be a JSON object" };
  }

  const fields = ["title", "description", "completed", "priority"];
  if (!fields.some((field) => Object.hasOwn(payload, field))) {
    return { isValid: false, message: "At least one task field is required" };
  }

  const validated = {};

  if (Object.hasOwn(payload, "title")) {
    if (typeof payload.title !== "string" || !payload.title.trim()) {
      return { isValid: false, message: "Title cannot be empty" };
    }
    validated.title = payload.title.trim();
  }

  if (Object.hasOwn(payload, "description")) {
    if (typeof payload.description !== "string") {
      return { isValid: false, message: "Description must be a string" };
    }
    validated.description = payload.description.trim();
  }

  if (Object.hasOwn(payload, "completed")) {
    if (typeof payload.completed !== "boolean") {
      return { isValid: false, message: "Completed must be a boolean" };
    }
    validated.completed = payload.completed;
  }

  if (Object.hasOwn(payload, "priority")) {
    if (typeof payload.priority !== "string" || !["low", "medium", "high"].includes(payload.priority.trim().toLowerCase())) {
      return { isValid: false, message: "Priority must be one of: low, medium, high" };
    }
    validated.priority = payload.priority.trim().toLowerCase();
  }

  return { isValid: true, ...validated };
}

function buildAuthToken(payload = {}) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET must be configured in the environment");
  }
  return jwt.sign(payload, secret, { expiresIn: "1h" });
}

module.exports = {
  normalizeEmail,
  validateRegisterInput,
  validateLoginInput,
  validateTaskPayload,
  validateTaskUpdatePayload,
  buildAuthToken,
};
