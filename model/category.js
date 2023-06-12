const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    category_name: { type: String, required: true },
    category_id: String,
    products:[
     { 
      product_name: String,
      product_id: String,
      img_url: String,
      price: Number
    }
    ]
  },
  { timestamp: true },
  { collection: "category" }
);
const model = mongoose.model("Category", categorySchema);
module.exports = model;
