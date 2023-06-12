const mongoose = require("mongoose");
const productSchema = mongoose.Schema(
  {
    category: {type: String, required: true},
    product_name: {type:String, required: true},
    description: { type:String,required: true,},
    imgs: [String],
    img_ids: [String],
    brand: String,
    price: { type: Number,default: 0, },
    countInStock: { type: Number, max: 100,min: 0,},
    rating: {type: Number,default: 0,max: 5,min: 0,},
    reviews: String ,
    product_img: String,
    

  },
  { timestamps: true },
  { collection: "product" }
);
const model = mongoose.model("Product", productSchema);
module.exports = model;
