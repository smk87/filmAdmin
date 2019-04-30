const router = require("express").Router();
const validate = require("validator");
const passport = require("passport");

// @@ Test, GET, Public
router.get(
  "/test/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.status(200).json("Welcome to crew.");
  }
);

module.exports = router;
