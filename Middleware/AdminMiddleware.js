const userModel = require("../Models/usermodel")

const AdminMiddleware = async (req,res,next)=>{
    const id = req.payload

    const user = await userModel.findById(id)
    if(user.role === 1){
        return next()
    }
    return res.status(409).send("Access Denid")
}

module.exports = AdminMiddleware