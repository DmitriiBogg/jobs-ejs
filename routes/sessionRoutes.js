console.log("sessionRoutes.js loaded");
const express = require("express");
const passport = require("passport");
const router = express.Router();

// import controllers
const {
  logonShow,
  registerShow,
  registerDo,
  logoff,
} = require("../controllers/sessionController");

// router no register
router.route("/register").get(registerShow).post(registerDo);

// router logon
router
  .route("/logon")
  .get(logonShow)
  .post(
    passport.authenticate("local", {
      successRedirect: "/", //  redirect on successful login
      failureRedirect: "/sessions/logon", // error redirect
      failureFlash: true, // flash message for errors
    })
  );

// router out from system
router.route("/logoff").post(logoff);

module.exports = router;
