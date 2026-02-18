import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuthStore } from '../stores';
import Input from '../components/input';
import Button from '../components/button';
import type { LoginCredentials } from '../types';

interface FormErrors {
  email?: string;
  password?: string;
  submit?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    try {
      const response = await authAPI.login(formData);
      const { token, user } = response.data.data;
      
      localStorage.setItem('token', token);
      setAuth(user, token);
      
      navigate('/');
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const message = axiosError.response?.data?.message || 'Login failed. Please try again.';
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-10 bg-gradient-to-br from-background to-background-alt">
      <div className="w-full max-w-6xl grid md:grid-cols-2 bg-surface rounded-lg overflow-hidden shadow-lg">
        {/* Form Side */}
        <div className="p-16 animate-slide-in">
          <div className="text-center mb-10">
            <h1 className="font-display text-4xl lg:text-5xl mb-2">Welcome Back</h1>
            <p className="text-text-light text-lg">Sign in to continue shopping</p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={<Icons.Mail size={20} />}
              placeholder="you@example.com"
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={<Icons.Lock size={20} />}
              placeholder="Enter your password"
              autoComplete="current-password"
            />

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="cursor-pointer" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-primary font-medium hover:text-primary-dark transition-colors">
                Forgot password?
              </Link>
            </div>

            {errors.submit && (
              <div className="p-4 bg-error/10 border border-error rounded-lg text-error text-sm text-center">
                {errors.submit}
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              size="large"
              loading={loading}
              icon={<Icons.ArrowRight size={20} />}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-10 text-center text-text-light">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-semibold hover:text-primary-dark transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Decoration Side */}
        <div className="hidden md:flex bg-gradient-to-br from-primary-dark to-primary relative items-center justify-center p-16 overflow-hidden">
          <div className="absolute w-[300px] h-[300px] bg-white/10 rounded-full -top-24 -right-24 animate-[float_6s_ease-in-out_infinite]" />
          <div className="absolute w-[200px] h-[200px] bg-white/10 rounded-full -bottom-12 -left-12 animate-[float_8s_ease-in-out_infinite_reverse]" />
          
          <div className="relative z-10 text-white text-center">
            <h2 className="font-display text-4xl lg:text-5xl mb-6 text-white">Start Your Journey</h2>
            <p className="text-lg opacity-90 max-w-sm">
              Discover amazing products at unbeatable prices
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;