const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
// const Listing = require("../models/listing.js");
const router = express.Router(); 
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");// destructing
const listingController = require("../controllers/listings.js")



router.route("/")
.get(wrapAsync(listingController.index))
.post( 
    isLoggedIn,
    validateListing,
    wrapAsync(listingController.createListing)
);

router.get("/new", isLoggedIn, listingController.renderNewForm);


router.route("/:id")
.get( wrapAsync(listingController.showListing))

.put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing))

    .delete(
    isLoggedIn,
    isOwner, 
    wrapAsync(listingController.destroyListing)
)
 
//Edit Route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
)





//index Route
// router.get("/",wrapAsync(listingController.index));


//new Route
// router.get("/new", isLoggedIn, listingController.renderNewForm);

//Create Route
// router.post("/", 
//     isLoggedIn,
//     validateListing,
//     wrapAsync(listingController.createListing)
// )

//Show Route 
// router.get("/:id", wrapAsync(listingController.showListing))


//Edit Route
// router.get("/:id/edit",
//     isLoggedIn,
//     isOwner,
//     wrapAsync(listingController.renderEditForm)
// )

// Update Route
// router.put("/:id",
//     isLoggedIn,
//     isOwner, 
//     validateListing,
//     wrapAsync(listingController.updateListing))

//Delete Route
// router.delete("/:id",
//     isLoggedIn,
//     isOwner, 
//     wrapAsync(listingController.destroyListing)
// )
 

module.exports = router;
