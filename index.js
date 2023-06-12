const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

// init mongoose
mongoose.connect(process.env.MONGO_URI);

const con = mongoose.connection;
con.on("open", (error) => {
  if (!error) {
    console.log("DB connection successful");
  } else {
    console.log(`DB connection failed with error: ${error}`);
  }
});

app.use(express.json());
//app.use(express.urlencoded());

app.use("/auth", require("./routes/auth"));
app.use("/admin", require("./routes/admin"));
app.use("/product", require("./routes/product"));
app.use("/category", require("./routes/category"));
app.use("/cart", require("./routes/cart"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
