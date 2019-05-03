const router = require("express").Router();
const validate = require("validator");
const passport = require("passport");

// Import models
const Crew = require("../models/Crew");
const Department = require("../models/Department");

// @@ Add crew to department, POST, Private
router.post(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let errors = {};

    // Input validation
    if (validate.isEmpty(req.body.name, { ignore_whitespace: false })) {
      errors.name = "Crew's name can not be empty.";
      return res.status(400).json(errors);
    }

    Department.findById(req.params.id, (err, dep) => {
      if (!dep) {
        return res.status(404).json({
          success: false,
          msg: "Invalid department"
        });
      } else {
        // Save to DB
        new Crew({
          name: req.body.name,
          positions: req.body.positions.split(",") || "",
          experience: req.body.experience || "",
          imdb: req.body.imdb || "",
          email: req.body.email || "",
          phone: req.body.phone || "",
          skype: req.body.skype || "",
          facebook: req.body.facebook || "",
          twitter: req.body.twitter || ""
        })
          .save()
          .then(crew => {
            Department.findById(req.params.id).then(dep => {
              // Update Department collections
              dep.members.push(crew._id);
              // Save changes to Department collecton
              dep
                .save()
                .then(() => res.status(200).json(crew))
                .catch(err => console.log(err));
            });
          })
          .catch(err => res.status(400).json(err));
      }
    });
  }
);

// @@ Edit crew, PUT, Private
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let errors = {};

    // Input validation
    if (validate.isEmpty(req.body.name, { ignore_whitespace: false })) {
      errors.name = "Crew's name can not be empty.";
      return res.status(400).json(errors);
    }

    Crew.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        positions: req.body.positions.split(",") || "",
        experience: req.body.experience || "",
        imdb: req.body.imdb || "",
        email: req.body.email || "",
        phone: req.body.phone || "",
        skype: req.body.skype || "",
        facebook: req.body.facebook || "",
        twitter: req.body.twitter || ""
      },
      { new: true }
    )
      .then(crew =>
        res
          .status(200)
          .json({ crew, success: true, msg: "Crew updated successfully." })
      )
      .catch(() =>
        res.status(200).json({ success: false, msg: "Crew not found." })
      );
  }
);

// @@ Delete crew from position, DELETE, Private

module.exports = router;
