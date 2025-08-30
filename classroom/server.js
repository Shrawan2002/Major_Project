const express = require("express");
const app = express();


app.get("/getcookies", (req,res)=>{
    res.cookie("greet", "hello"); 
    res.send("sent you some cookies!");
})

app.get("/", (req,res)=>{
    res.send("Hi, i am root");  
})

app.listen(3000,()=>{
    console.log("server is listings on port",3000);
})