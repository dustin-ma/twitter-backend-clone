const mongoose = require("mongoose");
let Test = require("../models/testmodel");

module.exports = {
  getTest: async function (req, res) {
    Test.find()
      .then((tests) => res.status(201).json(tests))
      .catch((err) => res.status(400).send("Error: " + err));
  },
  postTest: async function (req, res) {
    const username = req.body.username;
    const description = req.body.description;
    const duration = Number(req.body.duration);
    const date = Date.parse(req.body.date);

    const newTest = new Test({
      username,
      description,
      duration,
      date,
    });

    await newTest
      .save()
      .then(() => res.status(201).send("Received a POST HTTP request."))
      .catch((err) => res.status(400).send("Error " + err));
  },
};
