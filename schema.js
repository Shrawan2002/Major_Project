const Joi = require("joi");

const listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        location : Joi.string().required(),
        country : Joi.string().required(),
        price : Joi.number().required().min(0),
        image : Joi.object({
            url : Joi.string().allow("",null),
            filename: Joi.string().allow(""),
        })
    }).required()
})


const  reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5) ,
        comment: Joi.string().required()
    }).required()
})


module.exports = {listingSchema, reviewSchema};


// const Joi = require("joi");

// module.exports = listingSchema = Joi.object({
//   listing: Joi.object({
//     title: Joi.string().required(),
//     description: Joi.string().required(),
//     location: Joi.string().required(),
//     country: Joi.string().required(),
//     price: Joi.number().min(0).required(),
//     image: Joi.object({
//       url: Joi.string()
//         .uri()
//         .pattern(/\.(jpg|jpeg|png|webp|gif)$/i) // must end with valid extension
//         .required(),
//       filename: Joi.string().allow("") // optional
//     })
//   }).required()
// });


// If you want multiple images
// const Joi = require("joi");

// module.exports = listingSchema = Joi.object({
//   listing: Joi.object({
//     title: Joi.string().required(),
//     description: Joi.string().required(),
//     location: Joi.string().required(),
//     country: Joi.string().required(),
//     price: Joi.number().min(0).required(),
//     images: Joi.array().items(
//       Joi.object({
//         url: Joi.string()
//           .uri()
//           .pattern(/\.(jpg|jpeg|png|webp|gif)$/i)
//           .required(),
//         filename: Joi.string().allow("")
//       })
//     ).min(1).required()  // at least 1 image required
//   }).required()
// });
