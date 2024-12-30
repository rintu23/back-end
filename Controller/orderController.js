const Razorpay = require("razorpay")
const paymentModel = require("../Models/paymentmodel")
const PDFDocument = require('pdfkit');

exports.paymentController = async(req,res)=>{
    const {amount} = req.body

    try{
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })

        const options = {
            amount,
            currency:'INR'
        }

        const response = await razorpay.orders.create(options)
        res.status(200).send(response)
    }catch (error) {
        res.status(500).send("Internal server error...")
        console.log(error);
    }
}

//place order
exports.placeorderController = async(req,res)=>{
    const userID = req.payload
    console.log(userID);
    
    const {
        
        ProductID,
        Address,
        City,
        Postelcode,
        Phoneno,
        PaymentID,
        amount
    } = req.body;
    console.log(req.body);
    

    if(!userID || !ProductID || !Address || !City || !Postelcode || !Phoneno || !PaymentID|| !amount){
        return res.status(400).send({message:"please fill the form"})
    }
    try{
        const newPayment = new paymentModel({
            userID,
            ProductID,
            Address,
            City,
            Postelcode,
            Phoneno,
            PaymentID,
            amount
        })
        const savedPayment = await newPayment.save()
        res.status(201).send(savedPayment)
    } catch (error) {
        console.log(error);
        res.status(500).send({message:"Failed to place order"})
        
    }
    
}

// get order history

exports.getOrders = async (req, res) =>{
    const userID = req.payload

    try{
        const orders = await paymentModel.find({userID}).populate('ProductID','productname productimage')
        if (!orders || orders.length === 0) {
            return res.status(404).send({ message:"orders not found"})
        }
        res.status(200).send(orders)
    } catch (error) {
        console.error(error)
        res.status(500).send('Internal server error')
    }
}

//get all order history for Admin
exports.getAdminOrders = async (req, res) =>{

    try{
        const orders = await paymentModel.find().populate('ProductID','productname productimage').populate('userID','name email')
        if (!orders || orders.length === 0) {
            return res.status(404).send({ message:"orders not found"})
        }
        res.status(200).send(orders)
    } catch (error) {
        console.error(error)
        res.status(500).send('Internal server error')
    }
}

exports.pdfGeneration = async(req,res)=>{
    const {id} = req.body
try{
    const orderDetails = await paymentModel.findById(id).populate('userID', 'email')
    //   console.log(orderDetails);
      
    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt-${id}.pdf`);

    doc.pipe(res);

    doc.fontSize(20).text('Payment Receipt', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Payment ID: ${orderDetails.PaymentID}`);
    doc.text(`Order ID: ${orderDetails._id}`);
    doc.text(`Amount: ₹${orderDetails.amount / 100}`); 
    doc.text(`Status: ${orderDetails.status}`);
    doc.text(`Email: ${orderDetails.userID.email}`);
    doc.text(`Contact: ${orderDetails.Phoneno}`);
    doc.text(`Address: ${orderDetails.Address}`);
    doc.text(`Date: ${orderDetails.Date}`);

    doc.end();
}
catch(error) {
    console.error('Error fetching payment details:', error);
    res.status(500).send('Error fetching payment details');
}
}