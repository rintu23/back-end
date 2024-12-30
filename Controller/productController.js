const productModel = require("../Models/productmodel")
const userModel = require("../Models/usermodel")

exports.addproduct = async(req,res)=>{

    if(req.fileValidationError){
        return res.status(406).send('only png and jpg')
    }
    const {name,stock,price,category,discription} = req.body
    
    const productimage = req.file.filename
 
    try{
    if(!name || !stock || !price || !category || !discription){
        res.status(400).send({message:"please enter all details"})
    }else{
        const newproduct = new productModel({
            productname:name,
            productimage,
            stock,
            price,
            category,
            discription
        })
        await newproduct.save()
        res.status(200).send({message:"product added successfully",newproduct})
    }
}catch(err){
    res.status(500).send('Internal server error')
    console.log(err);
    
}
}

exports.getproducts = async(req,res)=>{
    try{
        const products = await productModel.find()
        res.status(200).send({message:'product get successfully',products})
    }catch(error){
        res.status(500).send("internal error")
    }
}

exports.deleteproduct = async(req,res)=>{
    const {id} = req.params

    try{
    const product = await productModel.findByIdAndDelete(id)
    res.status(200).send({message:"product deleted successfully!!",product})
    }catch(error){
    res.status(500).send('internal server error')
    console.log(error);

    }
}

//editproducts

exports.editproduct = async(req,res)=>{
    if(req.fileValidationError){
        return res.status(406).send('only png and jpg')
    }
    const {id} = req.params
    const {name,stock,price,category,discription,productimage} = req.body
    const updateimage = req.file? req.file.filename : productimage

    try{
        const updateproduct = await productModel.findByIdAndUpdate(id,{
            category,
            productname:name,
            discription,
            price,
            stock,
            productimage:updateimage
        },{new:true})
        res.status(200).send({message:'product updated successfully',updateproduct})
    }catch(err){
        res.status(500).send('Internal server error')
    }
}


//get product based category

exports.getcategory = async(req,res)=>{
    const {category} = req.params
    const searchKey = req.query.search;
    

    const query = {
        category,
    }
    if (searchKey) {
        query.productname = { $regex: searchKey, $options: "i" }
    }
    
    try{
    const products = await productModel.find(query)
    res.status(200).send(products)
    } catch (error) {
        res.status(500).send('Internal server error')
        console.log(error);
        
    }
}

exports.getProductDetails = async(req,res)=>{
    const {id} = req.params
try{
    const productdetails = await productModel.findById(id)
    res.status(200).send(productdetails)
} catch(error){
    res.status(500).send('internal server error')
    console.log(error); 
} 
}


// exports.review = async (req,res)=>{
//     const {review,ProductID} = req.body
//     const id = req.payload

//     console.log(review);
    
//   try{
//     const userDetails = await userModel.findById(id)

//     const product = await productModel.findById(ProductID)

//     product.reviews.push({review,username:userDetails.name})

//     await product.save()

//     res.status(200).send(product)
//   } catch (error) {
//     res.status(500).send('internal server error')
//     console.log(error); 
//   }
// }

exports.review = async (req, res) => {
    const { review, ProductID } = req.body;
    const id = req.payload;
  
    console.log(review);
  
    try {
      // Find user details
      const userDetails = await userModel.findById(id);
      if (!userDetails) {
        return res.status(404).send({ message: "User not found" });
      }
  
      // Find product by ID
      const product = await productModel.findById(ProductID);
      if (!product) {
        return res.status(404).send({ message: "Product not found" });
      }
  
      // Add review to the product
      product.reviews.push({review,username:userDetails.name});
  
      // Save updated product
      await product.save();
  
      res.status(200).send(product);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    }
  };
  