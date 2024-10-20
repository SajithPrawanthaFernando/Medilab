// client/src/utils/axiosInstance.js
import axios from "axios";

let instance = null;

const getAxiosInstance = () => {
  if (!instance) {
    instance = axios.create({
      baseURL: process.env.REACT_APP_SERVER_URL || "http://localhost:5000",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  return instance;
};

export default getAxiosInstance;
