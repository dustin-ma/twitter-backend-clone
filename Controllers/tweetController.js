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
    //if (verify) {
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
    /*} else {
      return res.status(401).send("Access Denied");
    }*/
  },

  // UPDATE TWEET

  updateTweet: async (req, res) => {
    // if (verify)
    const { username, text } = req.body;
    const tweet_id = req.params.tweetId;
    if (!text) return res.status(400).send("New tweet cannot be empty!");

    await Tweet.updateOne(
      { _id: tweet_id },
      {
        $set: { text },
      }
    )
      .then(() => res.status(201).send("Tweet updated successfully!"))
      .catch((err) => res.status(400).send("Error: " + err));
    /*} else {
      return res.status(401).send("Access Denied");
    }*/
  },
  // LIKE TWEET

  likeTweet: async (req, res) => {
    if (verify) {
      // once verified the token, we extract the tweet object by its _id
      const tweet_id = req.params.id;
      const tweet = await Tweet.findOne({
        _id: tweet_id,
      });

      tweet.likes += 1;
      await Tweet.findOneAndUpdate({ _id: tweet_id }, tweet, { new: true });
      return res.status(201).send("Tweet Liked");
    } else {
      return res.status(401).send("Access Denied");
    }
  },

  // COMMENT TWEET
  commentTweet: async (req, res) => {
    // if (verify) {
    const { username, comment } = req.body;
    if (!comment) return res.status(400).send("Comment cannot be empty");
    const tweet_id = req.params.tweetId;
    const tweet = await Tweet.findOne({
      _id: tweet_id,
    });
    const currentComments = tweet.comments;
    tweet.comments = [...currentComments, comment];
    await Tweet.findOneAndUpdate({ _id: tweet_id }, tweet, { new: true }).catch(
      (err) => res.status(400).send("Error: " + err)
    );
    return res.status(201).send("Tweet Commented!");
    /* } else {
      return res.status(401).send("Access Denied");
    } */
  },
  // DELETE TWEET
};
