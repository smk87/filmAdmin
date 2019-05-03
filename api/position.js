const router = require("express").Router();
const validate = require("validator");
const passport = require("passport");

// Import model
const Department = require("../models/Department");
const Position = require("../models/Position");

// @@ Edit a position, PUT, Private
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Input validation
    let errors = {};
    if (validate.isEmpty(req.body.title, { ignore_whitespace: false })) {
      errors.title = "Department title can not be empty.";
      return res.status(400).json(errors);
    }

    Position.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title },
      { new: true }
    )
      .then(pos => res.status(200).json(pos))
      .catch(err => console.log(err));
  }
);

module.exports = router;
