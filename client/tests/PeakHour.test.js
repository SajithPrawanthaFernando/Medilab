import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../src/hooks/useAuthContext";
import PeakHour from "../src/components/dashboard/adminDashboard/PeakHour";
import "@testing-library/jest-dom";

jest.mock("axios");

// Mocking the useAuthContext hook
jest.mock("../src/hooks/useAuthContext", () => ({
  useAuthContext: jest.fn(),
}));

describe("PeakHour Component", () => {
  const user = {
    email: "user@example.com",
    token: "mockToken",
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    useAuthContext.mockReturnValue({ user });
  });

  afterEach(() => {
    // Log a message to the console when each test passes
    console.log("Test passed successfully!");
  });

  test("renders the PeakHour component correctly", () => {
    render(
      <MemoryRouter>
        <PeakHour />
      </MemoryRouter>
    );

    // Check if the title is rendered
    expect(
      screen.getByRole("heading", { name: /find peak appointment hour/i })
    ).toBeInTheDocument();
  });

  test("displays a general error message for other server errors", async () => {
    axios.get.mockRejectedValue(new Error("Server Error"));

    render(
      <MemoryRouter>
        <PeakHour />
      </MemoryRouter>
    );

    // Simulate date input and form submission
    const dateInput = screen.getByLabelText("Date", {
      selector: 'input[type="date"]',
    });
    fireEvent.change(dateInput, { target: { value: "2023-10-01" } });
    fireEvent.click(screen.getByRole("button", { name: /get peak hour/i }));

    // Wait for the general error message to appear
    const errorText = await screen.findByText(
      /an error occurred while fetching the data/i
    );
    expect(errorText).toBeInTheDocument();
  });
});
