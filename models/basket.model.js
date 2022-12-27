const { json } = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const productsModel = require("../../models/products.model");

const basketsSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Products", required: true },
  quantity: { type: Number, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "Users" },
  productPrice: { type: Number, required: true },
});

const Baskets = mongoose.model("baskets", basketsSchema);

const selectAllProductsIdOfBasket = async (id) => {
  const docs = await Baskets.find(id);
  return docs;
};

//working - adding to basket if item doesnt exist, if it does it updates the quantity.
const addProductToBasket = async (
  productId,
  quantity,
  userId,
  productPrice
) => {
  let existProduct = await Baskets.findOne({ productId, userId });
  if (existProduct) {
    Baskets.findByIdAndUpdate(
      existProduct._id.toHexString(),
      {
        quantity: quantity,
      },
      (err, res) => {
        if (err) {
          console.error(err);
          throw err;
        }
        return res;
      }
    );
  } else {
    const basketItem = new Baskets({
      productId,
      quantity,
      userId,
      productPrice,
    });
    console.log(basketItem);
    return basketItem.save();
  }
};

const updateBasketProduct = async (basketId, quantity) => {
  return await Baskets.findByIdAndUpdate(basketId, {
    quantity: quantity,
  });
};

const deleteProductFromBasket = async (basketId) => {
  return await Baskets.findByIdAndDelete(basketId);
};

const emptyBasket = async (id) => {
  return await Baskets.deleteMany(id);
};

module.exports = {
  selectAllProductsIdOfBasket,
  addProductToBasket,
  updateBasketProduct,
  deleteProductFromBasket,
  emptyBasket,
};
