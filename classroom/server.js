const express = require("express");
const app = express();
const cookiesParser = require("cookie-parser");



app.use(cookiesParser());

app.get("/getcookies", (req,res)=>{
    res.cookie("greet", "hello"); 
    res.send("sent you some cookies!");
})

//pars cookies

app.get("/",(req,res)=>{
    console.dir(req.cookies);
    res.send("Hi, i am root");
})

app.get("/greet", (req,res)=>{
    let {name = "anonymous"} = req.cookies;
    res.send(`Hi, ${name}`)
})

// app.get("/", (req,res)=>{
//     res.send("Hi, i am root");  
// })

app.listen(3000,()=>{
    console.log("server is listings on port",3000);
})