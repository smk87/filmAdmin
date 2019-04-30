const router = require("express").Router();
const validate = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = require("../utils/keys").secret;

// Import model
const Admin = require("../models/Admin");

// @@ Test, GET, Public
router.get("/", (req, res) => {
  res.status(200).json("Welcome!");
});

// @@ Create Admin, POST, Public
router.post("/create", (req, res) => {
  let errors = {};
  //Check username
  if (validate.isEmpty(req.body.username, { ignore_whitespace: true })) {
    errors.username = "Username can not be empty";
  } else if (!validate.isLength(req.body.username, { min: 4, max: 12 })) {
    errors.username = "Username length must be in 4-12 characters";
  }
  //Check password
  if (validate.isEmpty(req.body.password, { ignore_whitespace: true })) {
    errors.password = "Password can not be empty";
  } else if (!validate.isLength(req.body.password, { min: 5, max: 20 })) {
    errors.password = "Password length must be in 5-20 characters";
  }
  if (Object.keys(errors).length === 0) {
    Admin.findOne({ username: req.body.username }).then(user => {
      if (user) {
        errors.username = "User already exist";
        res.status(400).json(errors);
      } else {
        bcrypt.genSalt(15, (err, salt) => {
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) throw err;
            const newAdmin = new Admin({
              username: req.body.username,
              password: hash
            });
            newAdmin
              .save()
              .then(admin => res.json(admin))
              .catch(err => console.log(err));
          });
        });
      }
    });
  } else {
    res.status(400).json(errors);
  }
});

// @@ Login, POST, Public
router.post("/login", (req, res) => {
  let errors = {};
  let username = req.body.username;
  let password = req.body.password;

  Admin.findOne({ username: username }).then(user => {
    if (!user) {
      errors.username = "User does not exist";
      res.status(404).json(errors);
    } else {
      //Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          //Password matched
          const payload = { id: user._id, username: user.username };

          //Sign Token
          jwt.sign(payload, secret, { expiresIn: 3600 }, (err, token) => {
            if (err) console.log(err);
            res.status(200).json({
              success: true,
              token: "Bearer " + token
            });
          });
        } else {
          errors.password = "Password is incorrect";
          res.status(400).json(errors);
        }
      });
    }
  });
});

module.exports = router;
