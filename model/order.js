const { mongoose } = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    user_id: { type: String, required: true },
    amount: {type : Number, required: true},
    address: {type: Object, required: true},
    status: {type : String, default:"pending"}
  },
  { timestamps: true },
  { collection: "order" }
);

const model = mongoose.model("Order", orderSchema);
module.exports = model;