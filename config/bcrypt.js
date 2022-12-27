const bcrypt = require("bcryptjs");

const createHash = (password) => {
  return bcrypt.hash(password, 10);
};
const cmpHash = (password, hash) => {
  return bcrypt.compare(password, hash);
};
module.exports = {
  createHash,
  cmpHash,
};
