const { default: mongoose } = require('mongoose')
const moongoose = require('mongoose')

const productSchema = new moongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name"],
        trim: true,
        maxLength: [300, "Product name cannot exceed 100 character"]
    },

    price: {
        type: Number,
        default: 0.0
    },

    description: {
        type: String,
        required: [true, "Please enter product description"]
    },

    ratings: {
        type: String,
        default: 0
    },
    images: [
        {
            image:{
                type:String,
                required:true
            }
        }
    ],
    category: {
        type: String,
        required: [true, "please enter product category"],
        enum: {
            values: [
                "Electronics", "mobile", "Laptops", "Accessories", "Headphones", "Food", "Books", "Clothes/Shoes", "Beauty", "Health", "Sports", "Outdoor","tv","gaming","audio"
            ], message: "Please select correct category"
        }
    },
    seller: {
        type: String,
        required: [true, "Please enter product seller"]
    },
    stock: {
        type: Number,
        required: [true, "please enter product stock"],
        maxLength: [20, "Product stock cannot exceed 20"]
    },
    numberOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
           user : mongoose.Schema.Types.ObjectId,

            rating: {
                type: Number,
                required: true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    user:{
        type:mongoose.Schema.Types.ObjectId
    },
    createdAt:{
        type:Date,
        default:Date.now() 
    }
})


let model= moongoose.model('Product',productSchema)

module.exports= model