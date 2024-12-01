const express = require("express")
const multer=require('multer')
const path=require('path')
const upload=multer({
    storage:multer.diskStorage({
        destination:function(req,file,cb){
            cb(null,path.join(__dirname,'..','Uploads/user'))
        },
        filename:function(req,file,cb){
            cb(null,file.originalname)
        },
    })
})
const { registerUser, loginUser, logOutUser, forgotPassword, resetPassword, getUserProfile, changePassword, updateProfile, getAllUser, getUser, updateUser, deleteUser } = require("../controller/authController")
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/authenticate")
const router = express.Router()

router.route("/register").post(upload.single('image'),registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logOutUser)
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").post(resetPassword)
router.route("/myprofile").get(isAuthenticatedUser, getUserProfile)
router.route("/password/change").put(isAuthenticatedUser,changePassword)
router.route("/update").put(isAuthenticatedUser,upload.single('image'), updateProfile)

//Admin routes
router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles('admin'), getAllUser)
router.route("/admin/user/:id").get(isAuthenticatedUser, authorizeRoles('admin'), getUser)
                              .put(isAuthenticatedUser, authorizeRoles('admin'), updateUser)
                              .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser)




module.exports = router