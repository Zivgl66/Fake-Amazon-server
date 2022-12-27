const jwt = require("jsonwebtoken");

const generateToken = (data, expiration) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      data,
      process.env.JWT_KEY,
      { expiresIn: expiration },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    );
  });
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_KEY, (err, dataFromToken) => {
      if (err) reject(err);
      else resolve(dataFromToken);
    });
  });
};

module.exports = {
  generateToken,
  verifyToken,
};
