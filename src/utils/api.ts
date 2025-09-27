import axios from "axios";

const api = axios.create({
  baseURL: "https://be-finpro-grandlounge-e8h4.vercel.app/api",
  withCredentials: true, 
});

export default api;
