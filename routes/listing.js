const express= require("express")
const router = express.Router();
const wrapAsync = require("../utlis/wrapAsync.js");
const ExpressError = require("../utlis/ExpressError.js");
const flash = require("connect-flash");
const user = require("../models/user.js");
const { isLoggedIn, isOwner ,validateListing} = require("../authmiddleware.js");
const Listing = require("../models/listing.js")
const listingController = require("../Controller/listing.js")
const multer  = require('multer')
const {storage} = require('../cloudConfig.js')
const upload = multer({ storage })

router
.route("/")
.get(wrapAsync (listingController.index))//index route
.post(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listingController.post))//create Routezk

//new form 
router.get("/new", isLoggedIn, (listingController.new))

router
.route("/:id")
.get(wrapAsync(listingController.show))//show route
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync (listingController.update))//update route 
.delete(isLoggedIn,isOwner, wrapAsync (listingController.delete));///delete route


//edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.edit))

module.exports = router