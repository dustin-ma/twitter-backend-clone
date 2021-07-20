const mongoose = require("mongoose");
let Tweet = require("../models/tweetmodel");
const verify = require("./verifyToken");

module.exports = {
  // GET ALL TWEETS

  getAllTweets: async function (req, res) {
    Tweet.find()
      .then((tweets) => res.status(201).json(tweets))
      .catch((err) => res.status(400).send(err));
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
      .catch((err) => res.status(400).send(err));
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
      .catch((err) => res.status(400).send(err));
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

    if (!tweet) return res.status(400).send("The tweet does not exist");

    // save new comment as its own tweet
    const newComment = await new Tweet({
      username,
      text: comment,
    });

    // console.log(tweet);
    newComment.save().catch((err) => res.status(400).send("Error: " + err));

    // then store the tweet under 'comments' in parent tweet
    const currentComments = tweet.comments;
    tweet.comments = [...currentComments, newComment];
    await Tweet.findOneAndUpdate({ _id: tweet_id }, tweet, { new: true }).catch(
      (err) => res.status(400).send(err)
    );
    return res.status(201).json(tweet);
    /* } else {
      return res.status(401).send("Access Denied");
    } */
  },

  // RETWEET
  /*
      If the retweet api is called and it contains new text, then a new tweet
      shall be generated and the original tweet_id would be stored in the body
      of the new tweet under reference.
  */
  reTweet: async (req, res) => {
    // if (verify)
    const { username, text } = req.body;
    const reference = req.params.tweetId;
    const tweet = await Tweet.findOne({
      _id: reference,
    });
    if (!tweet) return res.status(400).send("The tweet does not exist");
    const newTweet = new Tweet({
      username,
      text,
      reference,
    });

    newTweet
      .save()
      .then(() => res.status(201).json(newTweet))
      .catch((err) => res.status(400).send(err));
  },
  // DELETE TWEET

  deleteTweet: async (req, res) => {
    // check for JWT ownership by <if (verify)>
    // once verified then we can find the tweet via id and delete
    const tweet_id = req.params.tweetId;
    const removeTweet = await Tweet.findOneAndDelete({
      _id: tweet_id,
    })
      .then(() => res.status(201).send("Tweet Removed"))
      .catch((err) => res.status(400).send(err));
  },
};
