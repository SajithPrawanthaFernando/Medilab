// database.js
const mongoose = require("mongoose");

class Database {
  constructor() {
    if (!Database.instance) {
      this.connection = null; // Initialize connection as null
      Database.instance = this; // Create a singleton instance
    }
    return Database.instance; // Always return the singleton instance
  }

  async connect() {
    if (this.connection) {
      return this.connection; // Return existing connection
    }

    try {
      this.connection = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "HospitalManagement",
      });
      console.log("Database connected");
    } catch (error) {
      console.error("Database connection error:", error);
      throw error; // Re-throw error for handling in the calling context
    }

    Object.freeze(this);
    return this.connection; // Return the new connection
  }
}

// Create and export the singleton instance
const instance = new Database();
module.exports = instance; // Make sure to export the instance
