const { mongoose } = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    user_id: { type: String },
    products: [
      {
        product_name: String,
        product_id: String,
        img_url: String,
        price: Number,
        product_quantity: Number,
      },
    ],
    cart_count: {type: Number, default: 0}, 
    total_amount: { type: Number}
  },
  { timestamp: true },
  { collection: "cart" }
);

const model = mongoose.model("Cart", cartSchema);
module.exports = model;