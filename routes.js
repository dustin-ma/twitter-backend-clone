const express = require("express");
const testCtrl = require("./Controllers/testController");
const userCtrl = require("./Controllers/userController");

// Initialize express-router
const router = express.Router();

// TEST
router.route("/test").get(testCtrl.getTest);
router.route("/test").post(testCtrl.postTest);

// USER
router.route("/user").get(userCtrl.getUser);
router.route("/user").post(userCtrl.postUser);

module.exports = router;
