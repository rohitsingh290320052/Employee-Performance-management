// const express = require("express");
// const { register, login } = require("../controllers/authController");

// const router = express.Router();
// router.post("/register", register);
// router.post("/login", login);

// module.exports = router;

const express = require("express");
const {
  registerAdmin,
  registerEmployee,
  login,
} = require("../controllers/authController");

const router = express.Router();

// Admin registration
router.post("/register-admin", registerAdmin);

// Employee registration
router.post("/register-employee", registerEmployee);

// Login
router.post("/login", login);

module.exports = router;
