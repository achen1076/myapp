import axios from "axios";
import { ACCESS_TOKEN } from "./utils/constants.tsx";

const api = axios.create({
  //   baseURL: import.meta.env.API_URL,
  baseURL: "http://44.217.97.166:8000",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
