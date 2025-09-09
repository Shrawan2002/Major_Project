const express = require("express");
const router = express.Router({ mergeParams: true });
// const router = express.Router();
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js");
const reviewController = require("../controllers/reviews.js")
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");


 
// Reviews 
//post route
// comman part -> /listings/:id/reviews
router.post("/",isLoggedIn ,validateReview,  wrapAsync(reviewController.createReview)
)


///Delete review 
router.delete("/:reviewId",isReviewAuthor, wrapAsync(reviewController.destoryReview)
)

module.exports = router;
