const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");


app.use(methodOverride("_method"))
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({extended:true}));
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

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

//index Route
app.get("/listings",async (req,res)=>{
    const allListings = await Listing.find({});
    // console.log(allListing)
    res.render("listings/index.ejs",{allListings});
})


//new Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
    // console.log("new request");
})

//Create Route
app.post("/listings", async (req,res)=>{
    // let {title,description,image,price,location,country} = req.body;
    let listing = req.body.listing;
    console.log(listing);
    let newListing = new Listing(listing);
    await newListing.save()
    res.redirect("/listings")
})

//Show Route

app.get("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
    // console.log(listing);
})


// update: -> Edit & Update Route

//Edit Route

app.get("/listings/:id/edit",async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})

// Update Route
app.put("/listings/:id",async (req,res)=>{
    let {id} = req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect(`/listings/${id}`);
})

//Delete Route
app.delete("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})


app.listen(8080, ()=>{
    console.log("server is listening on port 8080");
});