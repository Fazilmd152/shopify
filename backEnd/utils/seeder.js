//const products=require("../data/products.json")
//const products=require("../data/data.json")
const products=require("../data/testdata.json")
const product=require("../models/productModel")
const dotenv=require('dotenv')
const connectDataBase = require("../configuration/database")

dotenv.config() 

connectDataBase()


const seedProducts=async ()=>{
    await product.deleteMany()
    console.log("Product Deleted")

    await product.insertMany(products)
    console.log("Product inserted to database")
    process.exit()
}

seedProducts()