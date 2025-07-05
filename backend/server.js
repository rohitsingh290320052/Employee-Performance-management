const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/employee", require("./routes/employee"));

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(5000, () => console.log("Server running on http://localhost:5000"));
});
