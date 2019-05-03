const router = require("express").Router();
const validate = require("validator");
const passport = require("passport");

// Import model
const Department = require("../models/Department");
const Position = require("../models/Position");

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
  "",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let errors = {};

    // Input validation
    if (validate.isEmpty(req.body.title, { ignore_whitespace: false })) {
      errors.title = "Department title can not be empty.";
      return res.status(400).json(errors);
    }

    // Create new instance of the collection and save to DB
    new Department({
      title: req.body.title
    })
      .save()
      .then(dep => {
        if (req.body.positions) {
          // Add a position to the department
          new Position({ title: req.body.positions }).save().then(pos => {
            dep.positions.push(pos._id);
            dep.save().then(dep => res.status(200).json(dep));
          });
        } else {
          return res.status(200).json(dep);
        }
      })
      .catch(err => res.status(400).json(err));
  }
);

// @@ Fetch all departments, GET, Private
router.get("", passport.authenticate("jwt", { session: false }), (req, res) => {
  Department.find()
    .populate("positions", ["title", "members"])
    .then(dep => {
      if (dep) return res.status(200).json(dep);
      else
        return res
          .status(404)
          .json({ success: false, msg: "No department found." });
    })
    .catch(err => res.status(400).json(err));
});

// @@ Fetch a specific department, GET, Private
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Department.findOne({ _id: req.params.id })
      .populate("positions", ["title", "members"])
      .then(dep => {
        return res.status(200).json(dep);
      })
      .catch(() =>
        res.status(404).json({
          success: false,
          msg: "Department not found."
        })
      );
  }
);

// @@ Edit department, PUT, Private
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let errors = {};

    // Input validation
    if (validate.isEmpty(req.body.title, { ignore_whitespace: false })) {
      errors.title = "Department title can not be empty.";
      return res.status(400).json(errors);
    }

    Department.findOneAndUpdate(
      { _id: req.params.id },
      { title: req.body.title },
      { new: true }
    )
      .then(dep => res.status(200).json(dep))
      .catch(() =>
        res.status(404).json({
          success: false,
          msg: "Department not found."
        })
      );
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

// @@ Add position to department, POST, Private
router.post(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Department.findById(req.params.id)
      .then(dep => {
        // Add a position to the department
        new Position({ title: req.body.positions }).save().then(pos => {
          dep.positions.push(pos._id);
          dep.save().then(() => res.status(200).json(pos));
        });
      })
      .catch(() =>
        res.status(404).json({
          success: false,
          msg: "Department not found."
        })
      );
  }
);

// @@ Delete position from department, DELETE, Private
router.delete(
  "/:id/:pid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Department.findById(req.params.id)
      .then(dep => {
        Position.findByIdAndDelete(req.params.pid).then(pos => {
          if (pos) {
            // Delete from Department
            const delIndex = dep.positions.indexOf(req.params.pid);
            dep.positions.splice(delIndex, 1);
            dep.save().then(() => {
              return res.status(200).json({
                success: true,
                msg: "Position deleted successfully.."
              });
            });
          } else {
            return res.status(404).json({
              success: false,
              msg: "Position not found."
            });
          }
        });
      })
      .catch(() =>
        res.status(404).json({ success: false, msg: "Department not found." })
      );
  }
);

module.exports = router;
