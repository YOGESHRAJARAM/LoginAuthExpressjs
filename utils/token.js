const jwt = require("jsonwebtoken")
const generateToken = (user)=>jwt.sign({id:user.id},process.env.secrettoken,{expiresIn: '10m'})

module.exports = generateToken;