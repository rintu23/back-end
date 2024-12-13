const {default:mongoose} = require('mongoose')

const productSchema = new mongoose.Schema({
    productname:{
        require:true,
        type:String,
    },
    productimage:{
        require:true,
        type:String,
    },
    stock:{
        require:true,
        type:String,
    },
    price:{
        require:true,
        type:Number,
    },
    category:{
        require:true,
        type:String,
    },
    discription:{
        require:true,
        type:String,
    }
})

const productModel = mongoose.model('productModel',productSchema)
module.exports = productModel