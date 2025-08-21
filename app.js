const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingSchema = require("./schema.js");

app.use(express.static(path.join(__dirname,"/public")))
app.engine("ejs",ejsMate);
app.use(methodOverride("_method"))
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({extended:true}));
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
app.use(express.json());

main()
.then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get("/",(req,res)=>{
    res.send("Hi, I am root");
});

app.get("/testlisting",async (req,res)=>{
    let sampleListing = new Listing({
        title: "My New Villa",
        description: "By the Beach",
        price: 1200,
        location: "calangute, Goa",
        country: "india"  
    });

    await sampleListing.save();
    console.log(" sample was saved");
    res.send("successful testing");
})

// validation for schema convert into middleware
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
app.get("/listings",
    wrapAsync(
        async (req,res)=>{
    const allListings = await Listing.find({});
    // console.log(allListing)
    res.render("listings/index.ejs",{allListings});
}))


//new Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
    // console.log("new request");
})

//Create Route
app.post("/listings", 
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
    await newListing.save()
    res.redirect("/listings")
 
})
)

//Show Route

app.get("/listings/:id", 
    wrapAsync(
    async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
    // console.log(listing);
}))


// update: -> Edit & Update Route

//Edit Route

app.get("/listings/:id/edit",
    wrapAsync(
    async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}))

// Update Route
app.put("/listings/:id",
    validateListing,
    wrapAsync(
    async (req,res)=>{
    let {id} = req.params;
    console.log(req.body.listing);

    // if(!req.body.listing){
    //     throw new ExpressError(400, "send valid data for listing");
    // }

   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect(`/listings/${id}`);
}))

//Delete Route
app.delete("/listings/:id", 
    wrapAsync(
    async(req,res)=>{
    let {id} = req.params;
     let deleteListing = await Listing.findByIdAndDelete(id);
     console.log(deleteListing);
    res.redirect("/listings");
}))

//page not found
// app.all("*", (req,res,next)=>{
//     next(new ExpressError(404, "page Not Found!"));
// })

// app.all("/*", (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found!"));
// });

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404,"Page Not Found!"));
});



// Error Handling Middlewares

app.use((err,req,res,next)=>{
    // res.send("something went wrong");
    let {statusCode = 500, message = "something went wrong!"} = err;
    console.log(statusCode);
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{message});
})


app.listen(8080, ()=>{
    console.log("server is listening on port 8080");
});