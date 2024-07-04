const express = require('express');
const  mongoose = require('mongoose');
const userRouter = require('./Router/userrout.js')
require('dotenv').config()


const app = express()
app.use(express.json())
app.use("/api",userRouter)

//connect to mongodb
const connectDB= async() =>{
   await mongoose.connect(process.env.DB_Connection_String).then(()=>console.log("Db connected")).catch((err)=>console.error(err))
}
connectDB()

app.get("/",(req,res)=>{
    res.json({name:"Yogesh"})
})
app.listen(3000,()=>(console.log("server started on localhost:3000")))