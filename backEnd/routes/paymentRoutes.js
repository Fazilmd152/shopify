const express = require("express")
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/authenticate")
const { processPayment, sendStripeApi } = require("../controller/paymentController")
const router = express.Router()

router.post("/payment/process",isAuthenticatedUser,processPayment)
router.get("/stripeapi",isAuthenticatedUser,sendStripeApi)

module.exports = router
