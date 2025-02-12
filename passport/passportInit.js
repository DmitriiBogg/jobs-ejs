const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

const passportInit = () => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" }, // use email like username
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
          if (!user) {
            return done(null, false, { message: "Incorrect credentials." });
          }

          const isMatch = await user.comparePassword(password);
          if (isMatch) {
            return done(null, user); // try login
          } else {
            return done(null, false, { message: "Incorrect credentials." }); // false login
          }
        } catch (err) {
          return done(err); // process error
        }
      }
    )
  );

  // serializer user... not really understood this
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // serializer user use ID
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      if (!user) {
        return done(new Error("User not found"));
      }
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};

module.exports = passportInit;
