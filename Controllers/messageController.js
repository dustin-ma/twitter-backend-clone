const mongoose = require("mongoose");
let Message = require("../models/messagemodel");
let Conversation = require("../models/conversationmodel");
let User = require("../models/usermodel");
const verify = require("./verifyToken");

module.exports = {
  // Create a new conversation //
  createConvo: async function (req, res) {
    const { senderId: sender_username, receiverId: receiver_username } =
      req.body;

    const sender = await User.findOne({
      username: sender_username,
    });
    const receiver = await User.findOne({
      username: receiver_username,
    });

    if (!sender_username || !receiver_username)
      return res.status(400).send("Sender and Receiver IDs are required");

    const newConvo = new Conversation({
      members: [sender._id, receiver._id],
    });

    newConvo
      .save()
      .then(() => res.status(201).json(newConvo))
      .catch((err) => res.status(400).send(err));
  },

  sendMessage: async function (req, res) {
    const { conversationId, senderId: sender_username, text } = req.body;
    if (!conversationId || !sender_username || !text)
      return res.status(400).send("Invalid Request");

    // find the User via username
    const sender = await User.findOne({
      username: sender_username,
    });
    if (!sender) return res.status(400).send("Invalid Sender");
    const senderId = sender._id;
    const newMessage = await new Message({
      conversationId,
      senderId,
      text,
    });

    newMessage
      .save()
      .then(() => res.status(201).json(newMessage))
      .catch((err) => res.status(400).send(err));
  },

  getConvo: async function (req, res) {
    try {
      const convo = await Conversation.find({
        members: { $in: [req.params.userId] },
      });
      res.status(200).json(convo);
    } catch (err) {
      res.status(400).send("Error " + err);
    }
  },

  getMessages: async function (req, res) {
    // if (verify)
    try {
      const messages = await Message.find({
        conversationId: { $in: [req.params.conversationId] },
      });
      res.status(200).json(messages);
    } catch (err) {
      res.status(400).send("Error " + err);
    }
  },
};
