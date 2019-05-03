// Required libraries
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const compression = require("compression");

// Import routes
const admin = require("./api/admin");
const department = require("./api/department");
const crew = require("./api/crew");
const position = require("./api/position");

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
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

//Passport midleware
app.use(passport.initialize());

//Passport Config
require("./config/passport.js")(passport);

// Define routes
app.use("/api/admin", admin);
app.use("/api/departments", department);
app.use("/api/crews", crew);
app.use("/api/positions", position);

// Starts server
app.use(compression()); // Used for compression
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
