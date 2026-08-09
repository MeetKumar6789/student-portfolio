const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Task = require("./models/Task");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Global request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// Parse incoming JSON bodies
app.use(express.json());

// Content-Type validation middleware for POST and PUT requests
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

// Handle malformed JSON payloads cleanly
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      error: "Invalid JSON payload",
    });
  }

  next(err);
});

// Task ID validation middleware for routes containing :id
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

// GET /tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    return sendError(res, 500, "Unable to fetch tasks");
  }
});

// GET /tasks/:id
app.get("/tasks/:id", validateTaskId, async (req, res) => {
  try {
    const task = await Task.findById(req.taskId);

    if (!task) {
      return sendError(res, 404, "Task not found");
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return sendError(res, 500, "Unable to fetch task");
  }
});

// POST /tasks
app.post("/tasks", async (req, res) => {
  const { title, description, completed, priority } = req.body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return sendError(res, 400, "Title is required");
  }

  if (!priority || typeof priority !== "string") {
    return sendError(res, 400, "Priority is required");
  }

  try {
    const newTask = await Task.create({
      title: title.trim(),
      description: description || "",
      completed: Boolean(completed),
      priority: priority.trim().toLowerCase(),
    });

    res.status(201).json({
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

// PUT /tasks/:id
app.put("/tasks/:id", validateTaskId, async (req, res) => {
  try {
    const task = await Task.findById(req.taskId);

    if (!task) {
      return sendError(res, 404, "Task not found");
    }

    const { title, description, completed, priority } = req.body;

    if (title !== undefined && (typeof title !== "string" || title.trim() === "")) {
      return sendError(res, 400, "Title cannot be empty");
    }

    if (priority !== undefined && typeof priority !== "string") {
      return sendError(res, 400, "Priority must be a string");
    }

    task.title = title !== undefined ? title.trim() : task.title;
    task.description = description !== undefined ? description : task.description;
    task.completed = completed !== undefined ? Boolean(completed) : task.completed;
    task.priority = priority !== undefined ? priority.trim().toLowerCase() : task.priority;

    const updatedTask = await task.save();

    res.status(200).json({
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

// DELETE /tasks/:id
app.delete("/tasks/:id", validateTaskId, async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.taskId);

    if (!deletedTask) {
      return sendError(res, 404, "Task not found");
    }

    res.status(200).json({
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

// Error demonstration route
app.get("/test-error", (req, res, next) => {
  next(new Error("Simulated server error for testing"));
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
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
