const mongoose = require("mongoose");

module.exports = mongoose.connect(process.env.MONGO_CON_STR, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useUnifiedTopology: true,
});
