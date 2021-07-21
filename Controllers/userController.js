const mongoose = require("mongoose");
require("dotenv").config();
let User = require("../models/usermodel");
let Tweet = require("../models/tweetmodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verify = require("./verifyToken");

const JWT_SECRET = process.env.JWT_SECRET_KEY; // move this to .env after completion

module.exports = {
  // responds with a list of all users in DB
  getUser: async function (req, res) {
    User.find()
      .then((users) => res.status(201).json(users))
      .catch((err) => res.status(400).send("Error: " + err));
  },

  // ============================= REGISTER =============================

  createUser: async function (req, res) {
    const { username, password } = req.body;

    // validate data
    if (!username || typeof username !== "string" || username.length < 3)
      return res.status(400).send("Invalid Username");
    if (password.length < 8) return res.status(400).send("Password Too Short");

    const password_hashed = await bcrypt.hash(password, 15);

    const newUser = new User({
      username,
      password: password_hashed, // we do not store the plaintext password here
    });

    newUser
      .save()
      .then(() => res.status(201).json(newUser))
      .catch((err) => res.status(400).send(err));

    /* THIS FORMAT DOESNT WORK AND I DON'T KNOW WHY
    try {
      const savedUser = await newUser
        .save()
        .then(() => res.status(201).json(savedUser));
    } catch (err) {
      res.status(400).send("Error " + err);
    }
    */
  },

  // ============================= LOGIN =============================

  loginUser: async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username })
      .lean()
      .catch((err) => res.status(400).send(err));

    /*
    if (!user) {
      return res.json({ status: "error", error: "Invalid username/password" });
    }
    */

    if (await bcrypt.compare(password, user.password)) {
      // the username, password combination is successful
      const token = jwt.sign(
        {
          id: user._id,
          username: user.username,
        },
        JWT_SECRET
      );
      return res.status(201).json({ status: "ok", data: token });
    }

    return res.status(400).send("Invalid password");
  },

  // ============================= UPDATE PASSWORD =============================

  updatePassword: async function (req, res) {
    //validate using the verify function to check the header
    if (verify) {
      const { username, newpassword: plainTextPassword } = req.body;
      if (plainTextPassword.length < 8)
        return res.status(400).send("Password Too Short");
      const _id = user.id;

      //take the new plaintext password and hash it before updating it for the user
      const password = await bcrypt.hash(plainTextPassword, 15);
      await User.updateOne(
        { _id },
        {
          $set: { password },
        }
      )
        .then(() => res.status(201).send("User password updated successfully!"))
        .catch((err) => res.status(400).send(err));
    } else {
      return res.status(401).send("Access Denied: Token missing or invalid");
    }
  },

  deleteUser: async (req, res) => {
    // check for JWT ownership by <if (verify)>
    // once verified then we can find the user via id and delete
    if (verify) {
      const user_id = req.params.userId;
      const removeUser = await User.findOneAndRemove({
        _id: user_id,
      })
        .then(() => res.status(201).send("User Removed"))
        .catch((err) => res.status(400).send(err));
    } else {
      return res.status(401).send("Access Denied: Token missing or invalid");
    }
  },
};
