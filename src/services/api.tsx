import axios, { type AxiosInstance, type AxiosError } from 'axios';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
  ProductsResponse,
  Product,
  ProductFilters,
  Review,
  CreateReviewData,
  Order,
  CreateOrderData,
  ApiResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: RegisterData) => 
    api.post<AuthResponse>('/auth/register', data),
  
  login: (data: LoginCredentials) => 
    api.post<AuthResponse>('/auth/login', data),
  
  logout: () => 
    api.post('/auth/logout'),
  
  getMe: () => 
    api.get<ApiResponse<User>>('/auth/me'),
  
  updateProfile: (data: Partial<User>) => 
    api.put<ApiResponse<User>>('/auth/profile', data),
};

// Products API
export const productsAPI = {
  getAll: (params?: ProductFilters) => 
    api.get<ProductsResponse>('/products', { params }),
  
  getById: (id: string) => 
    api.get<ApiResponse<Product>>(`/products/${id}`),
  
  create: (data: FormData) => 
    api.post<ApiResponse<Product>>('/products', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  update: (id: string, data: FormData | Partial<Product>) => 
    api.put<ApiResponse<Product>>(`/products/${id}`, data),
  
  delete: (id: string) => 
    api.delete(`/products/${id}`),
  
  search: (query: string) => 
    api.get<ProductsResponse>('/products/search', { params: { q: query } }),
};

// Reviews API
export const reviewsAPI = {
  getByProduct: (productId: string) => 
    api.get<ApiResponse<Review[]>>(`/products/${productId}/reviews`),
  
  create: (productId: string, data: CreateReviewData) => 
    api.post<ApiResponse<Review>>(`/products/${productId}/reviews`, data),
  
  update: (reviewId: string, data: Partial<CreateReviewData>) => 
    api.put<ApiResponse<Review>>(`/reviews/${reviewId}`, data),
  
  delete: (reviewId: string) => 
    api.delete(`/reviews/${reviewId}`),
};

// Orders API
export const ordersAPI = {
  getAll: () => 
    api.get<ApiResponse<Order[]>>('/orders'),
  
  getById: (id: string) => 
    api.get<ApiResponse<Order>>(`/orders/${id}`),
  
  create: (data: CreateOrderData) => 
    api.post<ApiResponse<Order>>('/orders', data),
  
  updateStatus: (id: string, status: Order['status']) => 
    api.put<ApiResponse<Order>>(`/orders/${id}/status`, { status }),
};

export default api;