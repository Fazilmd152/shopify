const app = require("./app")
const path =require("path")
const connectDataBase = require("./configuration/database")
const os = require("os")
const { log } = require("console")


connectDataBase()

// Get local IP address
const getLocalIp = () => {
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
        for (const iface of networkInterfaces[interfaceName]) {
            // Skip over non-IPv4 and internal (localhost) addresses
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1'; // Fallback to localhost if no other IP is found
}

const server=app.listen(process.env.PORT,() => {
    console.log(`Server listening to the port : ${process.env.PORT} in ${process.env.NODE_ENV}`)
    const localIp = getLocalIp()
    console.log("Network :",localIp);
    
})

process.on('unhandledRejection',(err)=>{
    console.log(`Error : ${err.message}` )
    console.log("Shutting down the server due to unhandle rejection error");
    server.close(()=>{
        process.exit(1)
    })
})


process.on('uncaughtException',(err)=>{
    console.log(`Error : ${err.message}` )
    console.log("Shutting down the server due to uncaught exception error");
    server.close(()=>{
        process.exit(1)
    })
})



