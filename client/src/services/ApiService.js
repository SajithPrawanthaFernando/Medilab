// client/src/services/ApiService.js
import axios from "axios";

class ApiService {
  constructor() {
    if (!ApiService.instance) {
      this.serverUrl =
        process.env.REACT_APP_SERVER_URL || "http://localhost:5000/auth";
      ApiService.instance = this;
    }

    return ApiService.instance;
  }

  // Method to set headers (assuming you need the token in the headers)
  setHeaders(token) {
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  }

  // Fetch peak appointment dates
  async fetchPeakAppointmentDates(token) {
    try {
      const response = await axios.get(
        `${this.serverUrl}/peakappointmentdates`,
        this.setHeaders(token)
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching peak appointment dates:", error);
      throw error;
    }
  }

  // Fetch doctor specialization count
  async fetchDoctorSpecializationCount(token) {
    try {
      const response = await axios.get(
        `${this.serverUrl}/specialization-count`,
        this.setHeaders(token)
      );
      return response.data.map((entry) => ({
        specialization: entry._id,
        count: entry.count,
      }));
    } catch (error) {
      console.error("Error fetching doctor specialization count:", error);
      throw error;
    }
  }
}

const instance = new ApiService();
Object.freeze(instance);

export default instance;
