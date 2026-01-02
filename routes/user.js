const express = require("express")
const router = express.Router()
const User = require("../models/user.js")
const { route } = require("./listing")
const passport = require("passport")
const { savedRedirectUrl } = require("../middleware.js")
const userController = require("../Controller/user.js");
const user = require("../models/user.js")

router.get("/signup", userController.signupForm);

router.post("/signup", userController.postSignup);


router.get("/login", userController.login)


router.post("/login",savedRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.postlogin)


router.get("/logout", userController.logout)

module.exports = router;
