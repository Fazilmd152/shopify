const moongoose=require("mongoose")
const dotenv=require('dotenv')
dotenv.config()



const connectDataBase = ()=>{
 moongoose.connect(process.env.DB_LOCAL_URI).then(d=>{
    
    console.log(`Database is connected to the host : ${d.connection.host}`);
    
}).catch(e => {
    console.log("testing :",process.env.DB_LOCAL_URI);
    console.log(e.message);
    
})
}

module.exports=connectDataBase