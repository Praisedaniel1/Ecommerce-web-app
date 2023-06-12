const mongoose = require("mongoose");

const adminSchema = mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: { type: String },
    username: { type: String, unique: true },
    roles: {type: String, default : "admin"}
  },
  { timestamp: true },
  { collection: "admin" }
);
const model = mongoose.model("Admin", adminSchema);
module.exports = model;
