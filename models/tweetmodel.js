const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tweetSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    //array holds usernames that liked this tweet
    likes: {
      type: Array,
      required: false,
      default: [],
    },
    comments: {
      type: Array,
      required: false,
      default: [],
    },
    //if the tweet is a re-tweet
    reference: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Tweet = mongoose.model("Tweet", tweetSchema);

module.exports = Tweet;
