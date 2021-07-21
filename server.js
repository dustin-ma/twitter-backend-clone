const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes");
const db = require("./connect");
require("dotenv").config();

// set this to <test> for unit testing
process.env.NODE_ENV = "test";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", routes);

if (process.env.NODE_ENV === "test") {
  db.mockConnect().then(() => {
    app.listen(port, () => {
      console.log(`Mock Server is running on port: ${port}`);
    });
  });
} else {
  db.connect().then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  });
}
