const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],

    },
    email: {
        type: String,
        required: [true, "Please enter a mail"],
        validate: [validator.isEmail, "Please enter a valid email"],
        unique:true
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        maxLength: [15, "password cannot exceed 15 character"],
        select: false
    },
    avatar: {
        type: String,
        
    },
    role: {
        type: String,
        default: 'user'
    },
    resetPasswordToken: String,

    resetPasswordTokenExpire: Date,

    createdAt: {
        type: Date,
        default: Date.now
    }
})

//hashing password
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

//token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
}

//validaing password
userSchema.methods.isValidPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password)
}


//reset password
userSchema.methods.getResetToken = function () {
    const token = crypto.randomBytes(20).toString('hex') //generate a token

    //generating hash set to restpasswordtoken
    this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex')

    //set token expire time
    this.resetPasswordTokenExpire= Date.now() + 30 *60 *1000

    return token

}

let userSchemaModel = mongoose.model('user', userSchema)

module.exports = userSchemaModel