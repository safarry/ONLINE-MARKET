import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Filter } from 'lucide-react';
import { productsAPI } from '../services/api';
import ProductCard from '../components/productcart';
import Button from '../components/button';
import type { Product, ProductFilters } from '../types';

const Products: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<ProductFilters>({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: undefined,
    maxPrice: undefined,
    sort: 'newest',
  });

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
            icon={<SlidersHorizontal size={18} />}
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
                <Filter size={18} />
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
                  <ProductCard key={product._id} product={product} />
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