const express = require("express");
const router = express.Router({ mergeParams: true });
// const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
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
