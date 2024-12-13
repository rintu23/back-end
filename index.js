require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./Routes/router')
require('./DB/connection')

const server = express()

server.use(cors())
server.use(express.json())
server.use(router)
server.use('/uploads',express.static('uploads'))


const port = 4000 || process.env.PORT  

server.listen(port, ()=>{
    console.log(`express server is running on port ${port} and waiting for client requists...`);
    
})

server.get('/',(req,res)=>{
    res.send('<h1>Server is running...</h1>')
})