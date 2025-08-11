const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title :{
     type: String,
     required: true
    },
    description : String,
    image: {
        type: String,
        default: "https://www.istockphoto.com/photo/palm-tree-on-the-beach-gm638202904-114290537",
        set: ((v)=> v === ""?"https://www.istockphoto.com/photo/palm-tree-on-the-beach-gm638202904-114290537" : v)
    },
    price: String,
    location: String,
    country: String,
})

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;