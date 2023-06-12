const express = require("express");
const Product = require("../model/product");
const Category = require("../model/category");
//const Admin = require("../model/admin");
const jwt = require("jsonwebtoken");
const router = express.Router();
const upload = require("../utils/multer");
const cloudinary = require("../utils/cloudinary");

//create a product
router.post("/create_product", upload.array("product_files", 10), async (req, res) => {
  const {token,product_name,description,price, brand,countInStock,category, product_imgs} = req.body;
 
  //checking   for required fields
  if (!token || !product_name)
    return res
      .status(400)
      .send({ status: "error", msg: "All fields must be filled" });
  try {
    jwt.verify(token, process.env.JWT_SECRET);

    // upload image
    let img_urls = [];
    let img_ids = [];

    if (req.files) {
      if (req.files.length != 0) {
        console.log("STARTED THE IMAGE PROCESS!");
        for (let i = 0; i < req.files.length; i++) {
          let result = await cloudinary.uploader.upload(req.files[i].path, {
            folder: "Techworld",
          });
          console.log(result);
          img_urls.push(result.secure_url);
          img_ids.push(result.public_id);
        }
      }
    }

    // create product document
    let product = new Product();
    product.product_name = product_name;
    product.description = description;
    product.price = price;
    product.brand = brand;
    product.countInStock = countInStock;
    product.imgs = img_urls;
    product.img_ids = img_ids;
    product.category = category;
    

    // save document on mogodb
    product = await product.save();

    // update category document
    const categoryM = await Category.findOneAndUpdate(
      {category_name: category},
      {
        $push: {
          products: {
            product_name,
            product_id: product._id,
            img_urls:  "",
            price,
          },
        },
      },
      { new: true }
    ).lean();

    return res
      .status(200)
      .send({
        status: "Success",
        msg: "Product Succefully Created",
        product,
        category: categoryM,
      });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .send({ status: "error", msg: "Some error occured", e });
  }
});

//delete book
router.post("/delete_product", async (req, res) => {
  const { token, product_id } = req.body;

  if (!token || !product_id )
    return res
      .status(400)
      .send({ status: "error", msg: "All fields must be filled" });
  try {
    jwt.verify(token, process.env.JWT_SECRET);

    //Deletes a particular field
    const delete_product = await Product.findOneAndDelete({ _id: product_id });

    //checking for the product
    if (!delete_product) {
      return res
        .status(400)
        .send({ status: "error", msg: "Product not found" });
    }
    return res.status(200).send({ status: "Product successfully deleted" });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .send({ status: "error", msg: "Unable to delete Product ", e });
  }
});
//getting a particulat product
router.post("/get_product", async (req, res) => {
  const {token, product_id} = req.body;

  if (!token || !product_id )
    return res
      .status(400)
      .send({ status: "error", msg: "All fields must be filled" });

      try {
        jwt.verify(token, process.env.JWT_SECRET);
    
        //Deletes a particular field
        const product = await Product.findOne({ _id: product_id });
    
        //checking for the product
        if (!product) {
          return res
            .status(400)
            .send({ status: "error", msg: "Product not found" });
        }
        return res.status(200).send({ status: "Product", product });
      } catch (e) {
        console.log(e);
        return res
          .status(400)
          .send({ status: "error", msg: "Unable to find Product ", e });
      }
});

//updating a particular product
router.get("/edit_product", async (req, res) =>{
  const {token , product_id} = req.body;
   
  //checking for required fields
   if (!token || !product_id )
  return res
    .status(400)
    .send({ status: "error", msg: "All fields must be filled" });

  try{
    //verify token
   let product= jwt.verify(token, process.env.JWT_SECRET);

        let imgs;
        let img_ids;
        if(req.file) {
            if(profile.imgs !== '') {
                await cloudinary.uploader.destroy(profile.img_ids);
                const result = await cloudinary.uploader.upload(req.file.path, {folder: 'TechWorld'});
                console.log(result);
                imgs = result.secure_url;
                img_ids = result.public_id;
            }else {
                const result = await cloudinary.uploader.upload(req.file.path, {folder: 'TechWorld'});
                console.log(result);
                imgs = result.secure_url;
                img_ids = result.public_id;
            }
          }
    
            product = await Product.findOneAndUpdate(
              {_id: product_id},
              {
                 product_name,
                 description,
                 imgs ,
                 img_ids,
                 price
              },
               {new: true}
               );
    //checking if product exists
   // let product = await Product.findOne({ _id: product_id})
    if (!product)
      return res.status(400).send({ status: "error", msg: "Product not found" });
    
      return res.status(200).send({status: 'ok', msg: 'Profile updated successfully', product});

  }catch(e){
    console.log(e);
    return res
    .status(400)
    .send({ status: "error", msg: "Some error occured", e });
  }
});
module.exports = router;
