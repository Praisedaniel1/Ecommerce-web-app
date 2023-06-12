const express = require("express");
const Admin = require("../model/admin");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// signup endpoint
router.post("/signup", async (req, res) => {
  const {
    email,
    password: plainTextPassword,
    phone,
    username,
  } = req.body;

  // checks
  if (!email || !plainTextPassword || !phone || !username) {
    return res
      .status(400)
      .send({ status: "error", msg: "All fields should be filled" });
  }

  //check for email
  const valid = /@gmail.com/.test(email);

  if (!valid) {
    return res
      .status(400)
      .send({ status: "error", msg: "Enter a valid email" });
  }
  try {
    // get timestamp~
    const timestamp = Date.now();
    // encrpt password
    const password = await bcrypt.hash(plainTextPassword, 10);

    // create user document
    let admin = new Admin();
    admin.email = email;
    admin.password = password;
    admin.phone = phone;
    admin.username = `${email}_${timestamp}`;

    // save document on mogodb
    admin = await admin.save();

    return res.status(200).send({ status: "ok", msg: "admin created", admin });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .send({ status: "error", msg: "Some error occured", e });
  }
});


// login endpoint
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    // checks
    if (!email || !password) {
      return res
        .status(400)
        .send({ status: "error", msg: "All fields should be filled" });
    }
  
    try {
      const admin = await Admin.findOne({ email: email }).lean();
      if (!admin) {
        return res
          .status(404)
          .send({ status: "error", msg: `No user with email: ${email} found` });
      }
  
      if (bcrypt.compare(password, admin.password)) {
        const token = jwt.sign(
          {
            _id: admin._id,
            email: admin.email,
            username:admin.username
          },
          process.env.JWT_SECRET
        );
  
        return res
          .status(200)
          .send({ status: "ok", msg: "Login successful", admin, token: token });
      }
  
      if (admin.password != password) {
        return res
          .status(400)
          .send({ status: "error", msg: "Email or Password incorrect" });
      }
     //console.log(token)

      delete admin.password;
    } catch (e) {
      console.log(e);
      return res
        .status(400)
        .send({ status: "error", msg: "Some error occured", e });
    }
  });
module.exports = router;