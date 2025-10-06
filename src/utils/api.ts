import axios from "axios";

const api = axios.create({
  baseURL: "https://grand-lounge-api.vercel.app/api",
  withCredentials: true, 
});

export default api;
