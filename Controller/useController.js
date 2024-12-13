const bcrypt = require('bcrypt')
const userModel = require('../Models/usermodel')
const jwt = require('jsonwebtoken');


exports.register = async(req,res)=>{
    const {name,email,password}=req.body

    if(!name || !email || !password){
        res.status(400).send("please fill the form")
    }else{
        try{
            const existingUser = await userModel.findOne({email})
            if(existingUser){
                res.status(400).send({message:'Already registerd, please fill diffrent email...'})
            }else{
                const saltRounds = 10
                const hashpassword = await bcrypt.hash(password,saltRounds)

                const newUser = await new userModel({
                   name,email,password:hashpassword,phone:'',Address:'',gender:'',profilepicture:''
        })
        newUser.save()
        res.status(200).send({message:"new user added",newUser})
            }
        
    }catch(err){
        res.status(500).send('internal server error')
        console.log(err);
        
    }
   }
}
exports.login = async(req,res)=>{
    const{email,password} = req.body

    try{
        const existinguser = await userModel.findOne({email})
        if(existinguser){
            const result = await bcrypt.compare(password,existinguser.password)
            if(result){
                const token = jwt.sign({id:existinguser._id},'superkey2323')
                res.status(200).send({token,existinguser})
            }else{
                res.status(404).send({message:'Incorrect email or password'})
            }
        }else{
                res.status(404).send({message:'Accound not found'}) 
        }
    }catch(err){
        res.status(500).send('Internal server error')
        console.log(err);
        
    }
}
