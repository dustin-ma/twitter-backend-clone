const mongoose = require("mongoose");

const convoSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model("Conversation", convoSchema);

module.exports = Conversation;
