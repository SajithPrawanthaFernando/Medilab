const mongoose = require("mongoose");

const bookingmessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model("Bookingmessage", bookingmessageSchema);
