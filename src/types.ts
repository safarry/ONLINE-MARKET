export interface User {
  _id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images?: string[];
  category?: string;
  stock?: number;
  featured?: boolean;
  comparePrice?: number;
  averageRating?: number;
  reviewCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  total?: number;
}

export interface ProductFilters {
  featured?: boolean;
  limit?: number;
  skip?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

export interface Review {
  _id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

export interface CreateReviewData {
  rating: number;
  comment: string;
}

export interface Order {
  _id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: string;
}

export interface CreateOrderData {
  items: CartItem[];
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
