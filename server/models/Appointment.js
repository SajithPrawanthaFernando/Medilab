const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
  },
  doctorName: {
    type: String,
    ref: "Doctor",
  },
  userDetails: {
    name: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
  appointmentTime: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Cancelled"], // Specify valid status values
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
