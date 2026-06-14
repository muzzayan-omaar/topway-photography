import axios from "axios";

const api = axios.create({
  baseURL: "https://topway-backend.onrender.com",
});

export default api;