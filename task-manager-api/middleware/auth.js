const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Authorization token required",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Authorization token required",
    });
  }

  try {
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User not found or token is invalid",
      });
    }

    req.user = {
      id: user._id,
      email: user.email,
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Invalid or expired token",
    });
  }
}

module.exports = { authMiddleware };
