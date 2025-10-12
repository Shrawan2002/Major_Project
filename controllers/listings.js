const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm = (req, res)=>{
    console.log(req.user);
    res.render("listings/new.ejs");
} 

module.exports.createListing =  async (req,res,next)=>{
    // let {title,description,image,price,location,country} = req.body;
  let response =  await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
    })
  .send();
//   console.log(response.body.features[0].geometry);
//   res.send("done!");

    let url = req.file.path;
    let filename= req.file.filename;
    console.log(url, "...", filename);

    let listing = req.body.listing;
    let newListing = new Listing(listing);
    newListing.image = {filename, url};

    newListing.geometry = response.body.features[0].geometry;

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
 
}

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        }
    }).
    populate("owner");
    // console.log(listing);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
       return  res.redirect("/listings")
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
       return  res.redirect("/listings")
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    console.log(originalImageUrl);
    res.render("listings/edit.ejs",{listing, originalImageUrl});
}

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    // console.log(req.body.listing); 

    // if(!req.body.listing){
    //     throw new ExpressError(400, "send valid data for listing");
    // }

   let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

if(typeof(req.file) !== "undefined"){
   let url = req.file.path; 
   let filename = req.file.filename;
   listing.image = {url, filename};
   await listing.save();
}
    
   req.flash("success", "Listing Updated!")
   res.redirect(`/listings/${id}`);
}


module.exports. destroyListing = async(req,res)=>{
    let {id} = req.params;
     let deleteListing = await Listing.findByIdAndDelete(id);
    //  console.log(deleteListing);
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings");
}