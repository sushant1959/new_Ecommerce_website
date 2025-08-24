const usermodel = require('../model/usermodel')
const bcrypt = require('bcryptjs')
const registeruser = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'username,email,password are required' })
        }
        let user=await usermodel.findOne({email});
        if(user){
            return res.status(400).json({ error: 'user already exists' })
        }
        req.body.password=await bcrypt.hash(password,10);
        let newuser=new usermodel(req.body);
        await newuser.save();
        res.status(200).json({ message: "user registered successfully", user: newuser })
    }
    catch (error) {
        res.status(500).json({ error: "internal server error"})
    }
}

const login=async (req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({ error: 'email,password are required' })
        }
       let user=await usermodel.findOne({email});
       if(!user){
        return res.status(400).json({ error: 'user not found' });
       }
       const ismatch=await bcrypt.compare(password,user.password);
       if(!ismatch){
        return res.status(400).json({ error: 'password not match' });
       }
       res.status(200).json({ message: "user logged in successfully", user: user })
       
    } catch (error) {
        res.status(500).json({ error: "internal server error" })
    }
}

const getusers=async(req,res)=>{
    try {
        const users=await usermodel.find().select('-password');
        return res.status(200).json({ message: "users fetched successfully", users: users })
    } catch (error) {
        return res.status(500).json({ error: "internal server error" })
    }
}

const getuserbyemail=async(req,res)=>{
    try {
        const email=req.params.email;
        if(!email){
            return res.status(400).json({ error: 'email is required' })
        }
        const user=await usermodel.findOne({email}).select("-password")
        if(!user){
            return res.status(400).json({error:"user not found"})
        }
        return res.status(200).json({message:"user fetched",user:user})  
    } catch (error) {
        return res.status(500).json({ error: "internal server error",error:error })
    }
}

const updateuser=async(req,res)=>{
   try {
      const id=req.params.id;
      if(!id){
         return res.status(400).json({ error: 'id is required' })
      }
      const updateduser=await usermodel.findByIdAndUpdate(id,req.body,{new:true});
      if(!updateduser){
        return res.status(404).json({error:"update failed user not found"})
      }
      return res.status(200).json({message:"user updated successfully",user:updateduser})
   } catch (error) {
    console.log(error);
    
      return res.status(500).json({ error: "internal server error"})
   }
}

const deleteuser=async(req,res)=>{
    try {
        const id=req.params.id;
        if(!id){
           return res.status(400).json({ error: 'id is required' })
        }
        const deleteduser=await usermodel.findByIdAndDelete(id);
        if(!deleteduser){
          return res.status(404).json({error:"delete failed user not found"})
        }
        return res.status(200).json({message:"user deleted successfully",user:deleteduser})
    } catch (error) {
        return res.status(500).json({ error: "internal server error" })
    }
}

module.exports = { registeruser,login,getusers,getuserbyemail,updateuser,deleteuser }