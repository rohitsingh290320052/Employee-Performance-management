const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const User = require("../models/User");
const Task = require("../models/Task");

// Add Employee
router.post("/add-employee", authMiddleware(["admin"]), async (req, res) => {
  const { email, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ error: "Employee exists" });

  const user = new User({
    email,
    role: role || "employee",
    company: req.user.company,
    branch: req.user.branch
  });

  await user.save();
  res.status(201).json({ message: "Employee added" });
});

// Assign Task
router.post("/assign-task", authMiddleware(["admin"]), async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.status(201).json({ message: "Task assigned" });
});

module.exports = router;
