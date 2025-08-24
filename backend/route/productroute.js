const express=require('express')
const router=express.Router()
const {createproduct, getproducts,getproductbyid,updateproduct,deleteproduct}=require('../controller/productcontroller')

router.post('/product/:userid',createproduct) 
router.get('/product',getproducts);
router.get('/product/:id',getproductbyid);
router.put('/product/:id',updateproduct);
router.delete('/product/:id',deleteproduct);
module.exports=router