const model = require("../models/productModel")
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middlewares/catchAsyncError')
const APIFeatures = require('../utils/APIFeatures')






//get product -api--http://localhost:7000/api/v1/products
exports.getProducts = async (req, res, next) => {

    let resPerPage =req.query.keyword?12:10;
   
    
    
    let buildQuery = () => {
        return new APIFeatures(model.find(), req.query).Search().filter()
    }

    const filterdeProductsCount = await buildQuery().query.countDocuments({})
    const totalProductCount = await model.countDocuments({})
    let productCounts = totalProductCount

    if (filterdeProductsCount !== totalProductCount) {
        productCounts = filterdeProductsCount
    }

    const products = await buildQuery().paginate(resPerPage).query
    const highestPrice = Math.max(...products.map(product => product.price))
    
    res.status(200).json({
        success: true,
        count: productCounts,
        highestPrice,
        resPerPage,
        products,
        
    })
}




//Creates product -api--http://localhost:7000/api/v1/product/new
exports.newProduct = catchAsyncError(async (req, res, next) => {

    req.body.user = req.user.id
    const product = await model.create(req.body)

    res.status(201).json({
        succes: true,
        product,
        message: "produc Succesfully created in database"
    })
})


//get single product
exports.getSingleProduct = async (req, res, next) => {
    try {

        const product = await model.findById(req.params.id);

        if (!product) {
            return next(new ErrorHandler('Product not found', 400));
        }

        res.status(201).json({
            success: true,
            product
        })
    } catch (err) {
        next(err)
    }

}


//update product 
exports.updateProducts = async (req, res, next) => {
    let product = await model.findById(req.params.id)
    if (!product) {
        return res.status(404).json({
            success: false,
            message: "could not get products"
        });
    }

    product = await model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        product
    })

}

//delete product

exports.deleteProduct = async (req, res, next) => {

    let product = await model.findById(req.params.id)

    if (!product) {

        return res.status(404).json({
            success: false,
            message: "product not found"
        });
    }

    await product.deleteOne();

    res.status(201).json({
        success: true,
        message: "Product has been deleted"
    })
}


//Create review - api/v1/review
exports.createReview = catchAsyncError(async (req, res, next) => {
    const { productId, rating, comment } = req.body

    const review = {
        user: req.user.id,
        rating,
        comment
    }

    const product = await model.findById(productId)

    //finding wether user already reviewed about product
    const isReviewed = product.reviews.find(review => {
        return review.user.toString() == req.user.id.toString()
    })

    if (isReviewed) {         //updating review
        product.reviews.forEach(review => {
            if (review.user.toString() == req.user.id.toString()) {
                review.comment = comment
                review.rating = rating
            }
        })

    } else {    //creating review
        product.reviews.push(review)
        product.numberOfReviews = product.reviews.length
    }

    //find the average of product reviews to update ratings
    product.ratings = product.reviews.reduce((acc, review) => {
        return review.rating + acc
    }, 0) / product.reviews.length

    product.ratings = isNaN(product.ratings) ? 0 : product.ratings

    await product.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true
    })

})

//get reviews--api/v1/reviews/?id={productid}
exports.getReviews = catchAsyncError(async (req, res, next) => {

    const product = await model.findById(req.query.id)

    if (!product) {
        return next(new ErrorHandler("there is no product with this id", 401))
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })

})

//delete reviews -api/v1/review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
    const product = await model.findById(req.query.productId)

    const reviews = product.reviews.filter(review => {   //fitering the review to exclude the id of review- if the review id and user id matches it will be ignored
        return review._id.toString() !== req.query.id.toString()
    })

    const numberOfReviews = reviews.length //number of reviews

    let ratings = reviews.reduce((acc, review) => {   //updating ratings
        return review.rating + acc
    }, 0) / reviews.length

    ratings = isNaN(ratings) ? 0 : ratings

    await model.findByIdAndUpdate(req.query.productId, {   //save the document
        reviews,
        numberOfReviews,
        ratings
    })

    res.status(200).json({
        success: true
    })
})