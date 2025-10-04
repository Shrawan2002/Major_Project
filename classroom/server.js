const express = require("express");
const app = express();
// const cookiesParser = require("cookie-parser");

const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");



// app.use(cookiesParser());

//    app.use(session({
//     secret: "mysupersecretstring",
//     resave: false,
//     saveUninitialized: true
// }));

// app.get("/getcookies", (req,res)=>{
//     res.cookie("greet", "hello"); 
//     res.send("sent you some cookies!");
// })

//pars cookies

// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("Hi, i am root");
// })

// app.get("/greet", (req,res)=>{
//     let {name = "anonymous"} = req.cookies;
//     res.send(`Hi, ${name}`)
// })

// app.get("/", (req,res)=>{
//     res.send("Hi, i am root");  
// })


//express session

// app.get("/test", (req,res)=>{
//     res.send("test successful");
// })

// app.get("/reqcount", (req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`You sent a request ${req.session.count} times`);
// })

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true
}

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
   res.locals.successMsg = req.flash("success");
   res.locals.errorMsg = req.flash("error");
   next();
})

app.get("/register", (req,res)=>{
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    // console.log(req.session.name); 
    // res.send(name);
    if(name === "anonymous"){
        req.flash("error", "user not registered")
    }else{
        // req.flash("success", "user registered successfully!");
    }
    // res.redirect("/hello");
})

// connect-flash works like a queue:
// Don’t call req.flash("success") twice. Just assign it once:
app.get("/hello", (req,res)=>{
    // res.send(`hello, ${req.session.name}`);
    // console.log(req.flash("success"));
    // let msg = req.flash("success");
    //  let msg = req.flash("success")[0];
    //  console.log(msg);

    // res.locals.successMsg = req.flash("success");
    // res.locals.errorMsg = req.flash("error");
    res.render( "page.ejs", {name: req.session.name});
})


app.listen(3000,()=>{
    console.log("server is listings on port",3000);
})