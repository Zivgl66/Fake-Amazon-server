const Joi = require("joi");

const nameRole = {
  name: Joi.string().min(2).max(255).trim().required(),
};
const priceRole = {
  price: Joi.number().min(Number.MIN_VALUE).required(),
};
const descriptionRole = {
  description: Joi.string().trim().min(1).max(16000).required(),
};
const catagoryRole = {
  catagory: Joi.string().min(2).max(255).trim().required(),
};
const imageURLRole = {
  imageURL: Joi.string().trim().min(1).max(16000).required(),
};
const sellerId = {
  sellerId: Joi.string().hex().length(24).trim().required(),
};
const productIdRole = {
  productId: Joi.string().length(24).trim().required(),
};
const stockRole = {
  stock: Joi.number().min(0).max(160000).required(),
};
const ratingRole = {
  rating: Joi.string()
    .regex(/^[1-5]{1}$/)
    .required(),
};
const newProductSchema = Joi.object({
  ...nameRole,
  ...priceRole,
  ...descriptionRole,
  ...catagoryRole,
  ...ratingRole,
  ...imageURLRole,
  ...sellerId,
  ...stockRole,
});

const newStockSchema = Joi.object({
  ...productIdRole,
  ...stockRole,
});

const newPriceSchema = Joi.object({
  ...productIdRole,
  ...priceRole,
});

const validateNewProductSchema = (data) => {
  return newProductSchema.validateAsync(data, { abortEarly: false });
};
const validateNewStockSchema = (data) => {
  return newStockSchema.validateAsync(data, { abortEarly: false });
};

const validateNewPriceSchema = (data) => {
  return newPriceSchema.validateAsync(data, { abortEarly: false });
};

module.exports = {
  validateNewProductSchema,
  validateNewStockSchema,
  validateNewPriceSchema,
};
