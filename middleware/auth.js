const authMiddleware = (req, res, next) => {
  if (!req.user) {
    req.flash("error", "You can't access that page before logging in.");
    return res.redirect("/"); // if auth is false redirect to main page
  }
  next(); // if auth is true then next
};

module.exports = authMiddleware;
