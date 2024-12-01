const express = require("express")
const { getProducts, newProduct, getSingleProduct, updateProducts, deleteProduct, createReview, getReviews, deleteReview } = require("../controller/productController")
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/authenticate")
const router = express.Router()

//isAuthenticatedUser    this  middle ware has to be in get products
router.route("/products").get(getProducts)
router.route("/product/:id")
    .get(getSingleProduct)
    .put(updateProducts)
    .delete(deleteProduct)

router.route("/review").put(isAuthenticatedUser,createReview)
                       .delete(deleteReview)
router.route("/reviews").get(getReviews)

//admin route
router.route("/admin/product/new").post(isAuthenticatedUser,authorizeRoles('admin'),newProduct)


module.exports = router
