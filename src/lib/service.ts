import axios from "axios";
// "https://quiz-back-production-54b3.up.railway.app"
const baseURL = "https://quiz-back-production-2e68.up.railway.app";
export const service = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

service.defaults.withCredentials = false;

service.interceptors.request.use(function (config) {
  const token = localStorage.getItem("accessToken");

  if (config.headers) {
    config.headers.Authorization = token ? `Bearer ${token}` : "";
  }
  return config;
});

export default service;
