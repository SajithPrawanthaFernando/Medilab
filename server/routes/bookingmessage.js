const express = require("express");
const router = express.Router();
const Appointment = require("../models/Bookingmessages");
const mongoose = require("mongoose");
router.post("/api/bookingmessages", async (req, res) => {
  const { userId, message } = req.body;
  try {
    const newMessage = new Message({ userId, message });
    await newMessage.save();
    res.status(201).send({ success: true, message: "Message sent!" });
  } catch (error) {
    console.error("Error sending message:", error);
    res
      .status(500)
      .send({ success: false, message: "Failed to send message." });
  }
});
