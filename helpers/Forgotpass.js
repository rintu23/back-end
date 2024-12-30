const nodemailer = require('nodemailer')

const forgetpassword = async(email , link, name)=>{
try{
    const transporter = nodemailer.createTransport({
        service:'Gmail',
        auth:{
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    })

    const mailOptions = {
        from:process.env.EMAIL,
        to:email,
        subject: 'Reset Password',
        html: `<p>Hi ${name}
        Forget your account password link is ${link}`
    }

    transporter.sendMail(mailOptions,(err,info)=>{
        if(err)
            console.log(err);
            
    })
}catch(error) {
    console.log(error);
    throw error
    
}
}

module.exports = forgetpassword