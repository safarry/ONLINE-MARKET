import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { productsAPI } from '../services/api';
import ProductCard from '../components/productcart';
import Button from '../components/button';
import type { Product } from '../types';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await productsAPI.getAll({ featured: true, limit: 4 });
        setFeaturedProducts(response.data.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const features = [
    {
      icon: <Icons.Truck size={32} />,
      title: 'Free Shipping',
      description: 'On orders over $50'
    },
    {
      icon: <Icons.Shield size={32} />,
      title: 'Secure Payment',
      description: '100% secure transactions'
    },
    {
      icon: <Icons.Package size={32} />,
      title: 'Easy Returns',
      description: '30-day return policy'
    },
    {
      icon: <Icons.CreditCard size={32} />,
      title: 'Flexible Payment',
      description: 'Multiple payment options'
    }
  ];

  return (
    <div className="min-h-[calc(100vh-200px)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background to-background-alt py-16 lg:py-24 relative overflow-hidden">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
            <div className="animate-slide-in">
              <h1 className="font-display text-5xl lg:text-7xl leading-tight mb-6">
                Discover Quality
                <span className="text-primary block">Products</span>
              </h1>
              <p className="text-xl text-text-light mb-10 leading-relaxed max-w-lg">
                Shop from our curated collection of premium products. 
                Quality you can trust, prices you'll love.
              </p>
              <div className="flex flex-wrap gap-6">
                <Link to="/products">
                  <Button size="large" icon={<Icons.ArrowRight size={20} />}>
                    Shop Now
                  </Button>
                </Link>
                <Link to="/products?featured=true">
                  <Button variant="outline" size="large">
                    View Featured
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative h-[500px] animate-fade-in">
              <div className="w-full h-full bg-gradient-to-br from-primary to-accent rounded-lg relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/10 text-[15rem] font-display select-none">
                  ◈
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-surface py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-10 bg-background-alt rounded-lg hover:-translate-y-2 hover:shadow-md hover:bg-surface transition-all duration-250 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-primary to-primary-light text-white rounded-lg">
                  {feature.icon}
                </div>
                <h3 className="text-xl mb-2 font-display">{feature.title}</h3>
                <p className="text-text-light">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-background-alt py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-10">
            <h2 className="font-display text-4xl lg:text-5xl relative pb-4 after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-accent after:rounded">
              Featured Products
            </h2>
            <Link to="/products">
              <Button variant="ghost" icon={<Icons.ArrowRight size={18} />}>
                View All
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-16 text-text-light text-lg">
              Loading products...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary-dark to-primary text-white text-center py-32 relative overflow-hidden">
        <div className="absolute -top-1/2 -right-[10%] w-[500px] h-[500px] bg-accent rounded-full opacity-10" />
        
        <div className="container relative z-10">
          <h2 className="font-display text-4xl lg:text-5xl mb-6 text-white">
            Start Your Shopping Journey
          </h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Join thousands of satisfied customers and experience the best online shopping
          </p>
          <Link to="/register">
            <Button size="large" variant="secondary">
              Create Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;