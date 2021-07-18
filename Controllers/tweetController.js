const mongoose = require("mongoose");
let Tweet = require("../models/tweetmodel");
const verify = require("./verifyToken");

module.exports = {
  // GET ALL TWEETS

  getAllTweets: async function (req, res) {
    Tweet.find()
      .then((tweets) => res.status(201).json(tweets))
      .catch((err) => res.status(400).send("Error: " + err));
  },

  // SEND TWEET

  createTweet: async (req, res) => {
    if (verify) {
      const { username, text } = req.body;
      if (!text) return res.status(400).send("Tweet cannot be empty!");

      const newTweet = new Tweet({
        username,
        text,
      });

      newTweet
        .save()
        .then(() => res.status(201).json(newTweet))
        .catch((err) => res.status(400).send("Error: " + err));
    } else {
      return res.status(401).send("Access Denied");
    }
  },

  // UPDATE TWEET

  updateTweet: async (req, res) => {
    if (verify) {
      const { username, text } = req.body;
      if (!text) return res.status(400).send("New tweet cannot be empty!");

      await Tweet.updateOne(
        { _id },
        {
          $set: { text },
        }
      )
        .then(() => res.status(201).send("Tweet updated successfully!"))
        .catch((err) => res.status(400).send("Error: " + err));
    } else {
      return res.status(401).send("Access Denied");
    }
  },
  // LIKE TWEET

  // COMMENT TWEET

  // DELETE TWEET
};
