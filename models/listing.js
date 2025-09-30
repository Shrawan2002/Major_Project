const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

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
    price: Number,
    location: String,
    country: String,
    reviews: [
     {
       type: Schema.Types.ObjectId,
       ref: "Review"
     }
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
})

listingSchema.post("findOneAndDelete", async (listing)=>{
  if(listing){
      await Review.deleteMany({_id : {$in : listing.reviews}})
  }
})
const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing; 