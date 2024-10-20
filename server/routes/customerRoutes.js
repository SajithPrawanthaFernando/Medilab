const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const cookieParser = require("cookie-parser");
const { upload } = require("../middleware/uploadMiddleware.js");
const requireAuth = require("../middleware/requireAuth.js");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { fileURLToPath } = require("url");
const { dirname } = require("path");
const TestRecord = require("../models/testRecord");
const TreatmentRecord = require("../models/treatmentschema");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.KEY, { expiresIn: "90d" });
};

const router = express.Router();

router.get("/images/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join("D:/images", imageName); // Construct absolute path to the image
  // Check if the file exists
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).send("Image not found");
    } else {
      res.sendFile(imagePath);
    }
  });
});

router.post("/upload/:email", (req, res) => {
  upload.single("profileImage")(req, res, async (err) => {
    if (err) {
      // Multer error occurred
      console.error("Error uploading image:", err);
      return res
        .status(400)
        .json({ success: false, message: "Upload failed", error: err.message });
    }
    // No Multer error, handle file upload success
    try {
      const profileImage = req.file;
      console.log(profileImage.originalname);

      const user = await User.findOneAndUpdate(
        { email: req.params.email },
        { filename: profileImage.originalname },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Image uploaded successfully.",
        imagePath: profileImage.path,
        user: user,
      });
    } catch (error) {
      console.error("Error handling file upload:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "User is not registered" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.json({ message: "Password is incorrect" });
    }
    const token = jwt.sign({ username: user.username }, process.env.KEY, {
      expiresIn: "90d",
    });
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });

    return res.status(200).json({
      status: true,
      message: "Login successfully",
      email,
      token,
      role: user.role,
    });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/deletenotification/:email", async (req, res) => {
  const userEmail = req.params.email;
  const notificationContent = req.body.notificationContent;

  try {
    // Find the user by email
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove the notification from the notification array
    user.notification = user.notification.filter(
      (notification) => notification !== notificationContent
    );

    // Save the updated user document
    await user.save();

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Failed to delete notification:", error);
    res.status(500).json({ error: "Failed to delete notification" });
  }
});

router.delete("/handledeleteaccount/:email", (req, res) => {
  const email = req.params.email;
  User.findOneAndDelete({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    })
    .catch((err) =>
      res.status(500).json({ message: "Failed to delete user", error: err })
    );
});

