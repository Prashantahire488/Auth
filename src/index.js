const express = require("express");


const register = require("./controllers/auth.controller");
const productController = require("./controllers/product.controller");

const app = express();

app.use(express.json());


app.use("/signup", register);

app.use("/products", productController);

module.exports = app;