const express = require("express");
const testCtrl = require("./Controllers/testController");
const userCtrl = require("./Controllers/userController");
const tweetCtrl = require("./Controllers/tweetController");

// Initialize express-router
const router = express.Router();

// TEST
router.route("/test").get(testCtrl.getTest);
router.route("/test").post(testCtrl.postTest);

// USER
router.route("/user").get(userCtrl.getUser);
router.route("/signup").post(userCtrl.createUser);
router.route("/login").post(userCtrl.loginUser);
router.route("/update-password").post(userCtrl.updatePassword);

// TWEET
router.route("/tweets").get(tweetCtrl.getAllTweets);
router.route("/tweet").post(tweetCtrl.createTweet);
router.route("/update-tweet").post(tweetCtrl.updateTweet);
// LOGIN

module.exports = router;
