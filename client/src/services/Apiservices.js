import axios from "axios";

class Apiservices {
  constructor() {
    if (!Apiservices.instance) {
      Apiservices.instance = this;
      this.serverUrl =
        process.env.REACT_APP_SERVER_URL || "http://localhost:5000";
    }

    return Apiservices.instance;
  }

  async fetchUsers() {
    try {
      const result = await axios.get(`${this.serverUrl}/auth/handlecustomer`);
      return result.data.filter((user) => user.role === "user");
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  }

  async fetchDoctors(user) {
    try {
      const result = await axios.get(`${this.serverUrl}/api/doctors`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(result.data);
      return result.data;
    } catch (error) {
      console.error("Error fetching doctors:", error);
      return [];
    }
  }

  async fetchAppointments(user) {
    try {
      const result = await axios.get(`${this.serverUrl}/api/appointments`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return result.data;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return [];
    }
  }

  async fetchFeedback() {
    try {
      const result = await axios.get(`${this.serverUrl}/auth/handlecustomer`);
      return result.data.filter(
        (user) => user.role === "user" && user.feedback
      );
    } catch (error) {
      console.error("Error fetching feedback:", error);
      return [];
    }
  }
}

const instance = new Apiservices();
Object.freeze(instance);

export default instance;
