const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const router = express.Router(); 
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");// destructing




//index Route
router.get("/",
    wrapAsync(
        async (req,res)=>{
    const allListings = await Listing.find({});
    // console.log(allListing)
    res.render("listings/index.ejs",{allListings});
}))


//new Route
router.get("/new", isLoggedIn,(req,res)=>{
    console.log(req.user);
    res.render("listings/new.ejs");
    // console.log("new request");
})

//Create Route
router.post("/", 
    isLoggedIn,
    validateListing,
    wrapAsync( 
    async (req,res,next)=>{
    // let {title,description,image,price,location,country} = req.body;
    let listing = req.body.listing;
    
    // if(!listing){
    //     next(new ExpressError(400, "send valid data for listing"));
    // }

    // 2nd way to check all key is exist or not

    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400, result.error);
    // }
    let newListing = new Listing(listing);

    // first way is indivisual check the key exist ya not

    // if(!newListing.title){
    //     throw new ExpressError(400, "title is missing");
    // }
    // if(!newListing.description){
    //     throw new ExpressError(400, "description is missing");
    // }
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings")
 
})
)

//Show Route

router.get("/:id", 
    wrapAsync(
    async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        }
    }).
    populate("owner");
    console.log(listing);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
       return  res.redirect("/listings")
    }
    res.render("listings/show.ejs",{listing});
    // console.log(listing);
}))


// update: -> Edit & Update Route

//Edit Route

router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(
    async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
       return  res.redirect("/listings")
    }
    res.render("listings/edit.ejs",{listing});
}))

// Update Route
router.put("/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(
    async (req,res)=>{
    let {id} = req.params;
    // console.log(req.body.listing);

    // if(!req.body.listing){
    //     throw new ExpressError(400, "send valid data for listing");
    // }

   await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success", "Listing Updated!")
   res.redirect(`/listings/${id}`);
}))

//Delete Route
router.delete("/:id",
    isLoggedIn,
    isOwner, 
    wrapAsync(
    async(req,res)=>{
    let {id} = req.params;
     let deleteListing = await Listing.findByIdAndDelete(id);
    //  console.log(deleteListing);
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings");
}))
 

module.exports = router;
