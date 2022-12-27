const express = require("express");
const router = express.Router();
const basketsModel = require("../../models/basket.model");
const basketsValidation = require("../../validation/basket.validation");

//get all items in basket
router.post("/getbasket", async (req, res) => {
  try {
    const baskets = await basketsModel.selectAllProductsIdOfBasket(req.body);
    res.json(baskets);
  } catch (err) {
    console.log(err);
    res.status(401).json(err);
  }
});

//add a product to basket
router.post("/", async (req, res) => {
  try {
    const validatedValue = await basketsValidation.validateNewBasketSchema(
      req.body
    );
    await basketsModel.addProductToBasket(
      validatedValue.productId,
      validatedValue.quantity,
      validatedValue.userId,
      validatedValue.productPrice
    );
    res.status(200).json("new product was added / updated");
  } catch (err) {
    console.log(err);
    res.status(401).json(err);
  }
});

//delete a product from basket
router.get("/deletefrombasket/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    let deleted = await basketsModel.deleteProductFromBasket(req.params.id);
    console.log(deleted);
    if (deleted) {
      res.json({ message: "deleted the product from basket" }).status(202);
    } else {
      res.json({ message: "Id not found!" }).status(304);
    }
  } catch (err) {
    console.log(err);
    res.json(err).status(401);
  }
});

//update a product quantity in the bakset
router.post("/updatebasketquantity", async (req, res) => {
  try {
    const validatedUpdate = await basketsValidation.validateNewQuantitySchema(
      req.body
    );
    let updatedDoc = await basketsModel.updateBasketProduct(
      validatedUpdate.basketId,
      validatedUpdate.quantity
    );
    res.json({ message: "updated the quantity" }).status(202);
  } catch (err) {
    console.log(err);
    res.status(401).json(err);
  }
});

router.post("/emptybasket", async (req, res) => {
  try {
    let delted = await basketsModel.emptyBasket(req.body);
    res.json({ message: "basket is empty" }).status(202);
  } catch (err) {
    console.log(err);
    res.status(401).json(err);
  }
});

module.exports = router;
