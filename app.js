const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); 
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const session = require("express-session");
const ExpressError = require("./utils/ExpressError");


app.use(express.static(path.join(__dirname,"/public")))
app.engine("ejs",ejsMate);
app.use(methodOverride("_method"))
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({extended:true}));

const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true
}

app.use(session(sessionOptions));


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



app.use("/listings", listings);
app.use("/listings/:id/reviews",reviews);




app.get("/",(req,res)=>{
    res.send("Hi, I am root");
});

// app.get("/testlisting",async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the Beach",
//         price: 1200,
//         location: "calangute, Goa",
//         country: "india"  
//     });

//     await sampleListing.save();
//     console.log(" sample was saved");
//     res.send("successful testing");
// })




//page not found
// app.all("*", (req,res,next)=>{
//     next(new ExpressError(404, "page Not Found!"));
// })


// app.use((req, res, next) => {
//     console.log("➡️ Request URL:", req.url);
//     next();
// });

app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.status(204).end(); // No Content, avoids 404 error
});



app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404,"Page Not Found!"));
});



// Error Handling Middlewares

app.use((err,req,res,next)=>{
    // res.send("something went wrong");
    let {statusCode = 500, message = "something went wrong!"} = err;
    console.log(statusCode);
    console.error("❌ Error stack:", err.stack); 
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{message});
})


app.listen(8080, ()=>{
    console.log("server is listening on port 8080");
});