const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userrouter = require("./routes/customerRoutes");
const multer = require("multer");

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
app.use("/auth", userrouter);

// Import routes
const customerRoutes = require("./routes/customerRoutes");

// Stripe Routes
const StripeRoutes = require("./routes/stripe-route");

// Connect to MongoDB Atlas
const uri =
  "mongodb+srv://sajithprawanthafernando:mysecrettoken@weatherapi.vla2gns.mongodb.net/HospitalManagement";
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "HospitalManagement",
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/auth", userrouter);
// app.use('/customers', customerRoutes);

// Stripe Api
app.use("./api/stripe", StripeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
