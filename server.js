// Required libraries
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

// Import models
const Admin = require("./models/Admin");

// Import routes
const admin = require("./api/admin");

// Initialize express app
const app = express();

// Add bodyPaser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to DB
const db = require("./utils/keys").db;
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB connected."))
  .catch(err => console.log(err));

// Define routes
app.use("/api/admin", admin);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
