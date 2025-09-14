if(process.env.NODE_ENV != "production"){
    require("dotenv").config();   
}
const express = require("express"); 
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); 
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const ExpressError = require("./utils/ExpressError");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


app.use(express.static(path.join(__dirname,"/public")))
app.engine("ejs",ejsMate);
app.use(methodOverride("_method"))
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views")); 
app.use(express.urlencoded({extended:true}));
app.use(express.json());

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


const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(session(sessionOptions));
app.use(flash());

// iterations: specifies the number of iterations used in pbkdf2 hashing algorithm. Default: 25000
app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next(); 
}) 
 

// app.get("/demouser", async (req,res)=>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });
//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// })



app.use("/listings", listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/", userRouter);




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

// The error just means Chrome looked for a special debugging config file your server doesn’t have. Your app is fine.

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