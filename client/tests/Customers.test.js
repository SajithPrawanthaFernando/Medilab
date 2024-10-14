import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import Customers from "../src/components/dashboard/adminDashboard/customers/Customers";
import "@testing-library/jest-dom";

// Mocking the axios module
jest.mock("axios");
// Mocking Swal for alerts
jest.mock("sweetalert2");

describe("Customers Component", () => {
  const users = [
    {
      _id: "1",
      username: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      updated: new Date().toISOString(),
      role: "user",
      filename: "profile1.jpg",
    },
    {
      _id: "2",
      username: "Jane Smith",
      email: "jane@example.com",
      phone: "0987654321",
      updated: new Date().toISOString(),
      role: "user",
      filename: "profile2.jpg",
    },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: users });
  });

  test("renders the component and fetches users", async () => {
    render(
      <MemoryRouter>
        <Customers />
      </MemoryRouter>
    );

    // Check if the title and subtitle are rendered
    expect(screen.getByText(/all customers/i)).toBeInTheDocument();
    expect(
      screen.getByText(/manage your hospital customers/i)
    ).toBeInTheDocument();

    // Wait for users to be fetched and rendered in the table
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });

  test("filters users based on search input", async () => {
    render(
      <MemoryRouter>
        <Customers />
      </MemoryRouter>
    );

    // Wait for users to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });

    // Simulate search input
    fireEvent.change(screen.getByPlaceholderText("Search by username"), {
      target: { value: "Jane" },
    });

    // Expect only Jane Smith to be visible
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.queryByText("John Doe")).toBeNull();
  });

  test("displays a message when no customers are found", async () => {
    axios.get.mockResolvedValueOnce({ data: [] }); // Simulating no customers

    render(
      <MemoryRouter>
        <Customers />
      </MemoryRouter>
    );

    // Wait for the message to be displayed
    await waitFor(() => {
      expect(screen.getByText(/no customers found/i)).toBeInTheDocument();
    });
  });
});
