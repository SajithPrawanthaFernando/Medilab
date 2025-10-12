const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const userrouter = require("./routes/customerRoutes");
const paymentrouter = require("./routes/paymentRoutes");
const appointmentRoutes = require("./routes/appointments");
const doctorRoutes = require("./routes/doctors");
const db = require("./databse");

dotenv.config();
const app = express();

// General rate limiter for all routes (primary ReDoS protection)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per window
  message: {
    error: "Too many requests from this IP, please try again after 15 minutes"
  },
  standardHeaders: true, 
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Rate limit exceeded",
      message: "Too many requests, please try again later."
    });
  }
});

// Stricter limiter for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    error: "Too many authentication attempts, please try again after 15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    error: "Too many payment requests, please try again after 15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(generalLimiter); // Apply to all routes globally

// ==================== EXISTING MIDDLEWARE ====================
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

app.use("/auth", authLimiter, userrouter); // Authentication routes
app.use("/api/stripe", paymentLimiter, StripeRoutes); // Payment routes
app.use("/payment", paymentLimiter, paymentrouter); // Payment routes

// Other routes use the general limiter only
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", doctorRoutes);


const startServer = async () => {
  try {
    await db.connect();
    console.log("MongoDB connection established successfully.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
startServer();