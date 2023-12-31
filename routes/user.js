const express = require("express");
const router = express.Router();

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

const User = require("../models/User");

const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

// post : signup
router.post("/user/signup", fileUpload(), async (req, res) => {
  try {
    if (!req.body.username || !req.body.email || !req.body.password) {
      throw {
        status: 400,
        message: "Missing parameters",
      };
    }

    const password = req.body.password;
    const salt = uid2(32);
    const hash = SHA256(password + salt).toString(encBase64);
    const token = uid2(32);

    const foundUser = await User.findOne({ email: req.body.email });

    if (foundUser !== null) {
      throw { status: 409, message: "Email already used" };
    }

    const newUser = new User({
      email: req.body.email,
      account: {
        username: req.body.username,
        avatar: {},
      },
      token: token,
      hash: hash,
      salt: salt,
    });

    if (req.files) {
      if (req.files.avatar.mimetype.slice(0, 5) === "image") {
        console.log("inside");
        const fileUpload = convertToBase64(req.files.avatar);
        const uploadResult = await cloudinary.uploader.upload(fileUpload, {
          folder: `/marvel/users/${newUser._id}`,
          public_id: "profile",
        });
        newUser.account.avatar = uploadResult;
      } else throw { status: 400, message: "File must be an image type" };
    }

    const responseObjUser = {
      _id: newUser._id,
      token: newUser.token,
      account: {
        username: newUser.account.username,
        avatar: newUser.account.avatar,
      },
    };
    await newUser.save();
    res.status(201).json(responseObjUser);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
});

// post: login
router.post("/user/login", async (req, res) => {
  try {
    const registeredUser = await User.findOne({ email: req.body.email });
    if (registeredUser === null) {
      throw { status: 401, message: "Unauthorized" };
    }

    const singedHash = registeredUser.hash;
    const signeddSalt = registeredUser.salt;
    const newHash = SHA256(req.body.password + signeddSalt).toString(encBase64);

    if (newHash === singedHash) {
      const resUser = {
        _id: registeredUser._id,
        token: registeredUser.token,
        account: {
          username: registeredUser.account.username,
          avatar: registeredUser.account.avatar,
        },
      };
      res.status(200).json(resUser);
    } else res.status(401).json({ message: "Unauthorized" });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
});

module.exports = router;
