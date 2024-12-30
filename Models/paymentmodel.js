const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    userID:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref: 'usermodel'
        
    },
    ProductID:{
        required:true,
        type:mongoose.Schema.Types.ObjectId, 
        ref: 'productModel'
    },
    Address:{
        required:true,
        type:String
    },
    City:{
        required:true,
        type:String
    },
    Postelcode:{
        required:true,
        type:String
    },
    Phoneno:{
        required:true,
        type:String
    },
    PaymentID:{
        required:true,
        type:String
    },
    status:{
        type:String,
        required:true,
        default:"pending"
    },
    Date:{
        required:true,
        type:Date,
        default:Date.now()
    },
    amount:{
        type:Number,
        required:true
    }
    
})

const paymentModel = mongoose.model('paymentModel',paymentSchema)
module.exports = paymentModel