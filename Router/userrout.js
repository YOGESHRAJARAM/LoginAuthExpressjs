const express = require('express')
const User = require('../model/usermodel.js')
const router = express.Router()
const bcrypt = require('bcryptjs')
const generateToken = require('../utils/token.js')
const verifyToken = require('../middleware/producted.js')
const nodemailer = require("nodemailer")

router.get("/test",(req,res)=>{
    res.json({message:"api working"})
})
router.post("/user",async (req,res)=>{
  const {email,password} = req.body;
  const user = await User.findOne({email})
  if(!user){
     const hashedPassword = await bcrypt.hash(password,10)
     const  newuser = new User({email,password:hashedPassword})
     await newuser.save()
     return res.status(201).json({message:"User added successfully"})
  }
  else{
    res.json({message:"User already exist"})
  }
  
})

router.post("/authenticate",async(req,res)=>{
    const {email,password} = req.body;
    const user =await User.findOne({email});
    if(!user){
        return res.json({message:"user not found"});
    }

    const isMatch =  bcrypt.compare(password,user.password)

    if(!isMatch){
        return res.json({message:"Incorrect Password"})
    }

    const token = generateToken(user)
    res.json({token})
})

router.get('/data',verifyToken,(req,res)=>{
  res.json({message: `welcome, ${req.user.email} ! This protected data`})
} )

router.post("/reset-password",async(req,res)=>{
    const { email } = req.body;
    const user = await User.findOne({email});
    if(!user){
      return res.json({message:"User not found"})
    }
    const token = Math.random().toString(36).slice(-8);
    const timeExpire = Date.now() + 3600000; // 1 hour 
    user.resetPasswordToken = token;
    user.resstPasswordExpires = timeExpire;

    await user.save();

    const transpoter = nodemailer.createTransport({
      service:"gmail",
      auth:{
        user:"bablusoftware12@gmail.com",
        pass:"yobg nmjt xrpw bdzd"
      }
    })
    const message = {
      from: 'bablusoftware12@gmail.com',
      to:user.email,
      subject:"Password reset request",
      text:`you are reciveing this mail to change password please use the folloeing token:\n\n ${token}\n\n`
    }
    transpoter.sendMail(message,(err,info)=>{
      if(err){
        res.json({message:"something went wrong, try again!"})
      }
      res.json({message:"Password reset Email Sent" + info.response});
    });
});

router.post("/reset-password/:token",async(req,res)=>{
const {token} = req.params;
const {password} = req.body;

const user = await User.findOne({
  resetPasswordToken:token,
  resstPasswordExpires:{ $gt: Date.now()},
});
  if(!user){
    return res.json({message:"invalid token"})
  }

  const hashPassword = await bcrypt.hash(password,10);
  user.password = hashPassword;
  user.resetPasswordToken = null;
  user.resstPasswordExpires= null;

   await user.save().then(()=>(res.json({message:"Password reset successfully"})))
  
})

module.exports = router