import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Product, CartItem } from '../types';

// Auth Store
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      setAuth: (user, token) => 
        set({ user, token, isAuthenticated: true }),
      
      clearAuth: () => 
        set({ user: null, token: null, isAuthenticated: false }),
      
      updateUser: (user) => 
        set({ user }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Cart Store
interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find(item => item.product._id === product._id);
        
        if (existingItem) {
          set({
            items: items.map(item =>
              item.product._id === product._id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ items: [...items, { product, quantity }] });
        }
      },
      
      removeItem: (productId) => {
        set({ items: get().items.filter(item => item.product._id !== productId) });
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map(item =>
            item.product._id === productId ? { ...item, quantity } : item
          ),
        });
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

// UI Store
interface UIState {
  isSidebarOpen: boolean;
  isCartOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  toggleCart: () => void;
  closeCart: () => void;
  openCart: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  isCartOpen: false,
  
  toggleSidebar: () => 
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  
  closeSidebar: () => 
    set({ isSidebarOpen: false }),
  
  toggleCart: () => 
    set((state) => ({ isCartOpen: !state.isCartOpen })),
  
  closeCart: () => 
    set({ isCartOpen: false }),
  
  openCart: () => 
    set({ isCartOpen: true }),
}));