const sendToken = (user,statusCode,res) => {
    //creating token
    const token=user.getJwtToken()


//setting cookies
const options = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000), // Expires in set time
    httpOnly: true,    // Prevent access from JavaScript
    secure: false,     // Don't set Secure flag for localhost (only for HTTPS in production)
    sameSite: 'Lax'    // Use 'Lax' to allow cross-origin cookies
};

    res.status(statusCode)
    .cookie('token',token,options)
    .json({
        success:true,
        token,
        user
    })

}

module.exports=sendToken