router.post("/register", async (req, res) => {
  try {
    let { username, email, phone, password, role } = req.body;

    // Trim input fields to remove leading/trailing white spaces
    username = username.trim();
    email = email.trim();
    phone = phone.trim();
    password = password.trim();

    // Validate email format
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!username || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Set role based on email (if it starts with "print", assign admin role)
    if (email.toLowerCase().startsWith("print")) {
      role = "admin";
    } else {
      role = "user";
    }

    const hashpassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      phone,
      password: hashpassword,
      role: role, // Assigning role here
    });

    await newUser.save();
    const token = createToken(newUser._id); // Generating token after user creation
    console.log("Token:", token); // Logging the token
    return res.status(200).json({
      username,
      email,
      phone,
      role,
      token,
      message: "Record registered",
    });
  } catch (error) {
    console.error("Error in registration:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/forgotpassword", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "User not registered" });
    }
    const token = jwt.sign({ id: user._id }, process.env.KEY, {
      expiresIn: "5m",
    });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sajithprawanthafernando@gmail.com",
        pass: "jdnw qzvx hzxj sszp",
      },
    });
    const mailOptions = {
      from: "sajithprawanthafernando@gmail.com",
      to: email,
      subject: "Reset password",
      text: `http://localhost:3000/resetpassword/${token}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.json({ message: "Error sending email" });
      } else {
        console.log("Email sent:", info.response);
        return res.json({ status: true, message: "Email sent" });
      }
    });
  } catch (error) {
    console.error("Error in forgot password:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/resetpassword/:token", async (req, res) => {
  const token = req.params.token;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "password is required" });
  }

  try {
    const decoded = await jwt.verify(token, process.env.KEY);
    const id = decoded.id;
    const hashpassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate({ _id: id }, { password: hashpassword });
    return res.json({ status: true, message: "updated password" });
  } catch (err) {
    return res.json({ message: "invalid token" });
  }
});

router.get("/handlecustomer", async (req, res) => {
  try {
    const users = await User.find({});
    return res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.post("/sendfeedback/:email", async (req, res) => {
  const { notification } = req.body;

  if (!notification) {
    return res.status(400).json({ message: "notification is required" });
  }

  const email = req.params.email;

  try {
    // Find the user by email
    const user = await User.findOneAndUpdate(
      { email: email },
      { $push: { notification: notification } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Failed to update feedback:", error);
    res.status(500).json({ error: "Failed to update feedback" });
  }
});

// Get peak test record dates for all users
router.get("/peaktestdates", async (req, res) => {
  try {
    const peakTestDates = await TestRecord.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    if (peakTestDates.length === 0) {
      return res.status(404).json({ message: "No peak test dates found." });
    }

    res.json(peakTestDates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get peak treatment record dates for all users
router.get("/peaktreatmentdates", async (req, res) => {
  try {
    const peakTreatmentDates = await TreatmentRecord.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$beginDate" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    if (peakTreatmentDates.length === 0) {
      return res
        .status(404)
        .json({ message: "No peak treatment dates found." });
    }

    res.json(peakTreatmentDates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get peak appointment record dates for all users
router.get("/peakappointmentdates", async (req, res) => {
  try {
    const peakAppointmentDates = await Appointment.aggregate([
      {
        $group: {
          _id: "$appointmentDate", // Group by the appointmentDate field
          count: { $sum: 1 }, // Count the number of occurrences for each date
        },
      },
      {
        $sort: { count: -1 }, // Sort by count in descending order
      },
    ]);

    if (peakAppointmentDates.length === 0) {
      return res
        .status(404)
        .json({ message: "No peak appointment dates found." });
    }

    res.json(peakAppointmentDates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint to count doctors by specialization
router.get("/specialization-count", async (req, res) => {
  try {
    const specializationCount = await Doctor.aggregate([
      {
        $match: {
          specialization: { $ne: null, $exists: true }, // Only consider documents where specialization is defined
        },
      },
      {
        $group: {
          _id: "$specialization",
          count: { $sum: 1 },
        },
      },
    ]);

    // Check if there are any results and return accordingly
    if (specializationCount.length === 0) {
      return res.status(404).json({ message: "No specializations found." });
    }

    res.status(200).json(specializationCount);
  } catch (error) {
    console.error("Error fetching specialization count:", error.message); // Log the error for debugging
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Function to convert time string from 12-hour format to 24-hour format
const convertTo24HourFormat = (timeString) => {
  const [time, modifier] = timeString.split(" ");
  let [hours, minutes] = time.split(":");

  if (modifier === "PM" && hours !== "12") {
    hours = parseInt(hours, 10) + 12;
  } else if (modifier === "AM" && hours === "12") {
    hours = "00";
  }

  return `${hours}:${minutes}`;
};

// Endpoint to find peak hour of appointments on a selected day
router.get("/peak-hour/:date", async (req, res) => {
  const { date } = req.params; // Correctly access the 'date' parameter

  // Check if date query parameter is provided
  if (!date) {
    return res
      .status(400)
      .json({ message: "Date query parameter is required" });
  }

  try {
    // Aggregate to find the peak hour
    const peakHourData = await Appointment.aggregate([
      {
        // Match appointments for the specified date
        $match: {
          appointmentDate: {
            $gte: new Date(date + "T00:00:00.000Z"), // Start of the day
            $lt: new Date(date + "T23:59:59.999Z"), // End of the day
          },
        },
      },
      {
        // Group by hour extracted from the appointmentTime string (12-hour format)
        $group: {
          _id: {
            $cond: [
              { $regexMatch: { input: "$appointmentTime", regex: /PM$/ } },
              { $add: [{ $substr: ["$appointmentTime", 0, 2] }, 12] }, // Convert PM hour
              { $substr: ["$appointmentTime", 0, 2] }, // Use AM hour as is
            ],
          },
          count: { $sum: 1 }, // Count the number of appointments per hour
        },
      },
      {
        // Sort the results by count in descending order
        $sort: { count: -1 },
      },
      {
        // Limit the results to the top hour
        $limit: 1,
      },
    ]);

    // If no peak hour data found
    if (peakHourData.length === 0) {
      return res
        .status(404)
        .json({ message: "No appointments found for the selected date" });
    }

    // Respond with the peak hour data
    res.status(200).json(peakHourData);
  } catch (error) {
    console.error("Error fetching peak hour:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

router.use(requireAuth);

router.get("/customer", async (req, res) => {
  try {
    const users = await User.find({});
    return res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.get("/customer/:email", async (req, res) => {
  const userEmail = req.params.email; // Extract the email from request parameters

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

// Get user by ID
router.get("/customer/:id", async (req, res) => {
  const userId = req.params.id; // Extract the user ID from request parameters

  try {
    const user = await User.findById(userId); // Find the user by ID
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user); // Send user data as response
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
});

router.put("/users/:email", async (req, res) => {
  const userEmail = req.params.email;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail }, // Query condition to find the document by email
      {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone,
        // Update initial health data fields if provided in the request body
        "initialHealthData.height": req.body.initialHealthData?.height,
        "initialHealthData.weight": req.body.initialHealthData?.weight,
        "initialHealthData.bloodType": req.body.initialHealthData?.bloodType,
        "initialHealthData.allergies": req.body.initialHealthData?.allergies,
        "initialHealthData.medicalConditions":
          req.body.initialHealthData?.medicalConditions,
        "initialHealthData.medications":
          req.body.initialHealthData?.medications,
      },
      { new: true, useFindAndModify: false } // Set to true to return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser); // Send the updated user data as response
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user data" });
  }
});

router.delete("/deleteacc/:email", (req, res) => {
  const email = req.params.email;
  User.findOneAndDelete({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    })
    .catch((err) =>
      res.status(500).json({ message: "Failed to delete user", error: err })
    );
});

// Express Route for submitting user feedback
router.post("/feedbacks/:email", async (req, res) => {
  const { feedback } = req.body;

  if (!feedback) {
    return res.status(400).json({ message: "feedback is required" });
  }

  const email = req.params.email; // Use req.params to get the email parameter from the URL

  try {
    // Find the user by email
    const user = await User.findOneAndUpdate(
      { email: email }, // Filter by email
      { feedback: feedback, date: new Date() },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Failed to update feedback:", error);
    res.status(500).json({ error: "Failed to update feedback" });
  }
});

router.post("/changepassword/:email", async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const email = req.params.email;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the current password is correct
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password with the new hashed password
    user.password = hashedPassword;
    await user.save();

    // Send success response
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Failed to change password:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
});

router.post("/addrecord", async (req, res) => {
  try {
    const { userId, testType, testName, result, date, comments } = req.body;

    // Validate required fields
    if (!userId || !testType || !testName || !result || !comments) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create new TestRecord
    const newTestRecord = new TestRecord({
      userId,
      testType,
      testName,
      result,
      comments,
      date: date || Date.now(),
    });

    const savedRecord = await newTestRecord.save();

    res.status(201).json(savedRecord);
  } catch (error) {
    console.error("Error creating TestRecord:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

router.get("/getrecord/:userId", async (req, res) => {
  const { userId } = req.params; // Now this matches the route parameter

  try {
    const records = await TestRecord.find({ userId }); // Assuming you have a userId field in your TestRecord schema
    return res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching test records:", error);
    return res.status(500).json({ message: "Failed to fetch test records." });
  }
});

router.delete("/deleterecord/:id", async (req, res) => {
  try {
    const recordId = req.params.id;
    await TestRecord.findByIdAndDelete(recordId);
    res.status(200).json({ message: "Record deleted successfully." });
  } catch (err) {
    console.error("Error deleting record:", err);
    res.status(500).json({ message: "Server error." });
  }
});

router.put("/updaterecord/:id", async (req, res) => {
  try {
    const recordId = req.params.id;
    const updatedRecord = await TestRecord.findByIdAndUpdate(
      recordId,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedRecord);
  } catch (err) {
    console.error("Error updating record:", err);
    res.status(500).json({ message: "Server error." });
  }
});

router.post("/addtreatment", async (req, res) => {
  const {
    userId,
    doctorName,
    treatmentType,
    treatmentName,
    medicinePrescribed,
    beginDate,
    endDate,
    nextSession,
    currentStatus,
    frequency,
  } = req.body;

  try {
    const treatmentRecord = new TreatmentRecord({
      userId,
      doctorName,
      treatmentType,
      treatmentName,
      medicinePrescribed,
      beginDate,
      endDate,
      nextSession,
      currentStatus,

      frequency,
    });

    await treatmentRecord.save();
    res.status(201).json({ message: "Treatment record added successfully!" });
  } catch (error) {
    res.status(400).json({ message: "Error adding treatment record.", error });
  }
});

router.get("/gettreatment/:userId", async (req, res) => {
  try {
    const records = await TreatmentRecord.find({ userId: req.params.userId });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/updatetreatment/:id", async (req, res) => {
  try {
    const updatedRecord = await TreatmentRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedRecord)
      return res.status(404).json({ message: "Record not found" });
    res.json(updatedRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a treatment record
router.delete("/deletetreatment/:id", async (req, res) => {
  try {
    const deletedRecord = await TreatmentRecord.findByIdAndDelete(
      req.params.id
    );
    if (!deletedRecord)
      return res.status(404).json({ message: "Record not found" });
    res.json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get peak test record dates for all users
router.get("/peaktestdates", async (req, res) => {
  try {
    const peakTestDates = await TestRecord.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    if (peakTestDates.length === 0) {
      return res.status(404).json({ message: "No peak test dates found." });
    }

    res.json(peakTestDates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get peak treatment record dates for all users
router.get("/peaktreatmentdates", async (req, res) => {
  try {
    const peakTreatmentDates = await TreatmentRecord.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$beginDate" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    if (peakTreatmentDates.length === 0) {
      return res
        .status(404)
        .json({ message: "No peak treatment dates found." });
    }

    res.json(peakTreatmentDates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
