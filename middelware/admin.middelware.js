const jwt = require("../config/jwt");

module.exports = async (req, res, next) => {
  if (req.body.token) {
    let dataFromToken = await jwt.verifyToken(
      req.headers["x-auth-token"] || req.body.token
    );
    if (dataFromToken.isAdmin) next();
  } else res.status(403).json("unauthorized access!");
};
