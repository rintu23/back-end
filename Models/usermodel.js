const { default: mongoose } = require("mongoose");

const Userschema = new mongoose.Schema({
    name:{
        required:true,
        type:String,
    },
    email:{
        required:true,
        type:String
    },
    password:{
        required:true,
        type:String
    },
    phone:{
        type:String
    },
    Address:{
        type:String
    },
    gender:{
        type:String
    },
    profilepicture:String,
    role:{
        type:Number,
        default: 0
    }
})
const userModel = mongoose.model('usermodel',Userschema)
module.exports = userModel