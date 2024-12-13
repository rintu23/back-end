const multer = require('multer')

const storage = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,'./uploads')
    },
    filename:(req,file,callback)=>{
        const filename = `image-${Date.now()}-${file.originalname}`
        callback(null,filename)
    }
})

const filefilter = (req,file,callback)=>{    
    
    if(file.mimetype === 'image/jpg'  || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'){
        return callback(null,true)
}
req.fileValidationError = 'only png and jpg file are allowed'
callback(null,false)

}

const multerConfig = multer({storage,fileFilter:filefilter})

module.exports = multerConfig