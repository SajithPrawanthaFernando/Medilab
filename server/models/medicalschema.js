const mongoose = require("mongoose");

// Define a schema for Medical Records
const medicalRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true, // Added index
  }, // Link to the user
  treatmentHistory: [
    {
      treatmentDate: { type: Date, required: true },
      treatmentName: { type: Date, required: true },
      treatmentcondition: { type: Date, required: true },
      treatmentDescription: { type: String, required: true },
    },
  ],
  testResults: [
    {
      testDate: { type: Date, required: true },
      testName: { type: String, required: true },
      result: { type: String, required: true },
      testcondition: { type: Date, required: true },
    },
  ],
});

const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);

module.exports = MedicalRecord;
