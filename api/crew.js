const router = require("express").Router();
const validate = require("validator");
const passport = require("passport");

// Import models
const Crew = require("../models/Crew");
const Position = require("../models/Position");

// @@ Fetch all crew, GET, Private
router.get("", passport.authenticate("jwt", { session: false }), (req, res) => {
  Crew.find()
    .then(crews => res.status(200).json(crews))
    .catch(() =>
      res.status(404).json({ success: false, msg: "No crew found." })
    );
});

// @@ Fetch a specific crew, GET, Private
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Crew.findById(req.params.id)
      .then(crews => res.status(200).json(crews))
      .catch(() =>
        res.status(404).json({ success: false, msg: "Crew not found." })
      );
  }
);

// @@ Add crew to position, POST, Private
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

    Position.findById(req.params.id, (err, pos) => {
      if (!pos) {
        return res.status(404).json({
          success: false,
          msg: "Position not found."
        });
      } else {
        // Save to DB
        new Crew({
          name: req.body.name,
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
            Position.findById(req.params.id).then(pos => {
              // Update Postion collection
              pos.members.push(crew._id);
              // Save changes to Position collecton
              pos
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
        experience: req.body.experience || "",
        imdb: req.body.imdb || "",
        email: req.body.email || "",
        phone: req.body.phone || "",
        skype: req.body.skype || "",
        facebook: req.body.facebook || "",
        twitter: req.body.twitter || ""
      },
      { new: true },
      (err, crew) => {
        if (!crew) {
          return res.status(404).json({
            success: false,
            msg: "Crew not found."
          });
        } else {
          return res.status(200).json({
            crew,
            success: true,
            msg: "Crew updated successfully."
          });
        }
      }
    );
  }
);

// @@ Delete crew from position, DELETE, Private
router.delete(
  ":/id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Crew.findByIdAndDelete(req.params.id).then(crew => {
      if (crew) {
        return res.status(200).json({
          crew,
          success: true,
          msg: "Crew deleted successfully."
        });
      } else {
        return res.status(404).json({
          success: false,
          msg: "Crew not found."
        });
      }
    });
  }
);

module.exports = router;
