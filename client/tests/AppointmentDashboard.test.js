import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppointmentDashboard from "../src/components/dashboard/adminDashboard/doctor/AppoinmentDashboard";
import { useAuthContext } from "../src/hooks/useAuthContext";
import "@testing-library/jest-dom";
import axios from "axios";

jest.mock("../src/hooks/useAuthContext", () => ({
  useAuthContext: jest.fn(),
}));

jest.mock("axios");

describe("AppointmentDashboard Component", () => {
  const user = {
    email: "user@example.com",
    token: "mockToken",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthContext.mockReturnValue({ user });
    jest.spyOn(window, "alert").mockImplementation(() => {}); // Mock alert
  });

  test("renders the component and displays the table headers correctly", () => {
    render(
      <MemoryRouter>
        <AppointmentDashboard />
      </MemoryRouter>
    );

    // Verify that the table headers are rendered
    expect(screen.getByText(/User Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Doctor Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Appointment Date/i)).toBeInTheDocument();
    expect(screen.getByText(/Appointment Time/i)).toBeInTheDocument();
  });

  test("fetches and displays appointments correctly", async () => {
    const appointmentsData = [
      {
        _id: "1",
        userDetails: { name: "John Doe" },
        doctorName: "Dr. Smith",
        appointmentDate: "2024-10-20",
        appointmentTime: "10:00 AM",
        status: "Pending",
      },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(appointmentsData),
      })
    );

    render(
      <MemoryRouter>
        <AppointmentDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Dr. Smith")).toBeInTheDocument();
      expect(screen.getByText("2024-10-20")).toBeInTheDocument();
      expect(screen.getByText("10:00 AM")).toBeInTheDocument();
    });
  });

  test("displays an error message if fetching appointments fails", async () => {
    // Mock the fetch to reject with an error
    global.fetch = jest.fn(() =>
      Promise.reject(new Error("Failed to fetch appointments"))
    );

    render(
      <MemoryRouter>
        <AppointmentDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Check if the alert was called with the correct message
      expect(window.alert).toHaveBeenCalledWith("Error fetching appointments:");
    });
  });
});
