const express = require("express");
const router = express.Router();

// show secret word
router.get("/", (req, res) => {
  if (!req.session.secretWord) {
    req.session.secretWord = "syzygy"; // def secret word
  }
  res.render("secretWord", { secretWord: req.session.secretWord });
});

// update secret word
router.post("/", (req, res) => {
  if (req.body.secretWord.toUpperCase().startsWith("P")) {
    req.flash("error", "That word won't work!");
    req.flash("error", "You can't use words that start with P.");
  } else {
    req.session.secretWord = req.body.secretWord;
    req.flash("info", "The secret word was changed.");
  }
  res.redirect("/secretWord");
});

module.exports = router;
