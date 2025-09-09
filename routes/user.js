const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/user.js");



router.route("/signup")
.get( userController.renderSignupForm)
.post( wrapAsync(userController.signup));


// login
router.route("/login")
.get(userController.renderLoginForm)
.post(
  saveRedirectUrl,
  passport.authenticate("local",{
    failureRedirect: "/login", 
    failureFlash: true,
}),
userController.login

);


// logout route
router.get("/logout",userController.logout)

  
// signup route
// router.get("/signup", userController.renderSignupForm);
// router.post("/signup", wrapAsync(userController.signup));


// login route

// router.get("/login", userController.renderLoginForm)

// login ke bad passport by default req.session ke value ko reset kar deta hai
// router.post("/login",
//   saveRedirectUrl,
//   passport.authenticate("local",{
//     failureRedirect: "/login", 
//     failureFlash: true,
// }),
// userController.login

// );

// logout route
// router.get("/logout",userController.logout)




module.exports = router;