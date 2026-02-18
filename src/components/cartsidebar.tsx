import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useCartStore,useUIStore  } from '../stores';
import Button from './button';
import type { CartItem } from '../types';
// import { useUIStore } from '../stores';
const CartSidebar: React.FC = () => {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const { isCartOpen, closeCart } = useUIStore();

  const total = getTotal();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[998] animate-fade-in"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 right-0 w-full max-w-[450px] h-screen
          bg-surface shadow-lg z-[999]
          flex flex-col
          transform transition-transform duration-250
          ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-2xl font-bold">Shopping Cart</h2>
            <button
            onClick={closeCart}
            className="p-2 text-text hover:text-primary transition-colors"
          >
            <Icons.X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 p-10 text-center">
              <p className="text-lg text-text-light">Your cart is empty</p>
              <Link to="/products" onClick={closeCart}>
                <Button>Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Items */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                {items.map((item: CartItem) => {
                  const { product, quantity } = item;
                  return (
                    <div
                      key={product._id}
                      className="flex gap-4 p-4 bg-background-alt rounded-lg relative"
                    >
                    <img
                      src={product.images?.[0] || '/placeholder.jpg'}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded flex-shrink-0"
                    />
                    
                    <div className="flex-1 flex flex-col gap-1">
                      <h3 className="text-[15px] font-semibold text-text leading-tight">
                        {product.name}
                      </h3>
                      <p className="text-base font-semibold text-primary mt-auto">
                        ${product.price.toFixed(2)}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(product._id, quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center bg-surface border border-border rounded hover:bg-primary hover:border-primary hover:text-white transition-all"
                        >
                          <Icons.Minus size={16} />
                        </button>
                        <span className="min-w-[30px] text-center font-semibold">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product._id, quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center bg-surface border border-border rounded hover:bg-primary hover:border-primary hover:text-white transition-all"
                        >
                          <Icons.Plus size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => removeItem(product._id)}
                      className="absolute top-4 right-4 p-1 text-text-light hover:text-error transition-colors"
                    >
                      <Icons.Trash2 size={18} />
                    </button>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border bg-background-alt flex flex-col gap-4">
                <div className="flex justify-between items-center text-lg font-semibold mb-2">
                  <span>Subtotal:</span>
                  <span className="text-3xl text-primary font-display">
                    ${total.toFixed(2)}
                  </span>
                </div>
                
                <Link to="/checkout" onClick={closeCart}>
                  <Button fullWidth>Proceed to Checkout</Button>
                </Link>
                
                <button
                  onClick={clearCart}
                  className="w-full p-3 text-error font-medium text-center hover:bg-error/10 rounded-lg transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;