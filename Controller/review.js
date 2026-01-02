const Listing = require("../models/listing.js")
const Review = require("../models/review.js")

module.exports.index = async (req, res) => {
  let listing = await Listing.findById(req.params.id)
   let newReview = new Review(req.body.review)
   newReview.author = req.user._id
   console.log(newReview)
   listing.reviews.push(newReview)
   await newReview.save()
   await listing.save()  
        req.flash("success", "review created")

  res.redirect(`/listings/${listing.id}`);
}


module.exports.delete = async (req, res) => {
  let { id, reviewId } = req.params;
   req.flash("success", " review Deleted")
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
}