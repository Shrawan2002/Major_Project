const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js")
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const router = express.Router(); 


// Server Side validation for schema convert into middleware
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();  
    }
}

//index Route
router.get("/",
    wrapAsync(
        async (req,res)=>{
    const allListings = await Listing.find({});
    // console.log(allListing)
    res.render("listings/index.ejs",{allListings});
}))


//new Route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
    // console.log("new request");
})

//Create Route
router.post("/", 
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
    const listing = await Listing.findById(id).populate("reviews");
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
    wrapAsync(
    async(req,res)=>{
    let {id} = req.params;
     let deleteListing = await Listing.findByIdAndDelete(id);
    //  console.log(deleteListing);
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings");
}))


module.exports = router;
