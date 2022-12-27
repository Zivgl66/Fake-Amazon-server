const express = require("express");
const router = express.Router();
const productsModel = require("../../models/products.model");
const productsValidation = require("../../validation/products.validation");
const adminMiddelaware = require("../../middelware/admin.middelware");

//get all products from DB
router.get("/", async (req, res) => {
  try {
    const products = await productsModel.selectAllProducts();
    res.json(products);
  } catch (err) {
    res.status(401).json(err);
  }
});

//getproduct by id
router.get("/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    let product = await productsModel.getProductsById(req.params.id);
    if (product) res.json(product);
    else res.json({ message: "product not found" }).status(401);
  } catch (err) {
    res.status(401).json(err);
  }
});

//getproduct by catagory
router.get("/:catagory", async (req, res) => {
  try {
    console.log(req.params.catagory);
    let products = await productsModel.getProductsByCatagory(
      req.params.catagory
    );
    if (products) res.json(products);
    else res.json({ message: "catagory not found" }).status(401);
  } catch (err) {
    res.status(401).json(err);
  }
});

//delete product by id
router.get("/deleteproduct/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    let deleted = await productsModel.deleteProductById(req.params.id);
    console.log(deleted);
    if (deleted) {
      res.json({ message: "deleted the product from DB" }).status(202);
    } else {
      res.json({ message: "product not found!" }).status(304);
    }
  } catch (err) {
    console.log(err);
    res.json(err).status(401);
  }
});

//create a product in the DB
router.post("/", async (req, res) => {
  try {
    const validatedValue = await productsValidation.validateNewProductSchema(
      req.body
    );
    await productsModel.insertProduct(
      validatedValue.name,
      validatedValue.price,
      validatedValue.description,
      validatedValue.catagory,
      validatedValue.stock,
      validatedValue.rating,
      validatedValue.imageURL,
      validatedValue.sellerId
    );
    res.status(200).json("new product added");
  } catch (err) {
    console.log(err);
    res.status(401).json(err);
  }
});

//update a product stock in the DB
router.post("/updateproductstock", async (req, res) => {
  try {
    console.log(req.body);
    const validatedUpdate = await productsValidation.validateNewStockSchema(
      req.body
    );
    let updatedDoc = await productsModel.updateProductStock(
      validatedUpdate.productId,
      validatedUpdate.stock
    );
    res.json({ message: "updated the stock" }).status(202);
  } catch (err) {
    console.log(err);
    res.status(401).json(err);
  }
});

router.post("/updateproductprice", async (req, res) => {
  try {
    console.log(req.body);
    const validatedUpdate = await productsValidation.validateNewPriceSchema(
      req.body
    );
    let updatedDoc = await productsModel.updateProductPrice(
      validatedUpdate.productId,
      validatedUpdate.price
    );
    res.json({ message: "updated the price" }).status(202);
  } catch (err) {
    console.log(err);
    res.status(401).json(err);
  }
});

module.exports = router;
