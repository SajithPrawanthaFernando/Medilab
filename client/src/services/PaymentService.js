import axios from "axios";

class PaymentService {
  static instance = null;

  constructor() {
    if (PaymentService.instance) {
      throw new Error("Cannot instantiate singleton class, use getInstance()");
    }
  }

  static getInstance() {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  static baseURL = "http://localhost:5000";

  static getHeaders(token) {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async submitPayment(paymentData, token) {
    try {
      const response = await axios.post(
        "http://localhost:5000/payment/add-payment",
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        "Error submitting payment: " +
          (error.response ? error.response.data : error.message)
      );
    }
  }

  async fetchPayments(token) {
    try {
      const response = await axios.get(`${PaymentService.baseURL}/payment`, {
        headers: PaymentService.getHeaders(token),
      });
      return response.data;
    } catch (error) {
      throw new Error(
        "Error fetching payments: " +
          (error.response ? error.response.data : error.message)
      );
    }
  }

  async fetchUserByEmail(email, token) {
    try {
      const response = await axios.get(
        `${PaymentService.baseURL}/payment/customer/${email}`,
        {
          headers: PaymentService.getHeaders(token),
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        "Error fetching user data: " +
          (error.response ? error.response.data : error.message)
      );
    }
  }

  async updatePaymentStatusToApprove(paymentId, token) {
    try {
      const response = await axios.put(
        `${PaymentService.baseURL}/payment/approve/${paymentId}`,
        {},
        {
          headers: PaymentService.getHeaders(token),
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        "Error updating payment status to approved: " +
          (error.response ? error.response.data : error.message)
      );
    }
  }

  async updatePaymentStatusToReject(paymentId, token) {
    try {
      const response = await axios.put(
        `${PaymentService.baseURL}/payment/reject/${paymentId}`,
        {},
        {
          headers: PaymentService.getHeaders(token),
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        "Error updating payment status to rejected: " +
          (error.response ? error.response.data : error.message)
      );
    }
  }

  async fetchDoctorById(doctorId) {
    try {
      const response = await axios.get(
        `${PaymentService.baseURL}/payment/doctor/${doctorId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        "Error fetching doctor: " +
          (error.response ? error.response.data : error.message)
      );
    }
  }
}

export default PaymentService;
