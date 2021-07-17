const mongoose = require("mongoose");
let User = require("../models/usermodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "AOVIJOVJ$@)*(U@)*$WEJIOWJV@)$*@J)$R"; // move this to .env after completion

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
    const { token, newpassword: plainTextPassword } = req.body;
    if (plainTextPassword.length < 8)
      return res.status(400).send("Password Too Short");

    const user = jwt.verify(token, JWT_SECRET);
    const _id = user.id;
    const password = await bcrypt.hash(plainTextPassword, 15);
    await User.updateOne(
      { _id },
      {
        $set: { password },
      }
    )
      .then(() =>
        res
          .status(201)
          .send("User " + { username } + " password updated successfully!")
      )
      .catch((err) => res.status(400).send("Error: " + err));
  },
};
