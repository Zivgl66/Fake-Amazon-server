const express = require("express");
const router = express.Router();
const usersValidation = require("../../validation/users.validation");
const bcrypt = require("../../config/bcrypt");
const jwt = require("../../config/jwt");
const adminMiddelaware = require("../../middelware/admin.middelware");
const usersModule = require("../../models/users.model");
const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  service: "zoho",
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASS,
  },
});

router.get("/allusers", async (req, res) => {
  try {
    const usersData = await usersModule.selectAllUsers();
    console.log(usersData);
    if (usersData.length > 0) res.json(usersData).status(200);
    else {
      res.json({ message: "No users found" }).status(401);
    }
  } catch (err) {
    console.log("error getting all users: ", err);
  }
});

router.post("/", async (req, res) => {
  try {
    const validatedValue = await usersValidation.validateSignupSchema(req.body);
    const usersData = await usersModule.selectUserByEmail(validatedValue.email);
    if (usersData.length > 0)
      res.json({ message: "email already exists" }).status(401);
    else {
      const hashedPassword = await bcrypt.createHash(validatedValue.password);
      const newUserData = await usersModule.insertUser(
        validatedValue.firstname,
        validatedValue.lastname,
        validatedValue.email,
        hashedPassword,
        validatedValue.phone,
        validatedValue.profileImage,
        validatedValue.isAdmin
      );
      res.json({ status: "ok", msg: "user created" });
    }
  } catch (err) {
    console.log("error sign up: ", err);
    res.json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const validatedValue = await usersValidation.validateLoginSchema(req.body);
    console.log(validatedValue);
    const usersData = await usersModule.selectUserByEmail(validatedValue.email);
    console.log(usersData);
    if (usersData.length <= 0) {
      res.json({ message: "invalid email or password" }).status(401);
    }
    const hashRes = await bcrypt.cmpHash(
      validatedValue.password,
      usersData[0].password
    );
    if (!hashRes) {
      res.json({ message: "invalid email or password" }).status(401);
    }
    let token = await jwt.generateToken(
      {
        email: usersData[0].email,
        name: usersData[0].firstname,
        lastname: usersData[0].lastname,
        phone: usersData[0].phone,
        id: usersData[0].id,
        isAdmin: usersData[0].isAdmin,
        profileImage: usersData[0].profileImage,
      },
      "14d"
    );
    console.log(token);
    res.json(token).status(200);
  } catch (err) {
    res.json(err).status(401);
  }
});

router.post("/loginbytoken", async (req, res) => {
  try {
    if (req.body.token) {
      let dataFromToken = await jwt.verifyToken(req.body.token);
      console.log(dataFromToken);
      const usersData = await usersModule.selectUserByEmail(
        dataFromToken.email
      );
      if (usersData.length <= 0) {
        res.json({ message: "no user found" }).status(401);
      }
      res.status(200);
    } else {
      res.json({ message: "no token provided" }).status(401);
    }
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

router.post("/deleteuser/:id", adminMiddelaware, async (req, res) => {
  try {
    console.log(req.params.id);
    let deleted = await usersModule.deleteUserById(req.params.id);
    console.log(deleted);
    if (deleted) {
      res.json({ message: "deleted the user from DB" }).status(202);
    } else {
      res.json({ message: "user not found!" }).status(304);
    }
  } catch (err) {
    console.log(err);
    res.json(err).status(401);
  }
});

router.post("/forgotpassword", async (req, res) => {
  try {
    const validatedValue = await usersValidation.validateForgotPasswordSchema(
      req.body
    );
    const usersData = await usersModule.selectUserByEmail(validatedValue.email);
    if (usersData.length <= 0) {
      throw { status: "failed", msg: "invalid email or password" };
    }
    const token = await jwt.generateToken(
      { email: usersData[0].email, id: usersData[0]._id },
      "5m"
    );
    const link = `https://fake-amazon.onrender.com/resetpassword/${usersData[0]._id}/${token}`;
    const appLink = "https://fake-amazon.onrender.com/";

    let info = await transporter.sendMail({
      from: '"Fake Amazon" <zivgl66@zohomail.com>',
      to: validatedValue.email,
      subject: "recover password!",
      html: `
        <h4>Hello ${usersData[0].firstname},</h4>
        <h4>Your recovery link is <a href="${link}">here</a> , it will expire in 5 minutes.</h4>
        <h5><a style="color:orange;" href="${appLink}">Fake Amazon</a> </h5>
        
      `,
    });
    res.json({ message: "if email exists, message was sent" }).status(200);
  } catch (err) {
    console.log(err);
    res.json(err).status(401);
  }
});

router.get("/reset-password/:id/:token", async (req, res) => {
  try {
    const { id, token } = req.params;
    const usersData = await usersModule.selectUserById(id);
    if (!usersData) return res.json({ message: "user doesnt exist" });
    try {
      const verified = await jwt.verifyToken(token);
      res.status(200).json({ message: "Verified URL" });
    } catch (err) {
      res.status(500).json("Not verified URL");
    }
  } catch (err) {
    console.log(err);
    res.json(err).status(401);
  }
});

router.post("/reset-password/:id/:token", async (req, res) => {
  try {
    const { id, token } = req.params;
    const usersData = await usersModule.selectUserById(id);
    if (!usersData) return res.json({ message: "user doesnt exist" });
    try {
      const verified = await jwt.verifyToken(token);
      const hashedPassword = await bcrypt.createHash(req.body.password);
      await usersModule.updatePassword(verified.email, hashedPassword);
      res.json({ message: "password was updated" }).status(202);
    } catch (err) {
      console.log("verification error: ", err);
      res.send("The link has expired");
    }
  } catch (err) {
    console.log(err);
    res.json(err).status(401);
  }
});

router.post("/updateprofileimage", async (req, res) => {
  try {
    const usersData = await usersModule.selectUserByEmail(req.body.email);
    if (!usersData) return res.json({ message: "user doesnt exist" });
    await usersModule.updateProfileImage(req.body.email, req.body.imageURL);
    res.status(202).json({ message: "Profile picture was updated" });
  } catch (err) {
    console.log(err);
    res.json(err).status(401);
  }
});

module.exports = router;
