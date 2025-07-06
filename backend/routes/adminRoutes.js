const express = require("express");
const { addEmployee, assignTask, getAllTasks } = require("../controllers/adminController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const { taskAnalytics } = require("../controllers/adminController");

const router = express.Router();
router.post("/add-employee", authenticate, authorize("admin"), addEmployee);
router.post("/assign-task", authenticate, authorize("admin"), assignTask);
router.get("/tasks", authenticate, authorize("admin"), getAllTasks);
router.get("/analytics", authenticate, authorize("admin"), taskAnalytics);

module.exports = router;
