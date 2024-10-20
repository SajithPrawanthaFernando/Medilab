import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BookingMessages from "../src/components/dashboard/customerDashboard/BookingCMessages";
import { useAuthContext } from "../src/hooks/useAuthContext";
import axios from "axios";
import "@testing-library/jest-dom";

jest.mock("../src/hooks/useAuthContext", () => ({
  useAuthContext: jest.fn(),
}));

jest.mock("axios");

describe("BookingMessages Component", () => {
  const user = {
    email: "user@example.com",
    token: "mockToken",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthContext.mockReturnValue({ user });
  });

  test("fetches and displays messages successfully", async () => {
    const messagesData = [
      {
        _id: "1",
        message: "Your appointment has been confirmed.",
        createdAt: new Date().toISOString(),
        isCanceled: false,
      },
    ];

    axios.get.mockResolvedValue({ data: messagesData });

    render(
      <MemoryRouter>
        <BookingMessages />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("Your appointment has been confirmed.")
      ).toBeInTheDocument();
      expect(screen.getByText("Active")).toBeInTheDocument();
    });
  });

  test("displays canceled messages correctly", async () => {
    const canceledMessage = [
      {
        _id: "1",
        message: "Your appointment has been canceled.",
        createdAt: new Date().toISOString(),
        isCanceled: true,
        cancellationReason: "User requested cancellation.",
      },
    ];

    axios.get.mockResolvedValue({ data: canceledMessage });

    render(
      <MemoryRouter>
        <BookingMessages />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("Your appointment has been canceled.")
      ).toBeInTheDocument();
      expect(screen.getByText("Canceled")).toBeInTheDocument();
      expect(
        screen.getByText("User requested cancellation.")
      ).toBeInTheDocument();
    });
  });
});
