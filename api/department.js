const router = require("express").Router();
const validate = require("validator");
const passport = require("passport");

// Import model
const Department = require("../models/Department");

// @@ Test, GET, Private
router.get(
  "/test",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.status(200).json(req.user);
  }
);

// @@ Add department, POST, Private
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let errors = {};

    // Input validation
    if (validate.isEmpty(req.body.title, { ignore_whitespace: false })) {
      errors.title = "Department title can not be empty.";
      res.status(400).json(errors);
    }
    if (validate.isEmpty(req.body.positions, { ignore_whitespace: false })) {
      errors.positions = "Department positions can not be empty.";
      res.status(400).json(errors);
    }

    // Create new instance of the collection and save to DB
    new Department({
      title: req.body.title,
      positions: req.body.positions.split(",")
    })
      .save()
      .then(dep => res.status(200).json(dep))
      .catch(err => res.status(400).json(err));
  }
);

// @@ Fetch all departments, GET, Private
router.get("", passport.authenticate("jwt", { session: false }), (req, res) => {
  Department.find()
    .then(dep => {
      if (dep) res.status(200).json(dep);
      else
        res.status(404).json({ success: false, msg: "No department found." });
    })
    .catch(err => res.status(400).json(err));
});

// @@ Fetch a specific department, GET, Private
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Department.findOne({ _id: req.params.id })
      .then(dep => {
        if (dep) {
          res.status(200).json(dep);
        } else {
          res.status(404).json({
            success: false,
            msg: "Department not found."
          });
        }
      })
      .catch(err => res.status(400).json(err));
  }
);

// @@ Delete department, DELETE, Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Department.findOneAndDelete({ _id: req.params.id })
      .then(dep => {
        if (dep) {
          res.status(200).json({
            success: true,
            msg: "Department deleted successfully."
          });
        } else {
          res.status(404).json({
            success: false,
            msg: "Department not found."
          });
        }
      })
      .catch(err => res.status(400).json(err));
  }
);

module.exports = router;
