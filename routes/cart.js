const express = require("express");
const Cart = require("../model/cart");
const User = require("../model/user");
const Product = require("../model/product");
const jwt = require("jsonwebtoken");
const router = express.Router();
const upload = require("../utils/multer");


//create a cart
router.post("/create_cart",async (req, res) =>{
   const {token, user_id, product_name, product_id, img_url, price, product_quantity} = req.body;

   //checking for required fields
   if(!token || !user_id || !product_name || !product_id || !img_url || !price)
   return res.status(400).send({ status : "error", msg : "All fieds must be filled"})
    
   try{
      //verifying token
    jwt.verify(token, process.env.JWT_SECRET);

   
   const user = await User.findOne({_id: user_id})
   if(!user){
           return res
           .status(404)
           .send({ status: "error", msg: `No user with id: ${user_id} found` });
   }
   //  const found = await Cart.findOne({_id: cart_id});
    const cartFound = await Cart.findOne({user_id});

    if(!cartFound){
       let cart = new Cart();
    cart.user_id= user_id;
    cart.cart_count = 1;
    cart.total_amount = price;
    cart.products.push(
    {
    product_name,
    product_id,
    img_url,
    price,
    product_quantity
   }
    )
    

    //saving documents to mongodb
    cart = await cart.save();
    return res.status(200).send({status: 'success', msg: 'Added successfully', cart});
    }
   //  update cart document
    const cartM = await Cart.findOneAndUpdate(
      {user_id},
      {
         $push: {
          products: {
            product_name,
            product_id,
            img_url,
            price,
            product_quantity
          },
        },
        "$inc": {cart_count: 1, total_amount: price}
      },
      {new: true}
    ).lean();
   
    return res.status(200).send({status: "Success", msg: "Cart successfully added", cartM})
   }catch(e){
    console.log(e)
    return res.status(400).send({ status: "error", msg: "Some error occured", e });
   }
});

//deleting a cart
router.post("/delete_cart", async(req, res)=>{
   const { token, cart_id } = req.body;

  if (!token || !cart_id )
    return res
      .status(400)
      .send({ status: "error", msg: "All fields must be filled" });
  try {
    jwt.verify(token, process.env.JWT_SECRET);

    //Deletes a particular field
     const delete_cart = await Cart.findOneAndDelete({ _id: cart_id });

    //checking for the product
    return res.status(200).send({ status: "Cart successfully deleted" });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .send({ status: "error", msg: "Unable to delete Product ", e });
  }

})

//increasing the quantity
router.post("/increment_quantity", async(req, res)=>{
   const {token, product_quantity, price, total_amount,user_id ,product_id} = req.body;

   if (!token || !user_id )
   return res
     .status(400)
     .send({ status: "error", msg: "All fields must be filled" });
    try{
      jwt.verify(token, process.env.JWT_SECRET);

      //incrementing product_quantity
   const cartInc = await Cart.findOneAndUpdate(
      {_id:product_id},
      {
         "$inc":{product_quantity: 1}
      },
      {new: true}
   ).lean()

   return res.status(200).send({ status: "success",  msg: "product successfully incremented", cartInc})
    }catch(e){
      console.log(e);
      return res.status({status: 'error', msg: 'An error occured', e});
    
    }
})


























module.exports = router;