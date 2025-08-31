const express = require("express");
const app = express();
// const cookiesParser = require("cookie-parser");

const session = require("express-session");



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


const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true
}

app.use(session(sessionOptions));

app.get("/register", (req,res)=>{
    let {name} = req.query;
    res.send(name);
})


app.listen(3000,()=>{
    console.log("server is listings on port",3000);
})