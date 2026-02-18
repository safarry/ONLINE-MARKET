import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import Button from '../components/button';

const Landing: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    days: '02',
    hours: '14',
    minutes: '35',
    seconds: '28'
  });

  const offers = [
    {
      title: '50% OFF',
      subtitle: 'Everything Online',
      color: 'from-red-500 to-pink-500',
      icon: Icons.Zap
    },
    {
      title: 'FREE SHIPPING',
      subtitle: 'Orders Over $50',
      color: 'from-blue-500 to-cyan-500',
      icon: Icons.Truck
    },
    {
      title: 'BUY 2 GET 1',
      subtitle: 'Selected Items',
      color: 'from-purple-500 to-pink-500',
      icon: Icons.Gift
    },
  ];

  const categories = [
    { name: 'Electronics', icon: Icons.Smartphone, color: 'from-yellow-400 to-orange-500' },
    { name: 'Fashion', icon: Icons.ShoppingBag, color: 'from-pink-400 to-red-500' },
    { name: 'Books', icon: Icons.BookOpen, color: 'from-blue-400 to-cyan-500' },
    { name: 'Home & Living', icon: Icons.Home, color: 'from-green-400 to-emerald-500' },
    { name: 'Beauty', icon: Icons.Sparkles, color: 'from-purple-400 to-pink-500' },
    { name: 'Sports', icon: Icons.Activity, color: 'from-orange-400 to-red-500' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % offers.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [offers.length]);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Limited Time Offer Banner */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 text-white px-4 py-3 text-center font-bold animate-pulse">
          <div className="flex items-center justify-center gap-2">
            <Icons.AlertCircle size={20} />
            <span>⚡ LIMITED TIME OFFER - MASSIVE DISCOUNTS! ⚡</span>
            <Icons.AlertCircle size={20} />
          </div>
        </div>

        {/* Hero Section with Main Offer */}
        <section className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8 text-center md:text-left">
                <div className="inline-block">
                  <span className="px-4 py-2 bg-red-500/20 border border-red-500 rounded-full text-red-400 font-semibold text-sm animate-bounce">
                    🎉 EXCLUSIVE FLASH SALE
                  </span>
                </div>

                <h1 className="text-6xl md:text-7xl font-black leading-tight">
                  <span className="bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 bg-clip-text text-transparent animate-pulse">
                    MEGA SALE
                  </span>
                  <br />
                  UP TO 70%
                </h1>

                <p className="text-2xl text-gray-300 font-semibold">
                  Shop Your Favorite Brands & Save Big!
                </p>

                {/* Countdown Timer */}
                <div className="bg-gradient-to-r from-red-500 to-yellow-500 p-8 rounded-2xl">
                  <p className="text-gray-900 font-bold text-lg mb-4">OFFER ENDS IN:</p>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="bg-gray-900/30 rounded-lg p-4 backdrop-blur">
                      <div className="text-4xl font-black text-white">{timeLeft.days}</div>
                      <div className="text-sm text-gray-200 font-semibold">DAYS</div>
                    </div>
                    <div className="bg-gray-900/30 rounded-lg p-4 backdrop-blur">
                      <div className="text-4xl font-black text-white">{timeLeft.hours}</div>
                      <div className="text-sm text-gray-200 font-semibold">HOURS</div>
                    </div>
                    <div className="bg-gray-900/30 rounded-lg p-4 backdrop-blur">
                      <div className="text-4xl font-black text-white">{timeLeft.minutes}</div>
                      <div className="text-sm text-gray-200 font-semibold">MINS</div>
                    </div>
                    <div className="bg-gray-900/30 rounded-lg p-4 backdrop-blur">
                      <div className="text-4xl font-black text-white">{timeLeft.seconds}</div>
                      <div className="text-sm text-gray-200 font-semibold">SECS</div>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link to="/products" className="flex-1">
                    <button className="w-full px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-black text-lg rounded-xl transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-red-500/50 flex items-center justify-center gap-2">
                      <Icons.ShoppingCart size={24} />
                      SHOP NOW
                    </button>
                  </Link>
                  <button className="px-8 py-4 border-2 border-white hover:bg-white hover:text-black text-white font-bold text-lg rounded-xl transition-all duration-300">
                    LEARN MORE
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="flex gap-6 flex-wrap justify-center md:justify-start text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Icons.CheckCircle size={18} className="text-green-500" />
                    Secure Payment
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons.CheckCircle size={18} className="text-green-500" />
                    Free Returns
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons.CheckCircle size={18} className="text-green-500" />
                    Fast Shipping
                  </div>
                </div>
              </div>

              {/* Right - Sliding Offer Cards */}
              <div className="relative h-96 md:h-[500px]">
                <div className="relative h-full">
                  {offers.map((offer, index) => {
                    const IconComponent = offer.icon;
                    const isActive = index === activeSlide;
                    return (
                      <div
                        key={index}
                        className={`absolute inset-0 transition-all duration-500 transform ${
                          isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                        }`}
                      >
                        <div className={`bg-gradient-to-br ${offer.color} rounded-3xl h-full flex flex-col items-center justify-center p-8 shadow-2xl`}>
                          <IconComponent size={120} className="text-white/80 mb-6" />
                          <div className="text-6xl font-black text-white text-center">{offer.title}</div>
                          <div className="text-2xl text-white/90 font-bold mt-4 text-center">{offer.subtitle}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Carousel Dots */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2">
                  {offers.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === activeSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Grid Section */}
        <section className="py-24 px-4 relative">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-black mb-4">
                SHOP BY
                <br />
                <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">CATEGORY</span>
              </h2>
              <p className="text-xl text-gray-400">Find exactly what you're looking for</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <Link key={index} to={`/products?category=${category.name.toLowerCase()}`}>
                    <div className="group relative overflow-hidden rounded-2xl h-48 cursor-pointer">
                      <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-80 group-hover:opacity-100 transition-all duration-300`} />
                      <div className="relative h-full flex flex-col items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-300">
                        <IconComponent size={64} className="mb-4 group-hover:animate-bounce" />
                        <h3 className="text-2xl font-black text-center">{category.name}</h3>
                      </div>
                      <div className="absolute inset-0 border-2 border-white/20 rounded-2xl group-hover:border-white/50 transition-all" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4 bg-gradient-to-r from-gray-900 to-black relative">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { icon: Icons.Truck, title: '🚚 FREE SHIPPING', subtitle: 'On orders $50+' },
                { icon: Icons.Lock, title: '🔒 SECURE', subtitle: '256-bit encryption' },
                { icon: Icons.RotateCcw, title: '↩️ EASY RETURNS', subtitle: '30-day guarantee' },
                { icon: Icons.Headphones, title: '💬 24/7 SUPPORT', subtitle: 'Always here for you' },
              ].map((feature, index) => (
                <div key={index} className="text-center p-8 rounded-2xl border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 transition-all duration-300 group">
                  <div className="text-4xl mb-4">{feature.title.charAt(0)}</div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-400 transition-colors">{feature.title}</h3>
                  <p className="text-gray-400">{feature.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="py-20 px-4 relative">
          <div className="container mx-auto">
            <div className="bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 rounded-3xl p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-pattern" />
              </div>
              <div className="relative z-10">
                <p className="text-sm font-bold text-gray-900 mb-4">⚡ DON'T MISS OUT ⚡</p>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                  Start Shopping Today & Save Big!
                </h2>
                <Link to="/products">
                  <button className="px-12 py-4 bg-black hover:bg-gray-900 text-white font-black text-lg rounded-xl transform hover:scale-105 transition-all duration-300 inline-block">
                    🎁 CLAIM YOUR OFFER NOW
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Landing;
