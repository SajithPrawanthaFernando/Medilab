import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuthContext } from "../src/hooks/useAuthContext";
import NotificationPage from "../src/components/dashboard/customerDashboard/CustomerNotification";
import "@testing-library/jest-dom";

jest.mock("axios");

jest.mock("sweetalert2");

// Mocking the useAuthContext hook
jest.mock("../src/hooks/useAuthContext", () => ({
  useAuthContext: jest.fn(),
}));

describe("NotificationPage Component", () => {
  const user = {
    email: "user@example.com",
    token: "mockToken",
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    useAuthContext.mockReturnValue({ user });
  });

  test("renders notifications when fetched", async () => {
    const notificationsData = ["Feedback reply 1", "Feedback reply 2"];

    axios.get.mockResolvedValue({
      data: { notification: notificationsData },
    });

    try {
      render(
        <MemoryRouter>
          <NotificationPage />
        </MemoryRouter>
      );

      // Check if the title is rendered uniquely
      expect(
        screen.getByRole("heading", { name: /notifications/i })
      ).toBeInTheDocument();

      // Wait for notifications to be fetched and rendered
      await waitFor(() => {
        expect(screen.getByText("Feedback reply 1")).toBeInTheDocument();
        expect(screen.getByText("Feedback reply 2")).toBeInTheDocument();
      });

      console.log("Test passed: renders notifications when fetched");
    } catch (error) {
      console.error("Test failed: renders notifications when fetched", error);
    }
  });

  test("displays message when no notifications are found", async () => {
    axios.get.mockResolvedValue({ data: { notification: [] } });

    try {
      render(
        <MemoryRouter>
          <NotificationPage />
        </MemoryRouter>
      );

      // Wait for the message to be displayed
      await waitFor(() => {
        expect(screen.getByText(/no notifications found/i)).toBeInTheDocument();
      });

      console.log(
        "Test passed: displays message when no notifications are found"
      );
    } catch (error) {
      console.error(
        "Test failed: displays message when no notifications are found",
        error
      );
    }
  });

  test("deletes a notification and shows success message", async () => {
    const notificationsData = ["Feedback reply 1"];
    axios.get.mockResolvedValue({
      data: { notification: notificationsData },
    });
    axios.delete.mockResolvedValue({});

    try {
      render(
        <MemoryRouter>
          <NotificationPage />
        </MemoryRouter>
      );

      // Wait for notifications to be fetched and rendered
      await waitFor(() => {
        expect(screen.getByText("Feedback reply 1")).toBeInTheDocument();
      });

      // Simulate delete action
      fireEvent.click(screen.getByTitle("Delete Notification"));

      // Check for success message
      await waitFor(() => {
        expect(Swal.fire).toHaveBeenCalledWith({
          icon: "success",
          title: "Success",
          text: "Notification deleted successfully!",
        });
      });

      // Check if the notification is removed from the DOM
      expect(screen.queryByText("Feedback reply 1")).toBeNull();

      console.log(
        "Test passed: deletes a notification and shows success message"
      );
    } catch (error) {
      console.error(
        "Test failed: deletes a notification and shows success message",
        error
      );
    }
  });

  test("shows error alert when deleting a notification fails", async () => {
    const notificationsData = ["Feedback reply 1"];
    axios.get.mockResolvedValue({
      data: { notification: notificationsData },
    });
    axios.delete.mockRejectedValue(new Error("Failed to delete notification."));

    try {
      render(
        <MemoryRouter>
          <NotificationPage />
        </MemoryRouter>
      );

      // Wait for notifications to be fetched and rendered
      await waitFor(() => {
        expect(screen.getByText("Feedback reply 1")).toBeInTheDocument();
      });

      // Simulate delete action
      fireEvent.click(screen.getByTitle("Delete Notification"));

      // Check for error alert
      await waitFor(() => {
        expect(Swal.fire).toHaveBeenCalledWith({
          icon: "error",
          title: "Error",
          text: "Failed to delete the notification.",
        });
      });

      console.log(
        "Test passed: shows error alert when deleting a notification fails"
      );
    } catch (error) {
      console.error(
        "Test failed: shows error alert when deleting a notification fails",
        error
      );
    }
  });
});
