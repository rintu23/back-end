const cartmodel = require('../Models/cartmodel')

exports.addcart = async(req,res)=>{
    const {userId} = req.params
    const {id,count} = req.body
    


    try{
        const existingUser = await cartmodel.findOne({userId})

        

        if(existingUser){
            const product = existingUser.products.find(p=>p.ProductId == id)

            if(product){
                product.count +=1
            }else{
                existingUser.products.push({ProductId : id,count})
            }
           
            await existingUser.save()
            res.status(200).send({message:"product added successfully to cart...",existingUser})
        }else{
            const cartData =  new cartmodel({
                userId,
                products:{ProductId: id,count},
            })
            await cartData.save()
            res.status(200).send("product added to cart")
        }
    }catch(error){
        res.status(500).send("Internal server error") 
        console.log(error);
         
    }
}

exports.getCartProducts = async(req,res)=>{
    const {userId} = req.params

    try{
        const products = await cartmodel.findOne({userId}).populate('products.ProductId','productname productimage price')
        console.log(products);
        if(!products){
            return res.status(404).send({message:"Cart is Empty"})
        }
        res.status(200).send(products)
    } catch (error) {
        res.status(500).send("Internal server error...")
        console.log(error);
        
    }
}

exports.Deleteproducts =async(req,res)=>{
    const userid = req.payload
    const {productId} = req.params

    try{
        const cartData = await cartmodel.findOne({userId:userid})
        if(!cartData){
            res.status(404).send({message:"cart is not found"})
        }
        cartData.products = cartData.products.filter((p)=>p.ProductId!=productId)
        await cartData.save()
        
        res.status(200).send({message:'item removed from cart',cartData})    
}catch(error){
    res.status(500).send("Internal server error...")
    console.log(error);
    
}
}