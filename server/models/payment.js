const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    doctor: {
      // Changed to camelCase for consistency
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    appointmentDate: {
      type: String,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
    },
    consultantFee: {
      type: Number,
      required: true,
    },
    hospitalCharges: {
      // Changed to camelCase for consistency
      type: Number,
      required: true,
    },
    totalFee: {
      // Changed to camelCase for consistency
      type: Number,
      required: true,
    },
    paymentOption: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
    },
    paymentSlipFilename: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
