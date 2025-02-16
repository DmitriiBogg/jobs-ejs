const storeLocals = (req, res, next) => {
  console.log("storeLocals middleware called"); //delete after
  console.log("req.user in storeLocals:", req.user); // delete after

  res.locals.user = req.user || null; // user info if his logged
  res.locals.info = req.flash("info"); // info message
  res.locals.errors = req.flash("error"); // info errors
  next();
};

module.exports = storeLocals;
