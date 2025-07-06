// const mongoose = require("mongoose");

// const taskSchema = new mongoose.Schema({
//   title: String,
//   description: String,
//   dueDate: Date,
//   priority: String,
//   status: { type: String, default: "Assigned" },
//   assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   proof: String,
// });

// module.exports = mongoose.model("Task", taskSchema);

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Low",
  },
  status: {
    type: String,
    enum: ["Assigned", "Completed"],
    default: "Assigned",
  },
  proof: String, // ✅ NEW FIELD
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Task", taskSchema);
