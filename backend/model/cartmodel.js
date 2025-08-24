const mongoose=require('mongoose')

const cartschema=new mongoose.Schema({
    userid:{type:mongoose.Schema.Types.ObjectId,ref:'users'},
    productid:{type:mongoose.Schema.Types.ObjectId,ref:'products'},
    quantity:{type:Number,required:true},
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date.now}
})

module.exports=mongoose.model('carts',cartschema)