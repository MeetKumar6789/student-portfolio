const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const {
  AIServiceError,
  generateTaskDescription,
  isAiConfigured,
} = require("../services/aiService");

const MAX_TITLE_LENGTH = 160;
const DEFAULT_COOLDOWN_MS = 60_000;

function createAiRouter({
  authenticate = authMiddleware,
  generateDescription = generateTaskDescription,
  isConfigured = isAiConfigured,
  now = Date.now,
  cooldownMs = DEFAULT_COOLDOWN_MS,
} = {}) {
  const router = express.Router();
  const lastRequestByUser = new Map();

  router.post("/generate-description", authenticate, async (req, res) => {
    const title = req.body?.title;

    if (
      !req.body ||
      typeof req.body !== "object" ||
      Array.isArray(req.body) ||
      typeof title !== "string" ||
      !title.trim() ||
      title.trim().length > MAX_TITLE_LENGTH
    ) {
      return res.status(400).json({
        success: false,
        error: `Title must be a non-empty string of at most ${MAX_TITLE_LENGTH} characters.`,
      });
    }

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        error: "Authentication is required.",
      });
    }

    if (!isConfigured()) {
      return res.status(503).json({
        success: false,
        error: "AI description generation is not configured.",
      });
    }

    const currentTime = now();
    const userId = String(req.user.id);

    for (const [limitedUserId, lastRequestAt] of lastRequestByUser) {
      if (currentTime - lastRequestAt >= cooldownMs) {
        lastRequestByUser.delete(limitedUserId);
      }
    }

    const lastRequestAt = lastRequestByUser.get(userId);
    if (lastRequestAt !== undefined && currentTime - lastRequestAt < cooldownMs) {
      const retryAfterSeconds = Math.ceil(
        (cooldownMs - (currentTime - lastRequestAt)) / 1000
      );
      res.set("Retry-After", String(retryAfterSeconds));
      return res.status(429).json({
        success: false,
        error: `Please wait ${retryAfterSeconds} seconds before generating another description.`,
      });
    }

    lastRequestByUser.set(userId, currentTime);

    try {
      const description = await generateDescription(title.trim());
      if (typeof description !== "string" || !description.trim()) {
        throw new AIServiceError(
          502,
          "The AI service returned an invalid description. Please try again."
        );
      }

      return res.status(200).json({
        success: true,
        description: description.trim(),
      });
    } catch (error) {
      if (error instanceof AIServiceError) {
        return res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      }

      console.error("Unexpected AI description error:", error?.name || "Error");
      return res.status(502).json({
        success: false,
        error: "AI description generation failed. Please try again.",
      });
    }
  });

  return router;
}

module.exports = { createAiRouter, MAX_TITLE_LENGTH, DEFAULT_COOLDOWN_MS };
