const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productsSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  catagory: { type: String, required: true },
  stock: { type: Number, required: true },
  rating: { type: String, required: true },
  imageURL: { type: String, required: true },
  sellerId: { type: Schema.Types.ObjectId, ref: "Users" },
});

const Products = mongoose.model("Products", productsSchema);

const selectAllProducts = () => {
  return Products.find();
};

const updateProductStock = async (productId, stock) => {
  return await Products.findByIdAndUpdate(productId, {
    stock: stock,
  });
};

const updateProductPrice = async (productId, price) => {
  return await Products.findByIdAndUpdate(productId, {
    price: price,
  });
};

const getProductsById = (productId) => {
  return Products.find({ _id: productId });
};

const getProductsByCatagory = (catagory) => {
  return Products.find({ catagory: catagory });
};
const deleteProductById = async (productId) => {
  return await Products.findByIdAndDelete(productId);
};

const insertProduct = (
  name,
  price,
  description,
  catagory,
  stock,
  rating,
  imageURL,
  sellerId
) => {
  const product = new Products({
    name,
    price,
    description,
    catagory,
    stock,
    rating,
    imageURL,
    sellerId,
  });
  return product.save();
};

module.exports = {
  selectAllProducts,
  insertProduct,
  getProductsById,
  deleteProductById,
  updateProductStock,
  updateProductPrice,
  getProductsByCatagory,
};
