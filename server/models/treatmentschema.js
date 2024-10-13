const mongoose = require("mongoose");

const treatmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctorName: {
    type: String,
    required: true,
  },
  treatmentType: {
    type: String,
    required: true,
  },
  treatmentName: {
    type: String,
    required: true,
  },
  medicinePrescribed: {
    type: String,
    required: true,
  },
  beginDate: {
    type: Date,
    default: Date.now,
  },
  nextSession: {
    type: Date,
  },
  currentStatus: {
    type: String,
    required: true,
  },
  progress: {
    type: Number,
  },
  endDate: {
    type: Date,
  },
  frequency: {
    type: String,
  },
});

module.exports = mongoose.model("TreatmentRecord", treatmentSchema);
