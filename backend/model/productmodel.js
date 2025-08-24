const mongoose=require('mongoose')
const productSchema=new mongoose.Schema({
    productname:{type:String,required:true},
    price:{type:Number,required:true},
    category:{type:String,required:true},
    description:{type:String,required:true},
    image:{type:String,required:true},
    stock_available:{type:Number,required:true},
    isactive:{type:Boolean},
    reviews:[{
        user:{type:mongoose.Schema.Types.ObjectId,ref:'users'},
        rating:{type:Number,required:true},
        comment:{type:String,required:true}
    }],
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date.now}
})

module.exports=mongoose.model('products',productSchema)