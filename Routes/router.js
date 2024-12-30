const express = require('express')
const router = new express.Router()
const useController = require('../Controller/useController')
const multerConfig = require('../Middleware/MulterMiddleware')
const productController = require('../Controller/productController')
const jwtMiddleware = require('../Middleware/jwtMiddleware')
const AdminMiddleware = require('../Middleware/AdminMiddleware')
const cartController = require('../Controller/cartController')
const orderController = require('../Controller/orderController')

router.post('/register',useController.register)
router.post('/otpreg',useController.otpVerification)
router.post('/resentotp',useController.resendotp)

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

//to get ptoducts in details page

router.get('/product-details/:id',productController.getProductDetails)

//add to cart

router.post('/addcart/:userId',jwtMiddleware,cartController.addcart)

//to get cart data

router.get('/get-product-details/:userId',jwtMiddleware,cartController.getCartProducts)

// delete cart item
router.delete('/deletefromcart/:productId',jwtMiddleware,cartController.Deleteproducts)

//forgot password
router.post('/forgotpassword',useController.forgotPassword)

//update password
router.put('/updatepassword',useController.updatePassword)

// google sign in
router.post('/google/sign-in',useController.googleSignIn)

//getall users
router.get('/geallUsers',jwtMiddleware,AdminMiddleware,useController.getUsers)

//payments
router.post('/payment',jwtMiddleware,orderController.paymentController)

//place order
router.post('/placeorder',jwtMiddleware,orderController.placeorderController)

//get orders history
router.get('/get_orders',jwtMiddleware,orderController.getOrders)

//get all orders for Admin
router.get('/get_orders_Admin',jwtMiddleware,orderController.getAdminOrders)

//pdf generation
router.post('/get_pdf',jwtMiddleware,orderController.pdfGeneration)

//product review from customer
router.put('/get_cusreview',jwtMiddleware,productController.review)

//app review from customer
router.post('/put_appreview',jwtMiddleware,useController.appReview)

//get app review 
router.get('/getappreview',jwtMiddleware,AdminMiddleware,useController.getappReview)

module.exports = router

