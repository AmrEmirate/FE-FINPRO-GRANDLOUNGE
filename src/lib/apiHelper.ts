import axios from 'axios';

const apiHelper = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:2020/api',
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

export const createMidtransTransaction = async (invoiceNumber: string) => {
  try {
    const fullUrl = apiHelper.defaults.baseURL + '/payment-gateway/create-transaction'; // <-- Tambahkan ini
    console.log("Mencoba mengirim request ke:", fullUrl);
    const response = await apiHelper.post(
      '/payment-gateway/create-transaction',
      { invoiceNumber }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Gagal membuat transaksi pembayaran.');
    }
    throw new Error('Terjadi kesalahan yang tidak terduga.');
  }
}

export default apiHelper;