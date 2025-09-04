const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");



// signup route
router.get("/signup", (req,res)=>{
    res.render("users/signup");
})

router.post("/signup", wrapAsync(async (req,res)=>{
  try{
    let{username, email, password} = req.body;
    let newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
      if(err){
        return next(err);
      }
      req.flash("success", "welcome to Wanderlust!");
      res.redirect("/listings");
    })
    // req.flash("success", "welcome to Wanderlust!");
    // res.redirect("/listings");
  }catch(err){
    req.flash("error", err.message);
    res.redirect("/signup"); 
  }
}));


// login route

router.get("/login", (req,res)=>{
    res.render("users/login.ejs");
})

// login ke bad passport by default req.session ke value ko reset kar deta hai
router.post("/login",
  saveRedirectUrl,
  passport.authenticate("local",{
    failureRedirect: "/login", 
    failureFlash: true,
}),
async(req,res)=>{
    req.flash("success", "welcome back to Wanderlust!");
    let redirect = res.locals.redirectUrl || "/listings"
    res.redirect(redirect);
}
);

// logout route
router.get("/logout", (req, res, next)=>{
  req.logOut((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success", "you are logged out! ");
    res.redirect("/listings");
  })
})




module.exports = router;