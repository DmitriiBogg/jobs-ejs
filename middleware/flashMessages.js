const flashMessages = (req, res, next) => {
  res.locals.errors = req.flash("error");
  res.locals.info = req.flash("info");
  next();
};

module.exports = flashMessages;
