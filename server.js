const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes");
const db = require("./connect");
process.env.NODE_END = "test";
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", routes);

db.connect().then(() => {
  app.listen(port, () => {
    console.log(`App is running on port: ${port}`);
  });
});
