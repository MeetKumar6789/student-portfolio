const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const User = require("./models/User");
const taskRoutes = require("./routes/taskRoutes");

const { authMiddleware } = require("./middleware/auth");
const { validateBody } = require("./middleware/validate");

const {
  validateRegisterInput,
  validateLoginInput,
} = require("./utils/auth");

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in task-manager-api/.env");
}

const app = express();

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// ====================================================
// MIDDLEWARE
// ====================================================

app.use(cors());

// Request timing
app.use((req, res, next) => {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const end = process.hrtime.bigint();

    const durationMs = Number(end - start) / 1_000_000;

    console.log(
      `${req.method} ${req.originalUrl} - ${res.statusCode} - ${durationMs.toFixed(
        2
      )} ms`
    );
  });

  next();
});

app.use(express.json());

// Check JSON content type for POST and PUT
app.use((req, res, next) => {
  if (req.method === "POST" || req.method === "PUT") {
    const contentType = req.headers["content-type"];

    if (!contentType || !contentType.includes("application/json")) {
      return res.status(400).json({
        success: false,
        error: "Content-Type must be application/json",
      });
    }
  }

  next();
});

// Invalid JSON handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      error: "Invalid JSON payload",
    });
  }

  next(err);
});

// ====================================================
// HELPER FUNCTIONS
// ====================================================

function sendError(res, statusCode, message) {
  return res.status(statusCode).json({
    success: false,
    error: message,
  });
}

// ====================================================
// AUTH ROUTES
// ====================================================

// REGISTER
app.post(
  "/register",
  validateBody(validateRegisterInput),
  async (req, res) => {
    const { email, password } = req.validatedBody;

    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return sendError(res, 409, "User already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        email,
        password: hashedPassword,
      });

      return res.status(201).json({
        success: true,
        data: {
          id: user._id,
          email: user.email,
          message: "User registered successfully",
        },
      });
    } catch (error) {
      console.error("Register error:", error);

      if (error.code === 11000) {
        return sendError(res, 409, "User already exists");
      }

      if (error.name === "ValidationError") {
        return sendError(res, 400, error.message);
      }

      return sendError(res, 500, "Unable to register user");
    }
  }
);

// LOGIN
app.post("/login", validateBody(validateLoginInput), async (req, res) => {
  const { email, password } = req.validatedBody;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return sendError(res, 401, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return sendError(res, 401, "Invalid email or password");
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      success: true,
      token,
      data: {
        user: {
          id: user._id,
          email: user.email,
        },
        expiresIn: "1h",
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return sendError(res, 500, "Unable to log in");
  }
});

// CURRENT USER
app.get("/me", authMiddleware, async (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.user,
  });
});

app.use("/tasks", taskRoutes);

// ====================================================
// TEST ERROR
// ====================================================

app.get("/test-error", (req, res, next) => {
  next(new Error("Simulated server error for testing"));
});

// ====================================================
// 404 HANDLER
// ====================================================

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// ====================================================
// GLOBAL ERROR HANDLER
// ====================================================

app.use((err, req, res, next) => {
  console.error(err.stack);

  return res.status(500).json({
    success: false,
    error: "Something went wrong",
  });
});

// ====================================================
// START SERVER
// ====================================================

async function startServer() {
  try {
    const mongoUri =
      process.env.MONGO_URI ||
      "mongodb://127.0.0.1:27017/task-manager-db";

    await mongoose.connect(mongoUri);

    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Cache TTL: 60 seconds`);
      console.log(`Cache: node-cache`);
    });
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  }
}

startServer();