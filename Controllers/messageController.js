const mongoose = require("mongoose");
let Message = require("../models/messagemodel");
let Conversation = require("../models/conversationmodel");
const verify = require("./verifyToken");

module.exports = {
  // Create a new conversation //
  createConvo: async function (req, res) {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId)
      return res.status(400).send("Sender and Receiver IDs are required");

    const newConvo = new Conversation({
      members: [senderId, receiverId],
    });

    try {
      const savedConvo = await newConvo.save();
      return res.status(200).json(savedConvo);
    } catch (err) {
      res.status(400).send("Error " + err);
    }
  },

  sendMessage: async function (req, res) {
    const { conversationId, senderId, text } = req.body;
    if (!conversationId || !senderId || !text)
      return res.status(400).send("Invalid Request");
    const newMessage = new Message({
      conversationId,
      senderId,
      text,
    });
    // if (verify)
    try {
      const savedMessage = await newMessage.save();
      res.status(200).json(savedMessage);
    } catch (err) {
      res.status(400).send("Error " + err);
    }
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
