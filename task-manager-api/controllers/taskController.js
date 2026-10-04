const mongoose = require("mongoose");
const Task = require("../models/Task");
const cache = require("../utils/cache");

const ALL_TASKS_CACHE_KEY = "all_tasks";

async function getAllTasks(req, res) {
  try {
    const bypassCache = req.query.cache === "false";

    if (!bypassCache) {
      const cachedTasks = cache.get(ALL_TASKS_CACHE_KEY);

      if (cachedTasks !== undefined) {
        return res.status(200).json({
          success: true,
          source: "cache",
          data: cachedTasks,
        });
      }
    }

    const tasks = await Task.find().sort({ createdAt: -1 });

    if (!bypassCache) {
      cache.set(ALL_TASKS_CACHE_KEY, tasks);
    }

    return res.status(200).json({
      success: true,
      source: "database",
      data: tasks,
    });
  } catch (error) {
    console.error("Get all tasks error:", error);
    return res.status(500).json({
      success: false,
      error: "Unable to fetch tasks",
    });
  }
}

async function getTaskById(req, res) {
  const taskId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({
      success: false,
      error: "Invalid task ID",
    });
  }

  const cacheKey = `task_${taskId}`;

  try {
    const cachedTask = cache.get(cacheKey);

    if (cachedTask !== undefined) {
      return res.status(200).json({
        success: true,
        source: "cache",
        data: cachedTask,
      });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    cache.set(cacheKey, task);

    return res.status(200).json({
      success: true,
      source: "database",
      data: task,
    });
  } catch (error) {
    console.error("Get task error:", error);
    return res.status(500).json({
      success: false,
      error: "Unable to fetch task",
    });
  }
}

async function createTask(req, res) {
  try {
    const { title, description, completed, priority } = req.validatedBody;
    const task = await Task.create({ title, description, completed, priority });

    cache.del(ALL_TASKS_CACHE_KEY);

    return res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("Create task error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      error: "Unable to create task",
    });
  }
}

async function updateTask(req, res) {
  const taskId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({
      success: false,
      error: "Invalid task ID",
    });
  }

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    Object.assign(task, req.validatedBody);
    const updatedTask = await task.save();

    cache.del(ALL_TASKS_CACHE_KEY);
    cache.del(`task_${taskId}`);

    return res.status(200).json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    console.error("Update task error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      error: "Unable to update task",
    });
  }
}

async function deleteTask(req, res) {
  const taskId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({
      success: false,
      error: "Invalid task ID",
    });
  }

  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    cache.del(ALL_TASKS_CACHE_KEY);
    cache.del(`task_${taskId}`);

    return res.status(200).json({
      success: true,
      data: {
        message: "Task deleted successfully",
        deletedTask,
      },
    });
  } catch (error) {
    console.error("Delete task error:", error);
    return res.status(500).json({
      success: false,
      error: "Unable to delete task",
    });
  }
}

function getCacheStats(req, res) {
  return res.status(200).json({
    success: true,
    data: cache.getStats(),
  });
}

function clearCache(req, res) {
  cache.flushAll();

  return res.status(200).json({
    success: true,
    message: "Cache cleared successfully",
  });
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getCacheStats,
  clearCache,
};