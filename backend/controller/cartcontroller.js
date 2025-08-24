const cartmodel=require('../model/cartmodel')
const productmodel=require('../model/productmodel') 
const usermodel=require('../model/usermodel')

const addtocart=async(req,res)=>{
    try {
        let userid=req.params.userid;
        let productid=req.params.productid;
        let quantity=req.params.quantity || 1;
        if(!userid ||!productid){
            return res.status(400).json({ error: 'userid,productid are required' })
        }
        let user=await usermodel.findById(userid);
        if(!user){
            return res.status(400).json({ error: 'user not found' })
        }

        let product=await productmodel.findById(productid);
        if(!product){
            return res.status(400).json({ error: 'product not found' })
        }
        let newcart=new cartmodel({userid,productid,quantity});
        await newcart.save();
        return res.status(200).json({ message: "product added to cart successfully", cart: newcart })
    } catch (error) {
        return res.status(500).json({ error: 'internal server error' })
    }
}

const getcartsofuser=async(req,res)=>{
    try {
        let userid=req.params.id;
        if(!userid){
            return res.status(400).json({ error: 'userid is required' })
        }
        let user=await usermodel.findById(userid);
        if(!user){
            return res.status(400).json({ error: 'user not found' })
        }
        let cart=await cartmodel.find({userid}).populate('userid','-password').populate('productid');
       
        
        return res.status(200).json({ message: "cart fetched successfully", cart: cart })
        
    } catch (error) {
        return res.status(500).json({ error: 'internal server error' })
    }
}

const updatecart=async(req,res)=>{
    try {
        const cartid=req.params.cartid;
        const quantity=req.params.quantity || 1;
        if(!cartid){
            return res.status(400).json({error:'cartid required'})
        }

        let updatedcart=await cartmodel.findByIdAndUpdate(cartid,{quantity})
        if(!updatecart){
            return res.status(404).json({error:'cart not found'})
        }
        return res.status(200).json({message:"cart updated successfully",cart:updatedcart})
    } catch (error) {
        return res.status(500).json({error:"internal server error"})
    }
}

const deletecart=async(req,res)=>{
     try {
        const cartid=req.params.cartid;
        if(!cartid){
            return res.status(400).json({error:'cartid required'})
        }
        let deletedcart=await cartmodel.findByIdAndDelete(cartid);
        if(!deletedcart){
            return res.status(404).json({error:'cart not found'})
        }
        return res.status(200).json({message:"cart deleted successfully",cart:deletedcart})
     } catch (error) {
        return res.status(500).json({error:"internal server error"})
     }
}

module.exports={addtocart,getcartsofuser,updatecart,deletecart}