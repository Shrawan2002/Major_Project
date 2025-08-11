const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
// const ejs = require("ejs");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
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

app.get("/listing",async (req,res)=>{
    const allListings = await Listing.find({});
    // console.log(allListing)
    res.render("listings/index.ejs",{allListings});
})

app.listen(8080, ()=>{
    console.log("server is listening on port 8080");
});