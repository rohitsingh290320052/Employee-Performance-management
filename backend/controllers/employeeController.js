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
  const { taskId, status, proof } = req.body;

  if (!taskId || !status) {
    return res.status(400).json({ message: "Task ID and status are required" });
  }

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // ✅ Ensure only the assigned user can update it
    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not allowed to update this task" });
    }

    task.status = status;

    if (proof) {
      task.proof = proof;
    }

    await task.save();

    res.json({ message: "Task updated successfully", task });
  } catch (err) {
    res.status(500).json({ message: "Error updating task", error: err.message });
  }
};

