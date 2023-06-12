const express = require("express");
const Admin = require("../model/admin");
const Category = require("../model/category")
const jwt = require("jsonwebtoken");
const router = express.Router();

//creating a category
router.post("/category", async (req, res) => {
    const {token, category_name} = req.body;
    
    if (!token)
    return res
      .status(400)
      .send({ status: "error", msg: "All fields must be filled" });
  try {
    jwt.verify(token, process.env.JWT_SECRET);

     
   let category = new Category();
   category.category_name = category_name;
   category.products = [];

   //save document on mongodb
   category = await category.save();
   
   return res
      .status(200)
      .send({ status: "Success", msg: "Category Succefully Created", category });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .send({ status: "error", msg: "Some error occured", e });
  }
});
 
 
module.exports = router;
