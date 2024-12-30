const bcrypt = require('bcrypt')
const userModel = require('../Models/usermodel')
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const otpsending = require('../helpers/otpsending');
const forgetpassword = require('../helpers/Forgotpass');
const { jwtDecode } = require('jwt-decode');
const { default: axios } = require('axios');
const reviewModel = require('../Models/reviewModel');


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
                const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
                const otpExpries = new Date(Date.now()+10*60*1000)

                const newUser = await new userModel({
                   name,email,password:hashpassword,phone:'',Address:'',gender:'',profilepicture:'',otpExpries,otp
        })
        newUser.save()
        await otpsending(email,otp)

        res.status(200).send({message:"new user added",newUser})
            }
        
    }catch(err){
        res.status(500).send('internal server error')
        console.log(err);
        
    }
   }
}

//otp verification
exports.otpVerification = async(req,res)=>{
    const {email,otp} = req.body
    try{
        if(!email || !otp){
            return res.status(400).send({message:"please enter a valid Email or Password"})
        }else{
            const existingUser = await userModel.findOne({email})
            if(!existingUser){
                return res.status(404).send("user not found")
            }
            if(existingUser.otp != otp){
                return res.status(400).send("Invalid otp... try again")
            }
            const date = new Date(Date.now())
            if(existingUser.otpExpries<date){
                return res.status(410).send({message:"time expired"})
            }
            existingUser.isVerified = true
            existingUser.otp = null
            existingUser.otpExpries = null
             await existingUser.save()
             res.status(200).send({message:"Accound verified.."})

            }
        }
            catch(err){
                res.status(500).send("internel server error")
                console.log(err);
                
            }
        }
exports.resendotp = async(req,res)=>{
    const {email} = req.body
try{
    const existingUser = await userModel.findOne({email})

    if(!existingUser){
       return res.status(404).send({message:"user not found"})
    }
    const date = new Date(Date.now())
    if(existingUser.otpExpries>date){
        return res.status(400).send({message:"otp still valid"})
    }
    const newotp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    const otpExpries = new Date(Date.now()+10*60*1000)

    existingUser.otp = newotp
    existingUser.otpExpries = otpExpries
    await existingUser.save()
    await otpsending(email,newotp)
    res.status(200).send({message:"resend otp.."})
}catch (error){
    res.status(500).send('Internal server error')
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

//forgot password

exports.forgotPassword = async(req,res)=>{
    const {email} = req.body

    try{
        const existingUser = await userModel.findOne({email})

        if(!existingUser){
            return res.status(404).send('Account not found')
        }else{
            const token = jwt.sign({id:existingUser._id},'superkey123',{expiresIn:'30m'})
            const base_URL = process.env.BASE_URL
            const resetLink = `${base_URL}/changepassword/${token}`

            await forgetpassword(email,resetLink,existingUser.name)
            res.status(200).send('Reset link send')
        }
    } catch (error) {
        res.status(500).send('Internal server error')
        console.log(error);
        
    }
}

exports.updatePassword = async(req,res)=>{
            const {password, token} = req.body
            try{
            const decodeToken = jwtDecode(token)

            const existingUser = await userModel.findById(decodeToken.id)

            if(!existingUser){
                return req.status(404).send('User not found')
            }else{
                const saltRounds = 10
                const hashpassword = await bcrypt.hash(password,saltRounds)
                existingUser.password = hashpassword
                await existingUser.save()
                res.status(200).send('password changed')
            }
            } catch (error) {
                res.status(500).send('Internal server error')
                console.log(error);
                
            }
           
}

exports.googleSignIn = async(req,res)=>{
    const {Googletoken} = req.body

    try {
        if(!Googletoken){
            return res.status(400).send({message:"Token is required"})
        }
    
        const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${Googletoken}`)
    
        if(response.data.aud != process.env.CLIENT_ID){
            return res.status(403).send({message:"Invalid Token"})
        }
    
        const name = response.data.name
        const email = response.data.email
        const profilepicture = response.data.picture
    
        const existingUser = await userModel.findOne({email})
    
        if(!existingUser){
            const newUser = new userModel({
                 name,email,password:'',phone:'',Address:'',gender:'',profilepicture,otpExpries:'',isVerified:true,otp:''
            })
            await newUser.save()
            const token = jwt.sign({id:newUser._id},'superkey2323')
            res.status(200).send({token,user:newUser})
        }
        const token = jwt.sign({id:existingUser._id},'superkey2323')
            res.status(200).send({token,user:existingUser})
            
    } catch (error) {
        res.status(500).send("Internal server error")
        console.log(error);
        
    }
}

exports.getUsers = async(req,res)=>{
    try{
    const users = await userModel.find({role: {$ne: 1}})
    res.status(200).send(users)
    }catch (error) {
        res.status(500).send("server error")
        console.log(error);
        
    }
}

//app reviews

exports.appReview = async (req,res)=>{
    const {review,username,email} = req.body

    try{
        if(!review || !username || !email){
            return res.status(400).send('fill all fileds')
        }else{
            const newReview = await reviewModel({
                review,username,email
            })
            await newReview.save()
            res.status(200).send(newReview)
        }
    } catch (error) {
        res.status(500).send({message:"Internal server error"})
        console.log(error);
        
    }
}

//get app review
exports.getappReview = async(req,res)=>{
    try{
        const users = await reviewModel.find()
        res.status(200).send(users)
    }catch(err){
        res.status(500).send('Internal Server Error')
        console.log(err);
        
    }
}