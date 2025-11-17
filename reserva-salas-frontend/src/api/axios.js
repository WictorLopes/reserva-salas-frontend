import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5243/api",
});

export default api;
