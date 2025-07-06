// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// exports.register = async (req, res) => {
//   const { name, email, password, role, company, branch } = req.body;

//   try {
//     const userExists = await User.findOne({ email });
//     if (userExists) return res.status(400).json({ message: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ name, email, password: hashedPassword, role, company, branch });
//     await user.save();

//     res.status(201).json({ message: "Registered successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Registration error", error: err.message });
//   }
// };

// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
//     res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
//   } catch (err) {
//     res.status(500).json({ message: "Login error", error: err.message });
//   }
// };

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register Admin
exports.registerAdmin = async (req, res) => {
  const { name, email, password, company, branch } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      company,
      branch,
    });

    await user.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Admin registration failed", error: err.message });
  }
};

// Register Employee
exports.registerEmployee = async (req, res) => {
  const { email, name, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.role !== "employee") {
      return res.status(400).json({ message: "You are not authorized to register" });
    }

    user.name = name;
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.status(200).json({ message: "Employee registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Employee registration failed", error: err.message });
  }
};

// Login for both roles
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role, company: user.company, branch: user.branch },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        branch: user.branch,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};

