const Listing = require("../models/listing.js")
const axios = require('axios');

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
}

module.exports.new = (req, res) => {
  res.render("listings/new")
}

module.exports.show = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({
    path: "reviews",
    populate: {
      path: "author"
    }
  }).populate("owner");
  if (!listing) {
    req.flash("error", "Listing u requested for does not exist")
    return res.redirect("/listings")
  }
  // console.log(listing)
  res.render("listings/show", { listing });
}
    // console.log("IMAGE FIELD 👉", listing.image);
  // console.log("IMAGE TYPE 👉", typeof listing.image);


module.exports.post = async (req, res, next) => {
  try {
    if (!req.file) {
      req.flash("error", "Image upload is required!");
      return res.redirect("/listings/new");
    }

    const url = req.file.path;
    const filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    // 🌍 FREE geocoding (OpenStreetMap)
    const geoResponse = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: req.body.listing.location,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "TravelApp/1.0",
        },
      }
    );

    // ✅ If location found
    if (geoResponse.data.length > 0) {
      newListing.geometry = {
        type: "Point",
        coordinates: [
          parseFloat(geoResponse.data[0].lon), // lng
          parseFloat(geoResponse.data[0].lat), // lat
        ],
      };
    } else {
      // ⚠️ fallback (India center)
      newListing.geometry = {
        type: "Point",
        coordinates: [78.9629, 20.5937],
      };
    }

    await newListing.save();

    req.flash("success", "New Listing created");
    res.redirect("/listings");

  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to create listing");
    res.redirect("/listings/new");
  }
};


module.exports.edit = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
  if (!listing) {
    req.flash("error", "Listing u requested for does not exist")
    return res.redirect("/listings")
  }
  res.render("listings/edit", { listing })
}

module.exports.update = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image.url = url;
    listing.image = { url: url, filename: filename };
    await listing.save();
  }

  req.flash("success", " Listing is updated")
  res.redirect(`/listings/${id}`);
}

module.exports.delete = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id)
  req.flash("success", " Listing Deleted")
  res.redirect("/listings")
}