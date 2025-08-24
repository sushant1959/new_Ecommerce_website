const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    contact:{type:Number},
    isadmin:{type:Boolean},
    isblocked:{type:Boolean,default:false},
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date.now}
})

module.exports=mongoose.model('users',userSchema)