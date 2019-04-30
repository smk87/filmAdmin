const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const Admin = mongoose.model("admins");
const secret = require("../utils/keys").secret;

const opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secret;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      Admin.findById(jwt_payload.id)
        .then(admin => {
          if (admin) {
            return done(null, admin);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};
