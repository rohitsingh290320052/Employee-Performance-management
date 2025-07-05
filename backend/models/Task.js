const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, default: "Pending" },
  priority: String,
  dueDate: Date
});

module.exports = mongoose.model("Task", taskSchema);
