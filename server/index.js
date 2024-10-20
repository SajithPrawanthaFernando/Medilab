const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userrouter = require("./routes/customerRoutes");
const paymentrouter = require("./routes/paymentRoutes");
const appointmentRoutes = require("./routes/appointments");
const doctorRoutes = require("./routes/doctors");
const db = require("./databse");

dotenv.config();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(cookieParser());

// Import routes
const StripeRoutes = require("./routes/stripe-route");

// Connect to MongoDB using the Singleton instance
const startServer = async () => {
  try {
    await db.connect(); // Use the Singleton instance to connect to the database
    console.log("MongoDB connection established successfully.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process if connection fails
  }

  // Set up routes
  app.use("/auth", userrouter);
  app.use("/api/stripe", StripeRoutes);
  app.use("/payment", paymentrouter);
  app.use("/api/appointments", appointmentRoutes);

  app.use("/api/doctors", doctorRoutes);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
startServer();
