const express = require("express");
const Payment = require("../models/payment");
const multer = require("multer");
const { upload } = require("../middleware/uploadMiddleware.js");
const User = require("../models/user.js");
const Doctor = require("../models/Doctor");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const isValidFilename = (filename) => {
  const validFilenameRegex = /^[a-zA-Z0-9._-]+\.(jpg|jpeg|png|gif|webp)$/i;
  
  return validFilenameRegex.test(filename) && 
         !filename.includes('..') && 
         !path.isAbsolute(filename);
};

router.get("/images/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  
  if (!isValidFilename(imageName)) {
    return res.status(400).json({ 
      error: "Invalid filename format",
      message: "Filename can only contain letters, numbers, hyphens, underscores, and common image extensions"
    });
  }
  
  const safeBaseDir = path.resolve("C:/images");
  const imagePath = path.join(safeBaseDir, imageName);
  
  if (!imagePath.startsWith(safeBaseDir)) {
    return res.status(400).json({ 
      error: "Invalid path",
      message: "Access denied" 
    });
  }
  
  fs.access(imagePath, fs.constants.F_OK | fs.constants.R_OK, (err) => {
    if (err) {
      console.warn(`Attempted to access non-existent file: ${imageName}`);
      return res.status(404).json({ 
        error: "Image not found",
        message: "The requested image does not exist or is not accessible"
      });
    }
    
    const ext = path.extname(imageName).toLowerCase();
    const contentTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };
    
    res.set('Content-Type', contentTypes[ext] || 'application/octet-stream');
    
    const fileStream = fs.createReadStream(imagePath);
    
    fileStream.on('error', (error) => {
      console.error('Error streaming file:', error);
      if (!res.headersSent) {
        res.status(500).json({ 
          error: "File read error",
          message: "Unable to read the requested file"
        });
      }
    });
    
    fileStream.pipe(res);
  });
});

// Get all payments
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find();
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

  const paymentSlip = req.file;

  try {
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

    if (paymentSlip) {
      newPaymentData.paymentSlipFilename = paymentSlip.originalname;
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
  const userEmail = req.params.email;

  console.log("Email:", userEmail);

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
});

// Update payment status
router.put("/approve/:id", async (req, res) => {
  const paymentId = req.params.id;

  try {
    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      { status: "approved" },
      { new: true }
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

router.put("/reject/:id", async (req, res) => {
  const paymentId = req.params.id;

  try {
    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      { status: "rejected" },
      { new: true }
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

router.get("/doctor/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctor", error });
  }
});

module.exports = router;