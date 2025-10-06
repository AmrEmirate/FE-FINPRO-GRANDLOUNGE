import axios from 'axios';

const apiHelper = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://grand-lounge-api.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiHelper.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default apiHelper;