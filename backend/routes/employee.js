const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const Task = require("../models/Task");

// Get tasks
router.get("/tasks", authMiddleware(["employee"]), async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.user.id });
  res.json(tasks);
});

// Update task status
router.put("/update-task/:id", authMiddleware(["employee"]), async (req, res) => {
  await Task.findByIdAndUpdate(req.params.id, { status: req.body.status });
  res.json({ message: "Task updated" });
});

module.exports = router;
