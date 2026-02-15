import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// removed react-hot-toast Toaster (not installed)
import { useAuthStore } from './stores';

// Components
import Header from './components/header';
import CartSidebar from './components/cartsidebar';

// Pages
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import Products from './pages/product';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="app min-h-screen flex flex-col">
        <Header />
        <CartSidebar />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
            <Route
              path="/products/:id"
              element={
                <div className="container py-16 text-center">
                  <h1 className="text-3xl font-display">Product Detail (Coming Soon)</h1>
                </div>
              }
            />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div className="container py-16 text-center">
                    <h1 className="text-3xl font-display">Dashboard (Coming Soon)</h1>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <div className="container py-16 text-center">
                    <h1 className="text-3xl font-display">Checkout (Coming Soon)</h1>
                  </div>
                </ProtectedRoute>
              }
            />
            
            {/* 404 */}
            <Route
              path="*"
              element={
                <div className="container py-16 text-center">
                  <h1 className="text-4xl font-display mb-4">404 - Page Not Found</h1>
                  <p className="text-text-light">The page you're looking for doesn't exist.</p>
                </div>
              }
            />
          </Routes>
        </main>

        <footer className="bg-surface border-t border-border py-6 mt-auto">
          <div className="container text-center text-text-light">
            <p>&copy; {new Date().getFullYear()} Marketplace. All rights reserved.</p>
          </div>
        </footer>

        {/* Toaster removed (react-hot-toast not installed) */}
      </div>
    </Router>
  );
};

export default App;