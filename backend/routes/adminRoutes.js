const express = require("express");
const { addEmployee, assignTask, getAllTasks, lookupUser, updateTask, deleteTask, taskAnalytics, getAllEmployees, getTasksByEmployee } = require("../controllers/adminController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");


const router = express.Router();
router.post("/add-employee", authenticate, authorize("admin"), addEmployee);
router.post("/assign-task", authenticate, authorize("admin"), assignTask);
router.get("/tasks", authenticate, authorize("admin"), getAllTasks);
router.get("/analytics", authenticate, authorize("admin"), taskAnalytics);
router.get("/lookup/:email", authenticate, lookupUser);
router.put("/task/:id", authenticate, updateTask);
router.delete("/task/:id", authenticate, deleteTask);
router.get("/employees", authenticate, getAllEmployees);
router.get("/tasks-by-employee/:id", authenticate, getTasksByEmployee);




module.exports = router;
