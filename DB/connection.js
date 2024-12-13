const mongoose = require('mongoose')

const connectionString = process.env.DATABASE

mongoose.connect(connectionString).then(()=>{
    console.log('mongodb atlas connected');
}).catch((err)=>{
    console.log('mongodb connction error',err);
})