const productmodel = require("../model/productmodel");
const usermodel = require("../model/usermodel");

const createproduct=async(req,res)=>{
    try {
        const userid=req.params.userid;
        const {productname,price,category,description,image,stock_available}=req.body;
        if(!userid || !productname || !price || !category || !description || !image || !stock_available){
            return res.status(400).json({ error: 'userid,productname,price,category,description,image,stock_available are required' })
        }
        let user=await usermodel.findById(userid);
        if(!user){
            return res.status(400).json({ error: 'user not found' })
        }

        if(user.isadmin!==true){
            return res.status(400).json({ error: 'user is not admin' })
        }
        let newproduct=new productmodel(req.body);
        await newproduct.save();
        return res.status(200).json({ message: "product created successfully", product: newproduct })
    }catch(error) {
       return res.status(500).json({ error: 'internal server error' }) 
    }
}

const getproducts=async(req,res)=>{
    try {
      let products=await productmodel.find();
      return res.status(200).json({message:'products fetched successfully',products:products})
    }catch(error) {
       return res.status(500).json({error:"internal server error"}) 
    }
}

const getproductbyid=async(req,res)=>{
    try {
        let id=req.params.id;
        if(!id){
            return res.status(400).json({ error: 'id is required' })
        }
        let product=await productmodel.findById(id);
        if(!product){
            return res.status(400).json({ error: 'product not found' })
        }
        return res.status(200).json({ message: "product fetched successfully", product: product })
    } catch (error) {
        return res.status(500).json({ error: 'internal server error' })
    }
}

const updateproduct=async (req,res)=>{
    try {
        let id=req.params.id;
        if(!id){
            return res.status(400).json({error:"id is required"})
        }
        let updatedproduct=await productmodel.findByIdAndUpdate(id,req.body);
        if(!updatedproduct){
            return res.status(404).json({error:"product not found"})
        }
        return res.status(200).json({message:"updated successfully",product:updatedproduct})
    } catch (error) {
        return res.status(500).json({error:"internal server error"})
    }
}

const deleteproduct=async (req,res)=>{
    try {
        let id=req.params.id;
        if(!id){
            return res.status(400).json({error:"id is required"})
        }
        let deletedproduct=await productmodel.findByIdAndDelete(id);
        if(!deletedproduct){
            return res.status(404).json({error:"product not found"})
        }
        return res.status(200).json({message:"updated successfully",product:deletedproduct})
    } catch (error) {
        return res.status(500).json({error:"internal server error"})
    }
}



module.exports={createproduct,getproducts,getproductbyid,updateproduct,deleteproduct}