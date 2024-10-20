const express = require("express");
const Payment = require("../models/payment"); // Assuming you have a Payment model
const multer = require("multer");
const { upload } = require("../middleware/uploadMiddleware.js");
const User = require("../models/user.js");
const Doctor = require("../models/Doctor");
const path = require("path"); // Import path module
const fs = require("fs"); // Import filesystem module

const router = express.Router();

// Get all payments
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find(); // Corrected variable name to fetch Payment records
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments", error });
  }
});

// Add a new payment
router.post("/add-payment", upload.single("paymentSlip"), async (req, res) => {
  const {
    email,
    doctor,
    specialization,
    appointmentDate,
    appointmentTime,
    consultantFee,
    hospitalCharges,
    totalFee,
    paymentOption,
  } = req.body;

  const paymentSlip = req.file; // Access the uploaded file

  try {
    // Create a new payment record
    const newPaymentData = {
      email,
      doctor,
      specialization,
      appointmentDate,
      appointmentTime,
      consultantFee,
      hospitalCharges,
      totalFee,
      paymentOption,
    };

    // Add paymentSlipFilename only if paymentSlip exists
    if (paymentSlip) {
      newPaymentData.paymentSlipFilename = paymentSlip.originalname; // Save the file name if available
    }

    const newPayment = new Payment(newPaymentData);
    const savedPayment = await newPayment.save();
    res.status(201).json({ success: true, savedPayment });
  } catch (error) {
    console.error("Error saving payment:", error);
    res.status(500).json({ message: "Error saving payment", error });
  }
});

router.get("/customer/:email", async (req, res) => {
  const userEmail = req.params.email; // Extract the email from request parameters

  console.log("Email:", userEmail);

  try {
    const user = await User.findOne({ email: userEmail }); // Find the user by email
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user); // Send user data as response
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
});

// Update payment status
// Approve payment status
router.put("/approve/:id", async (req, res) => {
  const paymentId = req.params.id; // Extract payment ID from request parameters

  try {
    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      { status: "approved" }, // Set the status to approved
      { new: true } // Return the updated document
    );

    if (!updatedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({ success: true, updatedPayment });
  } catch (error) {
    console.error("Error approving payment status:", error);
    res.status(500).json({ message: "Error approving payment status", error });
  }
});

// Reject payment status
router.put("/reject/:id", async (req, res) => {
  const paymentId = req.params.id; // Extract payment ID from request parameters

  try {
    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      { status: "rejected" }, // Set the status to rejected
      { new: true } // Return the updated document
    );

    if (!updatedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({ success: true, updatedPayment });
  } catch (error) {
    console.error("Error rejecting payment status:", error);
    res.status(500).json({ message: "Error rejecting payment status", error });
  }
});

router.get("/images/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join("C:/images", imageName); // Construct absolute path to the image
  // Check if the file exists
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).send("Image not found");
    } else {
      res.sendFile(imagePath);
    }
  });
});

router.get("/doctor/:id", async (req, res) => {
  const { id } = req.params; // Get the doctor id from the route parameter

  try {
    const doctor = await Doctor.findById(id); // Use the mongoose `findById` method

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(doctor); // Send the doctor data in the response
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctor", error });
  }
});

module.exports = router;
