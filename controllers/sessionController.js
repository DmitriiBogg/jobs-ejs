const User = require("../models/User");
const parseVErr = require("../utils/parseValidationErr");
// registration page
const registerShow = (req, res) => {
  res.render("register");
};

const registerDo = async (req, res, next) => {
  if (req.body.password !== req.body.password1) {
    req.flash("error", "The passwords entered do not match.");
    return res.render("register", { errors: req.flash("error") });
  }

  try {
    await User.create(req.body);
    res.redirect("/");
  } catch (e) {
    if (e.name === "ValidationError") {
      parseVErr(e, req); // mmm... validation errors
    } else if (e.name === "MongoServerError" && e.code === 11000) {
      req.flash("error", "That email address is already registered.");
    } else {
      return next(e);
    }
    res.render("register", { errors: req.flash("error") });
  }
};

// out from system
const logoff = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
};

// show login page
const logonShow = (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("logon", {
    errors: req.flash("error"),
    info: req.flash("info"),
  });
};

module.exports = {
  registerShow,
  registerDo,
  logoff,
  logonShow,
};
