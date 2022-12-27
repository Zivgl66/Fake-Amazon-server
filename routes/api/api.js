const express = require("express");
const router = express.Router();

const usersRouter = require("./users");
const productsRouter = require("./products");
const basketsRouter = require("./baskets");

//http://localhost:3001/api/users
router.use("/users", usersRouter);

//http://localhost:3001/api/products
router.use("/products", productsRouter);

//http://localhost:3001/api/baskets
router.use("/baskets", basketsRouter);

module.exports = router;
