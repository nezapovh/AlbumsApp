const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/user");

passport.use(
  new LocalStrategy(async function verify(email, password, done) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, {
          message: "Incorrect username or password.",
        });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return done(null, false, {
          message: "Incorrect username or password.",
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// Serialize user to store in session
passport.serializeUser((user, done) => {
  console.log(user);
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    console.log(user);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
