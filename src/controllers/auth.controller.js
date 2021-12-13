require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");


const newToken = (user) => {
  return jwt.sign({ user: user }, process.env.JWT_ACCESS_KEY);
};

router.post("/register", 
body("name")
.isLength({ min: 4, max: 20 })
.exists()
.withMessage(
  "Name has to be at least 4 characters and maximum 20 characters"
),
body("password")
.isLength({ min: 4, max: 20 })
.exists()

,
body("email").custom(async (value) => {
       
        const isEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,20}$/.test(value);
        console.log(isEmail,value)
        if (!isEmail) {
          throw new Error("Please enter a proper email address");
        }
        const productByEmail = await User.findOne({ email: value })
          .lean()
          .exec();
        if (productByEmail) {
          throw new Error("Please try with a different email address");
        }
        return true;
      }),
  async (req, res) => {
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let newErrors = errors.array().map(({ msg, param, location }) => {
      return {
        [param]: msg,
      };
    });
    return res.status(400).json({ errors: newErrors });
  }
  try { 
   
    let user = await User.findOne({ email: req.body.email }).lean().exec();
    console.log(User);
    
    if (user)
      return res.status(400).json({
        status: "failed",
        message: " Please provide a different email address",
      });

  
    user = await User.create(req.body);
      console.log(user);
    
    const token = newToken(user);

  
    res.status(201).json({ user, token });
  } catch (e) {
    return res.status(500).json({ status: "failed", message: e.message });
  }
});

router.post("/login",
body("password")
.isLength({ min: 4, max: 20 })
.exists()
.withMessage(
  "Name of product has to be at least 4 characters and maximum 20 characters"
),
body("email").custom(async (value) => {
      
        const isEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,20}$/.test(value);
        console.log(isEmail,value)
        if (!isEmail) {
          throw new Error("Please enter a proper email address");
        }
       
        return true;
      }),
      async (req, res) => {
        const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let newErrors = errors.array().map(({ msg, param, location }) => {
      return {
        [param]: msg,
      };
    });
    return res.status(400).json({ errors: newErrors });
  }
  try {
    
    let user = await User.findOne({ email: req.body.email });

   
    if (!user)
      return res.status(400).json({
        status: "failed",
        message: " Please provide correct email address and password",
      });

    
    const match = await user.checkPassword(req.body.password);

    
    if (!match)
      return res.status(400).json({
        status: "failed",
        message: " Please provide correct email address and password",
      });

   
    const token = newToken(user);

    
    res.status(201).json({ user, token });
  } catch (e) {
    return res.status(500).json({ status: "failed", message: e.message });
  }
});

module.exports = router;