const express = require('express')
const router = new express.Router()
const useController = require('../Controller/useController')
const multerConfig = require('../Middleware/MulterMiddleware')
const productController = require('../Controller/productController')
const jwtMiddleware = require('../Middleware/jwtMiddleware')
const AdminMiddleware = require('../Middleware/AdminMiddleware')

router.post('/register',useController.register)

router.post('/login',useController.login)
//addproduct
router.post('/productadd',jwtMiddleware,AdminMiddleware,multerConfig.single('productimage'),productController.addproduct)


// get all products - admin
router.get('/getallproducts',jwtMiddleware,AdminMiddleware,productController.getproducts)

//delete error

router.delete('/productdel/:id',jwtMiddleware,AdminMiddleware,productController.deleteproduct)

//update

router.put('/update-product/:id',jwtMiddleware,AdminMiddleware,multerConfig.single('productimage'),productController.editproduct)


//get product based category

router.get('/product-category/:category',productController.getcategory)
module.exports = router