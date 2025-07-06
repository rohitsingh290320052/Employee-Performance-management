const express = require("express");
const { getTasks, updateTaskStatus } = require("../controllers/employeeController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

// Get tasks for logged-in employee
router.get("/tasks", authenticate, getTasks);

// ✅ Fix: Include :id param in the update route
router.put("/update-task", authenticate, updateTaskStatus);

module.exports = router;
