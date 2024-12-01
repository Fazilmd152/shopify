const { json } = require("express");
const catchAsyncError = require("../middlewares/catchAsyncError");
const User = require("../models/userModel");
const sendEmail = require("../utils/email");
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require("../utils/jwt");
const crypto = require('crypto');

//reigster user  -/api/v1/register
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body
    let image;
    if (req.file) {
        image = `${process.env.BACKEND_URL}/Uploads/user/${req.file.originalname}`
    }
    const user = await User.create({
        name,
        email,
        password,
        avatar: image
    })


    sendToken(user, 201, res)  //calling send token function in utils-jwt

})



//login user -/api/v1/login
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return next(new ErrorHandler("please enter email and password", 400))
    }

    const user = await User.findOne({ email }).select('+password')  //finding the user from database

    if (!user) {    // checking weather users there
        return next(new ErrorHandler("Invalid email or password", 401))

    }

    if (!await user.isValidPassword(password)) {                      //validating password
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    sendToken(user, 201, res)  //calling send token function in utils-jwt

})


//log out user -/api/v1/logout
exports.logOutUser = (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    }).status(200)
        .json({
            success: true,
            message: "Logged out"
        })
}


//forgot password-/api/v1/password/forgot
exports.forgotPassword = catchAsyncError(
    async (req, res, next) => {

//console.log(req.body);

        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            next(new ErrorHandler("User not found with this email", 404))
        }

        const resetToken = user.getResetToken()
        await user.save({ validateBeforeSave: false })

        //create reset url
        const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`

        const message = `Your password reset URL is as follows \n\n ${resetUrl} \n\n If you have not requested this email, please ignore it.`

        try {

            await sendEmail({
                email: user.email,
                subject: 'Fables password Recovery',
                message
            })

            res.status(200).json({
                success: true,
                message: `Email sent to ${user.email}`
            })

        } catch (error) {
            user.resetPasswordToken = undefined
            user.resetPasswordTokenExpire = undefined
            await user.save({ validateBeforeSave: false })
            return next(new ErrorHandler(error.message))

        }
    }
)

//reset password -/api/v1/password/reset/:token
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    //console.log(req.params);
    //console.log(req.body.password);
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')


    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTokenExpire: {
            $gt: Date.now()
        }
    })

    if (!user) {
        return next(new ErrorHandler('Pasword reset token is invalid or expired'))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Pasword does not match'))
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordTokenExpire = undefined
    await user.save({ validateBeforeSave: false })

    sendToken(user, 201, res)

})


//Get user profile
exports.getUserProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        user
    })
})

//change password -/api/v1/password/change
exports.changePassword = catchAsyncError(async (req, res, next) => {
   
    
    const user = await User.findById(req.user.id).select('+password')
    
    
    //check old password
    const oldPassword = req.body.oldPassword
    if (!await user.isValidPassword(oldPassword)) {
        return next(new ErrorHandler("Old password is incorrect"))
    }

    //assignin new password
    user.password = req.body.password
    await user.save()

    res.status(200).json({
        success: true,
    })

})


//Update profile -/api/v1/update
exports.updateProfile = catchAsyncError(async (req, res, next) => {
    let newUserData = {
        name: req.body.name,
        email: req.body.email
    }
    let image;
    if (req.file) {
        image = `${process.env.BACKEND_URL}/Uploads/user/${req.file.originalname}`
        newUserData={...newUserData,avatar:image}
    }
 
    

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        user
    })

})

//Admin: get all users-/api/v1/admin/users
exports.getAllUser = catchAsyncError(async (req, res, next) => {
    const users = await User.find()
    res.status(200).json({
        success: true,
        users
    })
})

//Admin: get specific user- /api/v1/admin/user/:id
exports.getUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        return next(new ErrorHandler(`User not found with this id ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user
    })
})

//Admin :update user -/api/v1/admin/user/:id
exports.updateUser = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }
    


    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        user
    })

})


//Admin: delete user -/api/v1/admin/user/:id
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        return next(new ErrorHandler(`User not found with this id ${req.params.id}`))
    }

    await user.deleteOne()
    res.status(200).json({
        success: true
    })

})