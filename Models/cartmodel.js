const mongoose = require('mongoose')


const cartSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'userModel'
    },
    products:[
        {
            ProductId :{
                type:mongoose.Schema.Types.ObjectId,
                required:true,
                ref:'productModel'
            },
            count:{
                type:Number,
                required:true
            }
        }
    ]
})

const cartmodel = mongoose.model('cartmodel',cartSchema)
module.exports = cartmodel