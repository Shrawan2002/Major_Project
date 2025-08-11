const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title :{
     type: String,
     required: true
    },
    description : String,
    image: {
        filename:{
            type: String
        },
      url: {
        type: String,
        default: "https://media.istockphoto.com/id/638202904/photo/palm-tree-on-the-beach.jpg?s=2048x2048&w=is&k=20&c=tl37uEKsM5TI1GS1uPShZg3OLuaCb8vZuwd51Noakyg=",
        set: ((v)=> v === ""?"https://media.istockphoto.com/id/638202904/photo/palm-tree-on-the-beach.jpg?s=2048x2048&w=is&k=20&c=tl37uEKsM5TI1GS1uPShZg3OLuaCb8vZuwd51Noakyg=" : v)
    },
      },
    price: String,
    location: String,
    country: String,
})

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;