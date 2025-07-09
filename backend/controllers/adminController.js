const User = require("../models/User");
const Task = require("../models/Task");

// Add new employee
exports.addEmployee = async (req, res) => {
  const { email, role } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Employee already exists" });

    const employee = new User({
      email,
      role,
      company: req.user.company,
      branch: req.user.branch,
      password: "temp123", // temporary password
    });

    await employee.save();
    res.status(201).json({ message: "Employee added" });
  } catch (err) {
    res.status(500).json({ message: "Error adding employee", error: err.message });
  }
};

// Assign a task to employee (includes assignedBy for filtering)
exports.assignTask = async (req, res) => {
  const { title, description, dueDate, priority, assignedTo } = req.body;

  try {
    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      assignedTo,
      assignedBy: req.user._id // <-- This line ensures we can filter later
    });
    await task.save();

    res.status(201).json({ message: "Task assigned" });
  } catch (err) {
    res.status(500).json({ message: "Error assigning task", error: err.message });
  }
};


// Get only tasks assigned by this admin
exports.getAllTasks = async (req, res) => {
  try {
    const adminId = req.user._id; // Assuming the admin is authenticated
    const { email } = req.query;

    let filter = { assignedBy: adminId }; // Show only tasks assigned by this admin

    if (email) {
      const employee = await User.findOne({ email });
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      filter.assignedTo = employee._id;
    }

    const tasks = await Task.find(filter).populate("assignedTo", "email name");
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks", error: err.message });
  }
};


// Analytics for employees under the same company
exports.taskAnalytics = async (req, res) => {
  try {
    const employees = await User.find({
      role: "employee",
      company: req.user.company,
    });

    const result = await Promise.all(
      employees.map(async (emp) => {
        const tasks = await Task.find({
          assignedTo: emp._id,
          assignedBy: req.user._id, // ✅ only count admin's tasks
        });

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


// Lookup user by email
exports.lookupUser = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error looking up user", error: err.message });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findByIdAndUpdate(id, updates, { new: true });
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task updated", task });
  } catch (err) {
    res.status(500).json({ message: "Error updating task", error: err.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task", error: err.message });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "Employee" }).select("name email");
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ message: "Failed to get employees", error: err.message });
  }
};

exports.getTasksByEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const tasks = await Task.find({ assignedTo: id }).populate("assignedTo", "email name");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks", error: err.message });
  }
};
