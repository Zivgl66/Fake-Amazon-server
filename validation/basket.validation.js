const Joi = require("joi");

const productIdRole = {
  productId: Joi.string().hex().length(24).trim().required(),
};
const userIdRole = {
  userId: Joi.string().hex().length(24).trim().required(),
};
const quantityRole = {
  quantity: Joi.number().min(0).max(160000).required(),
};
const basketIdRole = {
  basketId: Joi.string().length(24).trim().required(),
};
const productPriceRole = {
  productPrice: Joi.number().min(Number.MIN_VALUE).required(),
};
const newBasketSchema = Joi.object({
  ...productIdRole,
  ...userIdRole,
  ...quantityRole,
  ...productPriceRole,
});

const deleteProductFromBasketSchema = Joi.object({
  ...basketIdRole,
});

const newQuantitySchema = Joi.object({
  ...basketIdRole,
  ...quantityRole,
});
const validateNewBasketSchema = (data) => {
  return newBasketSchema.validateAsync(data, { abortEarly: false });
};

const validateDeleteBasketSchema = (data) => {
  return deleteProductFromBasketSchema.validateAsync(data, {
    abortEarly: false,
  });
};

const validateNewQuantitySchema = (data) => {
  return newQuantitySchema.validateAsync(data, { abortEarly: false });
};

module.exports = {
  validateNewBasketSchema,
  validateDeleteBasketSchema,
  validateNewQuantitySchema,
};
