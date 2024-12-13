const jwt = require('jsonwebtoken');

const jwtMiddleware = (req,res,next)=>{
    try{
        const token = req.headers['authorization'].split(' ')[1]

        const jwtresponse = jwt.verify(token,'superkey2323')
        req.payload = jwtresponse.id
        next()
    }catch(err){
        res.status(401).send('Authorization faild....please login')
    }
}
module.exports = jwtMiddleware