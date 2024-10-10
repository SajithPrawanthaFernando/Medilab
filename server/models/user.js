// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  firstname: { type: String },
  lastname: { type: String },
  address: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: Number, required: true, unique: true },
  password: { type: String, required: true },
  updated: { type: Date, default: Date.now },
  feedback: { type: String },
  notification: [{ type: String }],
  filename: { type: String },
  role: { type: String },
  initialHealthData: {
    height: { type: Number },
    weight: { type: Number },
    bloodType: { type: String },
    allergies: { type: String },
    medicalConditions: { type: String },
    medications: { type: String },
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User; // Ensure you are exporting the model correctly
