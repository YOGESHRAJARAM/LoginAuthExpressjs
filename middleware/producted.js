const jwt = require('jsonwebtoken');
const User = require('../model/usermodel');



const  verifyToken = (req,res,next) =>{
    const authHeader = req.headers.authorization;

    if(!authHeader){
        res.json({message:"missing token"})
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token,process.env.secrettoken,async(err,decode)=>{
        if(err){
            return res.json({message:"invalid Token"})
        }
        const user = await User.findOne({_id: decode.id})

        if(!user){
            return res.json({message:"User not found"})
        }
        req.user = user;
        next()
    })
};

module.exports =verifyToken;