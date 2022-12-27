const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/* create user schema */
const usersSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  profileImage: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});

//create collection
//all the munipulation on the documents will be using this object
const Users = mongoose.model("Users", usersSchema);

//this function will create new user
const insertUser = (
  firstname,
  lastname,
  email,
  password,
  phone,
  profileImage,
  isAdmin
) => {
  const user = new Users({
    firstname,
    lastname,
    email,
    password,
    phone,
    isAdmin,
    profileImage,
  });
  return user.save();
};

const selectUserByEmail = (email) => {
  return Users.find({ email });
};

const selectUserById = (id) => {
  return Users.findOne({ _id: id });
};

const updatePassword = (email, password) => {
  return Users.updateOne({ email }, { password });
};

const updateProfileImage = (email, profileImage) => {
  return Users.updateOne({ email }, { profileImage });
};

const selectAllUsers = () => {
  return Users.find();
};

const deleteUserById = async (userId) => {
  return await Users.findByIdAndDelete(userId);
};
module.exports = {
  insertUser,
  selectUserByEmail,
  selectAllUsers,
  deleteUserById,
  updatePassword,
  selectUserById,
  updateProfileImage,
};
