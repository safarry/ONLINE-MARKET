import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { productsAPI } from '../services/api';
import Button from '../components/button';
import { useCartStore } from '../stores';
import type { Product, ProductFilters } from '../types';

// Dynamic import of product images
const imageModules = import.meta.glob<{ default: string }>(
  '../assets/ass*.jpg',
  { eager: true }
) as Record<string, { default: string }>;

const productImages = Object.values(imageModules).map(module => module.default);

const Products: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const { addItem } = useCartStore();
  const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set());
  
  const [filters, setFilters] = useState<ProductFilters>({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: undefined,
    maxPrice: undefined,
    sort: 'newest',
  });

  // Image resolution function
  const getRandomProductImage = (productId: string): string => {
    // Use product ID hash to consistently select same image for same product
    const hash = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const imageIndex = hash % productImages.length;
    return productImages[imageIndex];
  };

  const resolveImage = (product: Product): string => {
    if (product.images && product.images.length > 0) {
      const img = product.images[0];
      if (img && typeof img === 'string') {
        if (img.startsWith('http')) {
          return img;
        }
        return `http://localhost:5000/uploads/${img}`;
      }
    }
    // Use random asset image based on product ID
    return getRandomProductImage(product._id);
  };

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
    setAddedToCart(prev => new Set([...prev, product._id]));
    setTimeout(() => {
      setAddedToCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(product._id);
        return newSet;
      });
    }, 2000);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        category: filters.category || undefined,
        search: filters.search || undefined,
      };
      
      const response = await productsAPI.getAll(params);
     setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = (key: keyof ProductFilters, value: string | number | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      search: '',
      minPrice: undefined,
      maxPrice: undefined,
      sort: 'newest',
    });
  };

  const categories = [
    'All Categories',
    'Electronics',
    'Fashion',
    'Home & Living',
    'Beauty',
    'Sports',
    'Books',
  ];

  return (
    <div className="min-h-[calc(100vh-200px)] py-16 bg-background-alt">
      <div className="container">
        {/* Header */}
        <div className="flex justify-between items-center mb-10 pb-6 border-b-2 border-border">
          <div>
            <h1 className="font-display text-4xl lg:text-5xl capitalize">
              {filters.category || 'All Products'}
            </h1>
            <p className="text-text-light mt-2">
              {loading ? 'Loading...' : `${products.length} products found`}
            </p>
          </div>
          
          <Button
            variant="outline"
            icon={<Icons.SlidersHorizontal size={18} />}
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            Filters
          </Button>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-16">
          {/* Filters Sidebar */}
          <aside
            className={`
              lg:block bg-surface rounded-lg p-6  lg:sticky lg:top-32
              fixed  top-0 left-0 w-80 max-w-[90vw] h-screen lg:h-auto
              z-50 lg:z-0 overflow-y-auto lg:overflow-visible
              shadow-lg lg:shadow-none
              transform lg:transform-none transition-transform duration-250
              ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            <div className="flex justify-between items-center pb-6 border-b border-border">
              <h3 className="flex items-center gap-2 text-xl font-semibold">
                <Icons.Filter size={18} />
                Filters
              </h3>
              <button
                onClick={clearFilters}
                className="text-sm text-primary font-medium hover:text-primary-dark transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* Category Filter */}
            <div className="py-6 border-b border-border">
              <h4 className="text-[15px] font-semibold mb-4">Category</h4>
              <div className="flex flex-col gap-2">
                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-2 p-2 rounded hover:bg-background-alt cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="category"
                      value={category === 'All Categories' ? '' : category.toLowerCase()}
                      checked={
                        category === 'All Categories'
                          ? !filters.category
                          : filters.category === category.toLowerCase()
                      }
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="cursor-pointer"
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="py-6 border-b border-border">
              <h4 className="text-[15px] font-semibold mb-4">Price Range</h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                  className="flex-1 px-2.5 py-2 border-2 border-border rounded text-sm transition-colors focus:border-primary focus:outline-none"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                  className="flex-1 px-2.5 py-2 border-2 border-border rounded text-sm transition-colors focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Sort Filter */}
            <div className="pt-6">
              <h4 className="text-[15px] font-semibold mb-4">Sort By</h4>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full px-3 py-3 border-2 border-border rounded-lg text-[15px] bg-surface cursor-pointer transition-colors focus:border-primary focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-6 py-16 text-text-light">
                <div className="w-12 h-12 border-3 border-border border-t-primary rounded-full animate-spin" />
                <p>Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-6 py-16 text-center text-text-light">
                <p className="text-xl">No products found</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-surface rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
                  >
                    {/* Image Container */}
                    <div className="relative w-full bg-background-alt overflow-hidden h-64 flex items-center justify-center">
                      <img
                        src={resolveImage(product)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.featured && (
                        <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Featured
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="font-semibold text-lg line-clamp-2 text-text mb-2">
                        {product.name}
                      </h3>

                      {/* Category & Rating */}
                      <div className="flex items-center justify-between mb-3 text-sm text-text-light">
                        <span className="capitalize text-xs bg-background-alt px-2 py-1 rounded">
                          {product.category || 'General'}
                        </span>
                        {product.averageRating && (
                          <div className="flex items-center gap-1">
                            <Icons.Star size={14} className="fill-yellow-400 text-yellow-400" />
                            <span>{product.averageRating.toFixed(1)}</span>
                            {product.reviewCount && (
                              <span>({product.reviewCount})</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      {product.description && (
                        <p className="text-sm text-text-light mb-4 line-clamp-2 flex-grow">
                          {product.description}
                        </p>
                      )}

                      {/* Price Section */}
                      <div className="mb-4 pt-2 border-t border-border">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-2xl font-bold text-primary">
                            ${product.price.toFixed(2)}
                          </span>
                          {product.comparePrice && product.comparePrice > product.price && (
                            <span className="text-sm text-text-light line-through">
                              ${product.comparePrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        {product.stock !== undefined && (
                          <span className={`text-xs ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-auto pt-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock === 0}
                          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                            addedToCart.has(product._id)
                              ? 'bg-green-600 text-white'
                              : product.stock === 0
                              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                              : 'bg-primary text-white hover:bg-primary-dark active:scale-95'
                          }`}
                        >
                          {addedToCart.has(product._id) ? (
                            <>
                              <Icons.Check size={18} />
                              Added!
                            </>
                          ) : (
                            <>
                              <Icons.ShoppingCart size={18} />
                              Add to Cart
                            </>
                          )}
                        </button>
                        <Link
                          to={`/product/${product._id}`}
                          className="p-3 rounded-lg border-2 border-border hover:border-primary hover:bg-background-alt transition-all duration-200 flex items-center justify-center"
                          title="View Details"
                        >
                          <Icons.Eye size={18} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {showFilters && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowFilters(false)}
        />
      )}
    </div>
  );
};

export default Products;