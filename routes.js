const express = require("express");
const testCtrl = require("./Controllers/testController");
const userCtrl = require("./Controllers/userController");
const tweetCtrl = require("./Controllers/tweetController");
const messageCtrl = require("./Controllers/messageController");

// Initialize express-router
const router = express.Router();

// TEST
router.route("/test").get(testCtrl.getTest);
// //
router.route("/test").post(testCtrl.postTest);

// USER

router.route("/users").get(userCtrl.getUser);
// //
router.route("/register").post(userCtrl.createUser);
router.route("/login").post(userCtrl.loginUser);
router.route("/update-password").post(userCtrl.updatePassword);

// TWEET
router.route("/tweets").get(tweetCtrl.getAllTweets);
// //
router.route("/tweet").post(tweetCtrl.createTweet);
router.route("/update-tweet/:tweetId").post(tweetCtrl.updateTweet);
router.route("/comment-tweet/:tweetId").post(tweetCtrl.commentTweet);

// CHAT
router.route("/conversation/:userId").get(messageCtrl.getConvo);
router.route("/:conversationId").get(messageCtrl.getMessages);
// //
router.route("/message").post(messageCtrl.sendMessage);
router.route("/conversation").post(messageCtrl.createConvo);

module.exports = router;
