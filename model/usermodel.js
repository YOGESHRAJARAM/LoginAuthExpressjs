const mongoose =require('mongoose')
const UserScema = new mongoose.Schema({
    email:{type:String},
    password:{type:String},
    resetPasswordToken:{type:String},
    resstPasswordExpires:{type:Date}
});

const User = mongoose.model("user",UserScema)

module.exports = User;