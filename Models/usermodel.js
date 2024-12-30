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
    },
    otpExpries:{
        type:Date
    },
    isVerified:{
        required:true,
        type:Boolean,
        default:false
    },
    otp:{
        type:String
    }
})
const userModel = mongoose.model('usermodel',Userschema)
module.exports = userModel