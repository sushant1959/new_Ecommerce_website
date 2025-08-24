const express=require('express')
const mongoose=require('mongoose')
const connect=require('./db/connectdb');
const userroute=require('./route/userroute');
const productroute=require('./route/productroute')
const cartroute=require('./route/cartroute')
const orderroute=require('./route/ordersroute')
const cors=require('cors')
const app=express()
connect();// calling db connection function
app.use(express.json({limit:"30mb",extended:true}))
app.use(express.urlencoded({limit:"30mb",extended:true}))
app.use(cors())
app.get('/api/test',(req,res)=>{
    res.status(200).json('server working fine')
})
app.use('/api',userroute)
app.use('/api',productroute)
app.use('/api',cartroute)
app.use('/api',orderroute)
app.listen(4000,()=>{
    console.log("server is running on port 4000")
})