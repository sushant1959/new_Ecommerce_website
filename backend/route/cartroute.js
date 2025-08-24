const express=require('express')
const router=express.Router()
const {addtocart,getcartsofuser,updatecart,deletecart}=require('../controller/cartcontroller')

router.post('/addtocart/:userid/:productid/:quantity',addtocart)
router.get('/getcartsofuser/:id',getcartsofuser);
router.put('/updatecart/:cartid/:quantity',updatecart);
router.delete('/deletecart/:cartid',deletecart);
module.exports=router