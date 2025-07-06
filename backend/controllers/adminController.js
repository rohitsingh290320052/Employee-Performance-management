const User = require("../models/User");
const Task = require("../models/Task");

exports.addEmployee = async (req, res) => {
  const { email, role } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Employee already exists" });

    const employee = new User({ email, role, company: req.user.company, branch: req.user.branch, password: "temp123" });
    await employee.save();

    res.status(201).json({ message: "Employee added" });
  } catch (err) {
    res.status(500).json({ message: "Error adding employee", error: err.message });
  }
};

exports.assignTask = async (req, res) => {
  const { title, description, dueDate, priority, assignedTo } = req.body;

  try {
    const task = new Task({ title, description, dueDate, priority, assignedTo });
    await task.save();

    res.status(201).json({ message: "Task assigned" });
  } catch (err) {
    res.status(500).json({ message: "Error assigning task", error: err.message });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks", error: err.message });
  }
};


exports.taskAnalytics = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee", company: req.user.company });

    const result = await Promise.all(
      employees.map(async (emp) => {
        const tasks = await Task.find({ assignedTo: emp._id });
        const total = tasks.length;
        const completed = tasks.filter((t) => t.status === "Completed").length;
        const pending = total - completed;

        return {
          name: emp.name || emp.email,
          email: emp.email,
          total,
          completed,
          pending,
        };
      })
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching analytics", error: error.message });
  }
};
