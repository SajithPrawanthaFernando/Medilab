// models/Doctor.js
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  consultantFee: {
    type: Number,
    required: true,
  },
  visibilityStartDate: {
    type: Date,
    required: true,
  },
  visibilityEndDate: {
    type: Date,
    required: true,
  },
  visibilityStartTime: {
    type: String, // e.g., '09:00'
    required: true,
  },
  visibilityEndTime: {
    type: String, // e.g., '17:00'
    required: true,
  },
}, {
  timestamps: true, // Automatically create createdAt and updatedAt fields
});

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;



