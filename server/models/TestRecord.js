const mongoose = require("mongoose");

const testRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  testType: {
    type: String,
    required: true,
  },
  testName: {
    type: String,
    required: true,
  },
  result: {
    type: String,
    required: true,
  },
  comments: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("TestRecord", testRecordSchema);
