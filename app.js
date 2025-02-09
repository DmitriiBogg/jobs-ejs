const express = require("express");
require("express-async-errors");
require("dotenv").config();

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const connectDB = require("./db/connect");
const flashMessages = require("./middleware/flashMessages");

const app = express();

// EJS setup
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Session store config
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "mySessions",
});

store.on("error", function (error) {
  console.log(error);
});

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: { secure: false, sameSite: "strict" },
  })
);

// Flash message middleware
app.use(flash());
app.use(flashMessages);

// Secret word route
app.get("/secretWord", (req, res) => {
  if (!req.session.secretWord) {
    req.session.secretWord = "syzygy";
  }
  res.render("secretWord", { secretWord: req.session.secretWord });
});

app.post("/secretWord", (req, res) => {
  if (req.body.secretWord.toUpperCase().startsWith("P")) {
    req.flash("error", "That word won't work!");
    req.flash("error", "You can't use words that start with P.");
  } else {
    req.session.secretWord = req.body.secretWord;
    req.flash("info", "The secret word was changed.");
  }
  res.redirect("/secretWord");
});

// 404 handler
app.use((req, res) => {
  res.status(404).send(`Page (${req.url}) not found.`);
});

// Error handler
app.use((err, req, res, next) => {
  res.status(500).send(err.message);
  console.log(err);
});

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");
    app.listen(port, () =>
      console.log(`Server running at http://localhost:${port}/secretWord`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
