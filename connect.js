const mongoose = require("mongoose");
require("dotenv").config();
const uri = process.env.ATLAS_URI;

function connect() {
  return new Promise((resolve, reject) => {
    // Check if this is for a test, if so, use the mock database
    if (process.env.NODE_ENV === "test") {
      const Mockgoose = require("mockgoose").Mockgoose;
      const mockgoose = new Mockgoose(mongoose);

      mockgoose.prepareStorage().then(() => {
        mongoose
          .connect(uri, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
          })
          .then((res, err) => {
            if (err) return reject(err);
            console.log("MockDB connection established successfully :)");
            resolve();
          });
      });
    } else {
      mongoose
        .connect(uri, {
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true,
        })
        .then((res, err) => {
          if (err) return reject(err);
          console.log("MongoDB connection established successfully :)");
          resolve();
        });
    }
  });
}

function close() {
  return mongoose.disconnect();
}

module.exports = { connect, close };
