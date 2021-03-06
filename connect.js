const mongoose = require("mongoose");
require("dotenv").config();
const uri = process.env.ATLAS_URI;

function connect() {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      .then((res, err) => {
        if (err) return reject(err);
        console.log("MongoDB connection established successfully :)");
        resolve();
      });
  });
}

function mockConnect() {
  const Mockgoose = require("mockgoose").Mockgoose;
  const mockgoose = new Mockgoose(mongoose);
  return new Promise((resolve, reject) => {
    mockgoose.prepareStorage().then(() => {
      mongoose
        .connect(uri, {
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
        })
        .then((res, err) => {
          if (err) return reject(err);
          console.log("MockDB connection established successfully :)");
          resolve();
        });
    });
  });
}

function close() {
  return mongoose.disconnect();
}

module.exports = { connect, mockConnect, close };
