const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Admin or Employee Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token, role: user.role, user });
});

// Admin Registration (No invite code)
router.post("/register-admin", async (req, res) => {
  const { name, email, password, company, branch } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const admin = new User({ name, email, password: hashed, company, branch, role: "admin" });
  await admin.save();
  res.status(201).json({ message: "Admin registered" });
});

// Employee Registration
router.post("/register-employee", async (req, res) => {
  const { email, name, password } = req.body;
  const existing = await User.findOne({ email });
  if (!existing || existing.role !== "employee") return res.status(400).json({ error: "Unauthorized registration" });

  existing.name = name;
  existing.password = await bcrypt.hash(password, 10);
  await existing.save();
  res.status(200).json({ message: "Registered successfully" });
});

module.exports = router;
