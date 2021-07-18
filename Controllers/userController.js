const mongoose = require("mongoose");
require("dotenv").config();
let User = require("../models/usermodel");
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
    const { username, password: plainTextPassword } = req.body;

    // validate data
    if (!username || typeof username !== "string" || username.length < 3)
      return res.status(400).send("Invalid Username");
    if (plainTextPassword.length < 8)
      return res.status(400).send("Password Too Short");

    const password = await bcrypt.hash(plainTextPassword, 15);

    const newUser = new User({
      username,
      password, // we do not store the plaintext password here
    });

    newUser
      .save()
      .then(() => res.status(201).send("User created successfully!"))
      .catch((err) => res.status(400).send("Error: " + err));
  },

  // ============================= LOGIN =============================

  loginUser: async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username })
      .lean()
      .catch((err) => res.status(400).send("Error: " + err));

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
      return res.json({ status: "ok", data: token });
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
        .catch((err) => res.status(400).send("Error: " + err));
    } else {
      return res.status(401).sned("Access Denied: Token missing or invalid");
    }
  },
};
