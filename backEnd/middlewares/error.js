
  const ErrorHandler = require("../utils/errorHandler")

    module.exports = (err, req, res, next) => {

        err.statuscode = err.statuscode || 500

        if(process.env.NODE_ENV == "development") {

            res.status(err.statuscode).json({
                success: false,
                message: err.message ,
                stack: err.stack,
                err
            })
        }

        if(process.env.NODE_ENV == "production") {
            let message=err.message
            let error=new ErrorHandler(message)

            if(err.name == "ValidationError"){
                message=Object.values(err.errors).map(d => d.message)
                error= new ErrorHandler(message)
                err.statuscode=400
            }

            if(err.name == "CastError"){
                message=`Resource not found ${err.path}`
                error= new ErrorHandler(message)
                err.statuscode=400
            }

            if(err.code ==11000){
               let message =`Duplicate key ${Object.keys(err.keyValue)} error`
                error= new ErrorHandler(message)
                err.statuscode=400
            }

            if(err.name =='TokenExpiredError'){
               let message =`JSON web token is expired. Try again `
                error= new ErrorHandler(message)
                err.statuscode=400
            }

            if(err.name =='JSONWebTokenError'){
               let message =`JSON web token is invalid. Try again `
                error= new ErrorHandler(message)
                err.statuscode=400
            }


            res.status(err.statuscode).json({
                succes:false,
                message:error.message || "Internal Server Error",
                
                
                
            })  

        
        }


    }