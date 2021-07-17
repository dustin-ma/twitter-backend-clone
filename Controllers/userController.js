const mongoose = require("mongoose");
let User = require("../models/usermodel");

module.exports = {
  getUser: async function (req, res) {
    User.find()
      .then((users) => res.status(201).json(users))
      .catch((err) => res.status(400).send("Error: " + err));
  },
  postUser: async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if (password.length < 8) return res.status(400).send("Password Too Short");

    const newUser = new User({
      username,
      password, // password here will remain unencrypted
    });

    newUser
      .save()
      .then(() => res.status(201).send("Received a POST HTTP request."))
      .catch((err) => res.status(400).send("Error: " + err));
  },
};
