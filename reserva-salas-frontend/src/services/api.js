import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5243/api",
});
