import axios from "axios";

const api = axios.create({
  baseURL: "https://be-finpro-grandlounge.vercel.app/api",
  withCredentials: true, 
});

export default api;
