const express = require("express");
const taskController = require("../controllers/taskController");
const { authMiddleware } = require("../middleware/auth");
const { validateBody } = require("../middleware/validate");
const {
  validateTaskPayload,
  validateTaskUpdatePayload,
} = require("../utils/auth");

const router = express.Router();

router.use(authMiddleware);

router.get("/cache/stats", taskController.getCacheStats);
router.delete("/cache/clear", taskController.clearCache);

router.get("/", taskController.getAllTasks);
router.get("/:id", taskController.getTaskById);
router.post("/", validateBody(validateTaskPayload), taskController.createTask);
router.put(
  "/:id",
  validateBody(validateTaskUpdatePayload),
  taskController.updateTask
);
router.delete("/:id", taskController.deleteTask);

module.exports = router;