// AppointmentService.js
class AppointmentService {
  static instance = null;

  constructor() {
    if (AppointmentService.instance) {
      return AppointmentService.instance;
    }
    AppointmentService.instance = this;
  }

  async fetchAppointments() {
    try {
      const response = await fetch("http://localhost:5000/api/appointments");
      if (!response.ok) throw new Error("Failed to fetch appointments");
      return await response.json();
    } catch (error) {
      console.error("Error fetching appointments:", error);
      throw error; // Rethrow to handle in the component
    }
  }

  async approveAppointment(id) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/appointments/${id}/approve`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) throw new Error("Failed to approve appointment");
      return response;
    } catch (error) {
      console.error("Error approving appointment:", error);
      throw error; // Rethrow to handle in the component
    }
  }

  async cancelAppointment(id, reason) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/appointments/${id}/cancel`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason }),
        }
      );
      if (!response.ok) throw new Error("Failed to cancel appointment");
      return response;
    } catch (error) {
      console.error("Error canceling appointment:", error);
      throw error; // Rethrow to handle in the component
    }
  }
}

const appointmentService = new AppointmentService();
export default appointmentService;
