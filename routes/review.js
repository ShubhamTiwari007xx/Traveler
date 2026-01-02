const express= require("express")
const router = express.Router({mergeParams : true}); //this is to access params from parent route e.g listings/:id/reviews where id is from parent route and reviews is current route so to access id we need mergeParams true
const wrapAsync = require("../utlis/wrapAsync.js");
const ExpressError = require("../utlis/ExpressError.js");
const Review = require ("../models/review.js");
const Listing = require("../models/listing.js")
const {validateReview, isLoggedIn, isAuthor, savedRedirectUrl} = require("../middleware.js")
const reviewController = require("../Controller/review.js");

//reviews route
router.post("/",isLoggedIn,validateReview,wrapAsync (reviewController.index))

//delete review route
router.delete("/:reviewId",isLoggedIn,isAuthor,savedRedirectUrl, wrapAsync(reviewController.delete));


module.exports = router;
