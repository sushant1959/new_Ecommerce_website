const ordersmodel=require("../model/ordermodel")
const productmodel=require("../model/productmodel")
const usermodel=require("../model/usermodel");
const cartmodel=require("../model/cartmodel")

const createorder=async(req,res)=>{
    try {
        const {userid,productid,quantity,paymentmode,shippingaddress,status}=req.body;
        if(!userid || !paymentmode || !shippingaddress || !status){
            return res.status(400).json({ error: 'userid,paymentmode,shippingaddress,deliverydate,orderdate,status are required' })
        }
        let user=await usermodel.findById(userid);
        if(!user){
            return res.status(400).json({ error: 'user not found' })
        }
        if(productid && quantity){
           let product=await productmodel.findById(productid);
           if(!product){
               return res.status(400).json({ error: 'product not found' })
           }
           if(product.stock_available>=quantity){
              let totalamount=product.price*quantity;
              let neworderobj={
                     userid:userid,
                     products:[{
                         productid:productid,
                         quantity:quantity
                     }],
                     totalamount:totalamount,
                     paymentmode:paymentmode,
                     shippingaddress:shippingaddress,
                    
                     status:status
              }
              if(neworderobj.products.length===0){
                  return res.status(400).json({ error: 'no product selected' })
              }
              let neworder=new ordersmodel(neworderobj);
              await neworder.save();
              let updatedstock=product.stock_available-quantity;
              await productmodel.findOneAndUpdate(productid,{stock_available:updatedstock})
              return res.status(200).json({ message: "order created successfully", order: neworder })

           }else{
               return res.status(400).json({ error: 'product stock not available' })
           }  
        }else{
             let products=await cartmodel.find({userid}).populate('productid');
             let totalamount=0;
             products=products.map((product)=>{
                 totalamount+=product.productid.price*product.quantity;
                 return{
                     productid:product.productid._id,
                     quantity:product.quantity
                 }
             })
             let neworderobj={
                     userid:userid,
                     products:products,
                     totalamount:totalamount,
                     paymentmode:paymentmode,
                     shippingaddress:shippingaddress,
                     status:status
              }
              console.log(neworderobj.products);
              
              if(neworderobj.products.length===0){
                  return res.status(400).json({ error: 'no product in carts' })
              }
              //check stockavaible or not
             for(let i=0;i<neworderobj.products.length;i++){
                 let product=await productmodel.findById(neworderobj.products[i].productid)
                 if(product.stock_available<neworderobj.products[i].quantity){
                     return res.status(400).json({ error: product.productname+' stock not available' })
                 }
             }
              let neworder=new ordersmodel(neworderobj);
              await neworder.save();
              //make cart empty
              await cartmodel.deleteMany({userid})
              return res.status(200).json({ message: "order created successfully", order: neworder })
        }

    } catch (error) {
        console.log(error);
        
        return res.status(500).json({ error: 'internal server error' })
    }
}

const getallorders=async(req,res)=>{
    try {
        let orders=await ordersmodel.find().populate('userid','-password').populate('products.productid');
        return res.status(200).json({ message: "orders fetched successfully", orders: orders })
    } catch (error) {
        return res.status(500).json({ error: 'internal server error' })
    }
}
const getorderhistoryofuser=async(req,res)=>{
     try {
        let userid=req.params.userid;
        if(!userid){
            return res.status(400).json({ error: 'userid is required' })
        }
        let user=await usermodel.findById(userid);
        if(!user){
            return res.status(400).json({ error: 'user not found' })
        }
        let orders=await ordersmodel.find({userid}).populate('userid','-password').populate('products.productid');
        return res.status(200).json({ message: "orders fetched successfully", orders: orders }) 
     } catch (error) {
         return res.status(500).json({ error: 'internal server error' })
     }
}

const updateorder=async(req,res)=>{
    try {
      let id=req.params.id;
      if(!id){
          return res.status(400).json({ error: 'id is required' })
      }
      let order=await ordersmodel.findById(id);
      if(!order){
          return res.status(400).json({ error: 'order not found' })
      }
      let updatedorder=await ordersmodel.findByIdAndUpdate(id,req.body);
      if(!updatedorder){
          return res.status(404).json({ error: 'order not found' })
      }
      return res.status(200).json({ message: "order updated successfully", order: updatedorder })
    } catch (error) {
        return res.status(500).json({ error: 'internal server error' })
    }
}

module.exports={createorder,getallorders,getorderhistoryofuser,updateorder}