import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import Payments from "../src/components/dashboard/customerDashboard/Payment";
import { useAuthContext } from "../src/hooks/useAuthContext";
import PaymentService from "../src/services/PaymentService";
import { MemoryRouter } from "react-router-dom";
import Swal from "sweetalert2";

jest.mock("../src/hooks/useAuthContext");
jest.mock("../src/services/PaymentService");
jest.mock("sweetalert2");

const mockAppointmentData = {
  doctorId: "670d368215b8e76c7d797797",
  appointmentDate: "2024-10-19",
  appointmentTime: "13:06",
  doctorName: "Dr. Jony Done",
};

describe("Payments Component", () => {
  let user;

  beforeEach(() => {
    user = { email: "rashmika1@gmail.com" };
    useAuthContext.mockReturnValue({ user });
    PaymentService.getInstance.mockReturnValue({
      fetchDoctorById: jest.fn().mockResolvedValue({
        name: "Dr. Jony Done",
        specialization: "Cardiologist",
        consultantFee: 200,
      }),
      submitPayment: jest.fn().mockResolvedValue({ success: true }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("handles form submission with cash payment option", async () => {
    render(
      <MemoryRouter
        initialEntries={[{ state: { appointmentData: mockAppointmentData } }]}
      >
        <Payments />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole("radio", { name: /Cash Payment at Center/i })
    );
    fireEvent.click(screen.getByText("Submit Payment"));

    await waitFor(() => {
      expect(PaymentService.getInstance().submitPayment).toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: "success",
        title: "Success",
        text: "Payment submitted successfully!",
      });
    });
  });

  test("shows error if payment slip is required but not provided", async () => {
    render(
      <MemoryRouter
        initialEntries={[{ state: { appointmentData: mockAppointmentData } }]}
      >
        <Payments />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole("radio", { name: /Upload Payment Slip/i })
    );
    fireEvent.click(screen.getByText("Submit Payment"));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: "error",
        title: "Error",
        text: "A payment slip is required for slip payments.",
      });
    });
  });

  test("handles form submission with card payment option", async () => {
    render(
      <MemoryRouter
        initialEntries={[{ state: { appointmentData: mockAppointmentData } }]}
      >
        <Payments />
      </MemoryRouter>
    );

    // Select 'Pay with Card' option
    fireEvent.click(screen.getByRole("radio", { name: /Pay with Card/i }));

    // Fill out the card details
    fireEvent.change(screen.getByPlaceholderText(/Card Number/i), {
      target: { value: "1234567890123456" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Card Holder Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/MM\/YY/i), {
      target: { value: "12/24" },
    });

    // Adjusting the placeholder for CVV if needed
    fireEvent.change(screen.getByPlaceholderText(/CVV/i), {
      target: { value: "123" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Submit Payment"));

    // Wait for the success message
    await waitFor(() => {
      expect(PaymentService.getInstance().submitPayment).toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: "success",
        title: "Success",
        text: "Payment submitted successfully!",
      });
    });
  });
});
