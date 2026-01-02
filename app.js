require('dotenv').config();
const express = require("express")
const app = express();
const mongoose = require("mongoose")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo")
const flash = require("connect-flash");
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const User = require("./models/user.js")
const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js");
const dbUrl = process.env.ATLASDB_URL
app.use(methodOverride("_method"))
main()
  .then(() => {

    console.log("connected")
   
  })
  .catch(err => console.log(err));


async function main() {
  await mongoose.connect(dbUrl); // for atlas
}
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")))

const store = MongoStore.create({
  mongoUrl: dbUrl,

  touchAfter: 24 * 60 * 60,
})

store.on("error", (err) => {
  console.log("error in mongo session store", err);
})

const sessionOptions = {
  store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
}



app.use(session(sessionOptions));
app.use(flash())
app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {

  return res.redirect("/listings")
})

app.use((req, res, next) => {
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  res.locals.currentUser = req.user;
  next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});


app.listen(8080, () => {
  console.log("server is listening to port 8080")
})


