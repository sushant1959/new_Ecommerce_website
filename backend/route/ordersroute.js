const express=require('express');
const { createorder,getallorders,getorderhistoryofuser,updateorder} = require('../controller/orderscontroller');

const router=express.Router();

//endpoints
router.post('/orders',createorder)
router.get('/orders',getallorders)
router.get('/orders/:userid',getorderhistoryofuser);
router.put('/orders/:id',updateorder);
module.exports=router