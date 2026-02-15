import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCartStore } from '../stores';
import Button from './button';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const rating = product.averageRating || 4.5;
  const reviewCount = product.reviewCount || 0;

  return (
    <Link
      to={`/products/${product._id}`}
      className="flex flex-col bg-surface rounded-lg overflow-hidden border border-border h-full hover:-translate-y-2 hover:shadow-lg hover:border-primary-light transition-all duration-250"
    >
      {/* Image */}
      <div className="relative w-full pt-[100%] overflow-hidden bg-background-alt">
        <img
          src={product.images?.[0] || '/placeholder.jpg'}
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-cover hover:scale-105 transition-transform duration-400"
        />
        
        {product.featured && (
          <span className="absolute top-4 right-4 px-3 py-1.5 bg-accent text-white text-xs font-semibold rounded uppercase tracking-wider">
            Featured
          </span>
        )}
        
        {product.stock && product.stock < 10 && product.stock > 0 && (
          <span className="absolute top-4 right-4 px-3 py-1.5 bg-warning text-white text-xs font-semibold rounded uppercase tracking-wider">
            Only {product.stock} left
          </span>
        )}
        
        {product.stock === 0 && (
          <span className="absolute top-4 right-4 px-3 py-1.5 bg-error text-white text-xs font-semibold rounded uppercase tracking-wider">
            Out of Stock
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col gap-2 flex-1">
        <div className="text-xs uppercase tracking-widest text-accent font-semibold">
          {product.category}
        </div>
        
        <h3 className="text-lg font-semibold text-text leading-tight mb-1">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-sm text-text-light leading-relaxed line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-2 mt-auto pt-2">
          <div className="flex gap-0.5 text-accent">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < Math.floor(rating) ? 'currentColor' : 'none'}
                className="text-accent"
              />
            ))}
          </div>
          <span className="text-sm text-text-light">({reviewCount})</span>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 mt-2 border-t border-border">
          <div className="flex flex-col gap-1">
            {product.comparePrice && (
              <span className="text-sm text-text-muted line-through">
                ${product.comparePrice.toFixed(2)}
              </span>
            )}
            <span className="text-2xl font-bold text-primary font-display">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <Button
            variant="primary"
            size="small"
            icon={<ShoppingCart size={16} />}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add'}
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;