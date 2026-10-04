const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Task = require("./models/Task");
const User = require("./models/User");
const { authMiddleware } = require("./middleware/auth");
const { validateBody } = require("./middleware/validate");
const {
  validateRegisterInput,
  validateLoginInput,
  validateTaskPayload,
  validateTaskUpdatePayload,
} = require("./utils/auth");

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in task-manager-api/.env");
}

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

app.use(express.json());

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

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      error: "Invalid JSON payload",
    });
  }

  next(err);
});

function validateTaskId(req, res, next) {
  const taskId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({
      success: false,
      error: "Invalid task ID",
    });
  }

  req.taskId = taskId;
  next();
}

function sendError(res, statusCode, message) {
  return res.status(statusCode).json({
    success: false,
    error: message,
  });
}

app.post("/register", validateBody(validateRegisterInput), async (req, res) => {
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
    if (error.code === 11000) {
      return sendError(res, 409, "User already exists");
    }

    if (error.name === "ValidationError") {
      return sendError(res, 400, error.message);
    }

    return sendError(res, 500, "Unable to register user");
  }
});

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

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

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
    return sendError(res, 500, "Unable to log in");
  }
});

app.get("/me", authMiddleware, async (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.user,
  });
});

app.use("/tasks", authMiddleware);

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    return sendError(res, 500, "Unable to fetch tasks");
  }
});

app.get("/tasks/:id", validateTaskId, async (req, res) => {
  try {
    const task = await Task.findById(req.taskId);

    if (!task) {
      return sendError(res, 404, "Task not found");
    }

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return sendError(res, 500, "Unable to fetch task");
  }
});

app.post("/tasks", validateBody(validateTaskPayload), async (req, res) => {
  const { title, description, completed, priority } = req.validatedBody;
  try {
    const newTask = await Task.create({
      title,
      description,
      completed,
      priority,
    });

    return res.status(201).json({
      success: true,
      data: newTask,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return sendError(res, 400, error.message);
    }

    return sendError(res, 500, "Unable to create task");
  }
});

app.put("/tasks/:id", validateTaskId, validateBody(validateTaskUpdatePayload), async (req, res) => {
  try {
    const task = await Task.findById(req.taskId);

    if (!task) {
      return sendError(res, 404, "Task not found");
    }

    Object.assign(task, req.validatedBody);

    const updatedTask = await task.save();

    return res.status(200).json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return sendError(res, 400, error.message);
    }

    return sendError(res, 500, "Unable to update task");
  }
});

app.delete("/tasks/:id", validateTaskId, async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.taskId);

    if (!deletedTask) {
      return sendError(res, 404, "Task not found");
    }

    return res.status(200).json({
      success: true,
      data: {
        message: "Task deleted successfully",
        deletedTask,
      },
    });
  } catch (error) {
    return sendError(res, 500, "Unable to delete task");
  }
});

app.get("/test-error", (req, res, next) => {
  next(new Error("Simulated server error for testing"));
});

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  return res.status(500).json({
    success: false,
    error: "Something went wrong",
  });
});

async function startServer() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/task-manager-db";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
