const express = require("express");
require("express-async-errors");
require("dotenv").config();

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const connectDB = require("./db/connect");
const passport = require("passport");
const passportInit = require("./passport/passportInit");
const auth = require("./middleware/auth");
const secretWordRouter = require("./routes/secretWord");

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

// Passport initialization
passportInit();
app.use(passport.initialize());
app.use(passport.session());

// storeLocals
app.use(require("./middleware/storeLocals"));

//index
app.get("/", (req, res) => {
  res.render("index");
});

// session
app.use(
  "/sessions",
  (req, res, next) => {
    console.log(`Request received at /sessions: ${req.method} ${req.url}`);
    next();
  },
  require("./routes/sessionRoutes")
);

// Secret word route
app.use("/secretWord", auth, secretWordRouter);

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
      console.log(`Server running at http://localhost:${port}`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
