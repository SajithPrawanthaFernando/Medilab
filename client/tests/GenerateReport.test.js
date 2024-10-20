import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import { useAuthContext } from "../src/hooks/useAuthContext.js";
import GenerateReport from "../src/components/dashboard/adminDashboard/GenerateReport.js"; // Adjust import path as necessary
import "@testing-library/jest-dom";

jest.mock("axios");
jest.mock("../src/hooks/useAuthContext.js");

describe("GenerateReport Component", () => {
  const user = {
    email: "user@example.com",
    token: "mockToken",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthContext.mockReturnValue({ user });
  });

  test("renders loading state initially", () => {
    render(
      <MemoryRouter>
        <GenerateReport />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    console.log("Test passed: Loading state rendered successfully.");
  });

  test("displays message when no peak test dates are found", async () => {
    axios.get
      .mockResolvedValueOnce({ data: [] }) // Mock response for peak test dates
      .mockResolvedValueOnce({ data: [] }); // Mock response for peak treatment dates

    render(
      <MemoryRouter>
        <GenerateReport />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    );

    // Check for no peak test dates found message
    expect(screen.getByText(/no peak test dates found/i)).toBeInTheDocument();

    // Check for no peak treatment dates found message
    expect(
      screen.getByText(/no peak treatment dates found/i)
    ).toBeInTheDocument();

    console.log(
      "Test passed: No peak test and treatment dates found message displayed successfully."
    );
  });

  test("displays an error message when fetching peak test dates fails", async () => {
    axios.get.mockRejectedValueOnce(
      new Error("Failed to fetch peak test dates")
    );

    render(
      <MemoryRouter>
        <GenerateReport />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    );

    // Check for error message (assuming you handle error displaying in your component)
    expect(
      screen.getByText(/error fetching peak test dates/i)
    ).toBeInTheDocument();

    console.log(
      "Test passed: Error message displayed successfully when fetching peak test dates fails."
    );
  });
});
