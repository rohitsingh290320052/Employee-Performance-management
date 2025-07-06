const Task = require("../models/Task");

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks", error: err.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  const { taskId, status } = req.body;

  try {
    await Task.findByIdAndUpdate(taskId, { status });
    res.json({ message: "Task updated" });
  } catch (err) {
    res.status(500).json({ message: "Error updating task", error: err.message });
  }
};
