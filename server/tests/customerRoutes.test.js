const request = require("supertest");
const express = require("express");
const customerRoutes = require("../routes/customerRoutes");
const User = require("../models/user");
const TestRecord = require("../models/testRecord");
const TreatmentRecord = require("../models/treatmentschema"); // Adjust the path

// Mock the User model
jest.mock("../models/User");
jest.mock("../models/testRecord");
jest.mock("../models/treatmentschema");

const app = express();
app.use(express.json());
app.use("/auth", customerRoutes);

describe("Customer Routes", () => {
  // Test for GET /auth/handlecustomer
  describe("GET /auth/handlecustomer", () => {
    it("should return a list of customers", async () => {
      // Arrange: Mock the User.find method to return predefined users
      const mockUsers = [
        {
          _id: "1",
          username: "John Doe",
          email: "john@example.com",
          role: "user",
        },
        {
          _id: "2",
          username: "Jane Smith",
          email: "jane@example.com",
          role: "user",
        },
      ];
      User.find.mockResolvedValue(mockUsers);

      // Act: Make a GET request to /auth/handlecustomer
      const response = await request(app).get("/auth/handlecustomer");

      // Assert: Check if the response is as expected
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty("username", "John Doe");
      expect(response.body[1]).toHaveProperty("username", "Jane Smith");
    });

    it("should handle errors gracefully", async () => {
      // Arrange: Mock the User.find method to throw an error
      User.find.mockRejectedValue(new Error("Database error"));

      // Act: Make a GET request to /auth/handlecustomer
      const response = await request(app).get("/auth/handlecustomer");

      // Assert: Check if the response status and message are correct
      expect(response.statusCode).toBe(500);
      expect(response.body).toHaveProperty("message", "Failed to fetch users");
    });
  });

  // Test for DELETE /auth/deletenotification/:email
  describe("DELETE /auth/deletenotification/:email", () => {
    it("should delete a notification for a user", async () => {
      const userEmail = "john@example.com";
      const notificationContent = "Test Notification";

      // Arrange: Mock the User.findOne and user.save methods
      const mockUser = {
        email: userEmail,
        notification: [notificationContent],
        save: jest.fn().mockResolvedValue(true),
      };
      User.findOne.mockResolvedValue(mockUser);

      // Act: Make a DELETE request to /auth/deletenotification/:email
      const response = await request(app)
        .delete(`/auth/deletenotification/${userEmail}`)
        .send({ notificationContent });

      // Assert: Check if the response is as expected
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Notification deleted successfully"
      );
      expect(mockUser.notification).not.toContain(notificationContent);
    });

    it("should return 404 if the user is not found", async () => {
      const userEmail = "unknown@example.com";
      const notificationContent = "Test Notification";

      // Arrange: Mock User.findOne to return null
      User.findOne.mockResolvedValue(null);

      // Act: Make a DELETE request
      const response = await request(app)
        .delete(`/auth/deletenotification/${userEmail}`)
        .send({ notificationContent });

      // Assert: Check if the response is as expected
      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty("error", "User not found");
    });

    it("should return 500 on database error", async () => {
      const userEmail = "john@example.com";
      const notificationContent = "Test Notification";

      // Arrange: Mock User.findOne to throw an error
      User.findOne.mockRejectedValue(new Error("Database error"));

      // Act: Make a DELETE request
      const response = await request(app)
        .delete(`/auth/deletenotification/${userEmail}`)
        .send({ notificationContent });

      // Assert: Check if the response is as expected
      expect(response.statusCode).toBe(500);
      expect(response.body).toHaveProperty(
        "error",
        "Failed to delete notification"
      );
    });
  });

  // Test for DELETE /auth/handledeleteaccount/:email
  describe("DELETE /auth/handledeleteaccount/:email", () => {
    it("should delete a user account", async () => {
      const userEmail = "john@example.com";

      // Arrange: Mock User.findOneAndDelete to return a user
      const mockUser = { email: userEmail };
      User.findOneAndDelete.mockResolvedValue(mockUser);

      // Act: Make a DELETE request
      const response = await request(app).delete(
        `/auth/handledeleteaccount/${userEmail}`
      );

      // Assert: Check if the response is as expected
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockUser);
    });

    it("should return 404 if the user is not found", async () => {
      const userEmail = "unknown@example.com";

      // Arrange: Mock User.findOneAndDelete to return null
      User.findOneAndDelete.mockResolvedValue(null);

      // Act: Make a DELETE request
      const response = await request(app).delete(
        `/auth/handledeleteaccount/${userEmail}`
      );

      // Assert: Check if the response is as expected
      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty("message", "User not found");
    });

    it("should return 500 on database error", async () => {
      const userEmail = "john@example.com";

      // Arrange: Mock User.findOneAndDelete to throw an error
      User.findOneAndDelete.mockRejectedValue(new Error("Database error"));

      // Act: Make a DELETE request
      const response = await request(app).delete(
        `/auth/handledeleteaccount/${userEmail}`
      );

      // Assert: Check if the response is as expected
      expect(response.statusCode).toBe(500);
      expect(response.body).toHaveProperty("message", "Failed to delete user");
    });
  });

  describe("GET /auth/peaktestdates", () => {
    it("should return the top 5 peak test dates", async () => {
      const mockPeakTestDates = [
        { _id: "2023-10-01", count: 5 },
        { _id: "2023-09-25", count: 4 },
        { _id: "2023-08-15", count: 3 },
        { _id: "2023-07-10", count: 2 },
        { _id: "2023-06-30", count: 1 },
      ];

      // Mock the TestRecord.aggregate method
      TestRecord.aggregate.mockResolvedValue(mockPeakTestDates);

      const response = await request(app).get("/auth/peaktestdates");

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(5);
      expect(response.body[0]).toHaveProperty("_id", "2023-10-01");
      expect(response.body[0]).toHaveProperty("count", 5);
    });

    it("should return 404 if no peak test dates are found", async () => {
      // Mock the TestRecord.aggregate method to return an empty array
      TestRecord.aggregate.mockResolvedValue([]);

      const response = await request(app).get("/auth/peaktestdates");

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty(
        "message",
        "No peak test dates found."
      );
    });

    it("should handle errors gracefully", async () => {
      // Mock the TestRecord.aggregate method to throw an error
      TestRecord.aggregate.mockRejectedValue(new Error("Database error"));

      const response = await request(app).get("/auth/peaktestdates");

      expect(response.statusCode).toBe(500);
      expect(response.body).toHaveProperty("message", "Database error");
    });
  });

  describe("GET /auth/peaktreatmentdates", () => {
    it("should return the top 5 peak treatment dates", async () => {
      const mockPeakTreatmentDates = [
        { _id: "2023-10-01", count: 10 },
        { _id: "2023-09-25", count: 8 },
        { _id: "2023-08-15", count: 6 },
        { _id: "2023-07-10", count: 5 },
        { _id: "2023-06-30", count: 4 },
      ];

      // Mock the TreatmentRecord.aggregate method
      TreatmentRecord.aggregate.mockResolvedValue(mockPeakTreatmentDates);

      const response = await request(app).get("/auth/peaktreatmentdates");

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(5);
      expect(response.body[0]).toHaveProperty("_id", "2023-10-01");
      expect(response.body[0]).toHaveProperty("count", 10);
    });

    it("should return 404 if no peak treatment dates are found", async () => {
      // Mock the TreatmentRecord.aggregate method to return an empty array
      TreatmentRecord.aggregate.mockResolvedValue([]);

      const response = await request(app).get("/auth/peaktreatmentdates");

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty(
        "message",
        "No peak treatment dates found."
      );
    });

    it("should handle errors gracefully", async () => {
      // Mock the TreatmentRecord.aggregate method to throw an error
      TreatmentRecord.aggregate.mockRejectedValue(new Error("Database error"));

      const response = await request(app).get("/auth/peaktreatmentdates");

      expect(response.statusCode).toBe(500);
      expect(response.body).toHaveProperty("message", "Database error");
    });
  });
});
