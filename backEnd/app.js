const express=require("express")
const cors=require('cors')
const errorMiddleware =require('./middlewares/error.js')
const app=express()
const cookieParser=require('cookie-parser')
const path=require('path')



app.use(express.json())
app.use(cookieParser())
//app.use(cors(corsOptions))
app.use('/Uploads',express.static(path.join(__dirname,'Uploads')))

const products=require("./routes/product")
const auth=require("./routes/auth.js")
const order=require("./routes/order.js")


app.use('/api/v1',products)
app.use('/api/v1',auth)
app.use('/api/v1',order)

app.use(errorMiddleware)



module.exports=app