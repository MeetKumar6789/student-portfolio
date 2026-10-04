function validateBody(validator) {
  return (req, res, next) => {
    if (req.body === null || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({
        success: false,
        error: "Request body must be a JSON object",
      });
    }

    const result = validator(req.body);
    if (!result.isValid) {
      return res.status(400).json({
        success: false,
        error: result.message,
      });
    }

    req.validatedBody = result;
    return next();
  };
}

module.exports = { validateBody };