const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require('jsonwebtoken')

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies
    //console.log("token :",token);
    if (!token) {
        return next(new ErrorHandler("Login first to handle this resource", 401))
    }


    //deciding a token we creted this token using id
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decodedToken.id)

    next()
})

//authorizing roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role ${req.user.role} is not allowed`, 401))
        }

        next()
    }
}
