const express = require("express")
const cors = require('cors')
const { config } = require("dotenv")
const errorMiddleware = require('./middlewares/error.js')
const app = express()
const cookieParser = require('cookie-parser')
const path = require('path')
const fs = require('fs')

config()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
   origin:['http://localhost:3000','http://localhost:3001'],
    credentials:true
}))
app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')))

const products = require("./routes/product")
const auth = require("./routes/auth.js")
const order = require("./routes/order.js")
const payment = require("./routes/paymentRoutes.js")




//  app.use("*", (req, res, next) => {
//      const text = '\n' + Date().split("G")[0] + " --- " + req.rawHeaders[1] + " --- " + req.headers.referer + " --- " + req.method
// //     fs.appendFile(path.join(__dirname, "lib", "log.txt"), text, (err) => {
// //         if (err) {
// //             // console.error(`Error appending to file: ${err}`);
// //         } else {
// //             // console.log(`File appended successfully`);
// //         }
// //     })
//     console.log(text);
    
//     next()
//  })

app.use('/api/v1', products)
app.use('/api/v1', auth)
app.use('/api/v1', order)
app.use('/api/v1', payment)

app.use(errorMiddleware)



module.exports = app