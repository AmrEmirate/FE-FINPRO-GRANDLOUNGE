import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:2020/api",
  withCredentials: true, 
});

export default api;
