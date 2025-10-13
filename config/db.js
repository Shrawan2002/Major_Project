const mongoose = require("mongoose");

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URl);        
         console.log("mongodb Connected..");
    }catch(err){
        console.error(err.message);
        process.exit(1);
    }
}

module.exports = connectDB;