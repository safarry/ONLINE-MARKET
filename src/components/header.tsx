import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useAuthStore, useCartStore, useUIStore } from '../stores';
import Button from './button';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const { getItemCount } = useCartStore();
  const { isSidebarOpen, toggleSidebar, toggleCart, closeSidebar } = useUIStore(); // Added closeSidebar action
  const [searchQuery, setSearchQuery] = useState('');

  const cartItemCount = getItemCount();

  const handleLogout = () => {
    clearAuth(); // Now handles token removal internally
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      // Optionally close mobile sidebar after search
      if (isSidebarOpen) closeSidebar();
    }
  };

  // Close mobile menu when a link is clicked
  const handleNavLinkClick = () => {
    if (isSidebarOpen) closeSidebar();
  };

  return (
    <header className="bg-surface sticky top-0 z-50 shadow-sm">
      {/* Top Bar (unchanged) */}
      <div className="bg-primary-dark text-white py-2">
        <div className="container">
          <div className="flex justify-between items-center text-sm">
            <p className="font-medium">Free shipping on orders over $50</p>
            <div className="hidden md:flex gap-6">
              <Link to="/help" className="opacity-90 hover:opacity-100 transition-opacity">
                Help
              </Link>
              <Link to="/contact" className="opacity-90 hover:opacity-100 transition-opacity">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="py-6">
        <div className="container">
          <div className="flex items-center gap-10">
            {/* Mobile Menu Toggle - with aria-label */}
            <button
              aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
              className="md:hidden p-2 text-text"
              onClick={toggleSidebar}
            >
              {isSidebarOpen ? <Icons.X size={24} /> : <Icons.Menu size={24} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 font-display text-2xl font-bold text-primary whitespace-nowrap">
              <span className="text-4xl text-accent" aria-hidden="true">◈</span>
              <span>Marketplace</span>
            </Link>

            {/* Desktop Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-background-alt text-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </form>

            {/* Actions */}
            <div className="flex items-center gap-6 ml-auto">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="hidden lg:flex items-center gap-2 p-2 text-text hover:text-primary transition-colors">
                    <Icons.User size={22} />
                    <span className="font-medium">{user?.firstName || 'User'}</span>
                  </Link>
                  <button
                    aria-label="Log out"
                    onClick={handleLogout}
                    className="hidden lg:flex p-2 text-text hover:text-primary transition-colors"
                  >
                    <Icons.LogOut size={22} />
                  </button>
                </>
              ) : (
                <Link to="/login">
                  <Button variant="ghost" size="small">
                    Sign In
                  </Button>
                </Link>
              )}

              <button
                aria-label="View cart"
                className="relative p-2 text-text hover:text-primary transition-colors"
                onClick={toggleCart}
              >
                <Icons.ShoppingCart size={22} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-semibold min-w-[20px] h-5 flex items-center justify-center rounded-full px-1">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <form onSubmit={handleSearch} className="md:hidden mt-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-background-alt text-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </form>

          {/* Mobile Menu Backdrop */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={closeSidebar}
              aria-hidden="true"
            />
          )}

          {/* Navigation */}
          <nav
            className={`
              fixed md:static top-0 left-0 h-screen md:h-auto w-72 md:w-auto
              bg-surface md:bg-transparent shadow-lg md:shadow-none
              flex flex-col md:flex-row gap-10 p-16 md:p-0
              mt-0 md:mt-6 pt-0 md:pt-6 border-t-0 md:border-t border-border
              transform md:transform-none transition-transform duration-250
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
              z-50 md:z-auto
            `}
          >
            <Link
              to="/products"
              onClick={handleNavLinkClick}
              className="md:text-sm font-medium text-text hover:text-primary transition-colors"
            >
              Products
            </Link>
            <Link
              to="/gallery"
              onClick={handleNavLinkClick}
              className="md:text-sm font-medium text-text hover:text-primary transition-colors"
            >
              Gallery
            </Link>
            {isAuthenticated && (
              <Link
                to="/create-product"
                onClick={handleNavLinkClick}
                className="md:text-sm font-medium text-text hover:text-primary transition-colors"
              >
                Sell
              </Link>
            )}
            <Link
              to="/products?category=electronics"
              onClick={handleNavLinkClick}
              className="md:text-sm font-medium text-text hover:text-primary transition-colors"
            >
              Electronics
            </Link>
            <Link
              to="/products?category=fashion"
              onClick={handleNavLinkClick}
              className="md:text-sm font-medium text-text hover:text-primary transition-colors"
            >
              Fashion
            </Link>
            <Link
              to="/products?category=books"
              onClick={handleNavLinkClick}
              className="md:text-sm font-medium text-text hover:text-primary transition-colors"
            >
              Books
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;