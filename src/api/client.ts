import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://talvo-api.vercel.app';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const data = error.response?.data as {
      message?: string;
      detail?: string;
      error?: string;
    } | undefined;

    if (status === 304) {
      // ✅ تجاهل 304 لأنه ليس خطأ حقيقي
      return Promise.resolve(error.response);
    }

    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى');
    } else if (status === 403) {
      toast.error('ليس لديك صلاحية للوصول إلى هذه الصفحة');
    } else if (status === 404) {
      toast.error('المورد غير موجود');
    } else if (status === 500) {
      toast.error('حدث خطأ في الخادم');
    } else if (data?.message) {
      toast.error(data.message);
    } else if (data?.detail) {
      toast.error(data.detail);
    } else if (data?.error) {
      toast.error(data.error);
    }

    return Promise.reject(error);
  }
);

export const api = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config).then((res) => res.data),

  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, data, config).then((res) => res.data),

  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, data, config).then((res) => res.data),

  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config).then((res) => res.data),
};