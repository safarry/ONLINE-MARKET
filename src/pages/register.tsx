import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuthStore } from '../stores';
import Input from '../components/input';
import Button from '../components/button';
import type { RegisterData } from '../types';

interface FormData extends RegisterData {
  firstName: string;
  lastName: string;
  confirmPassword: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  submit?: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
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
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
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
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, firstName, lastName, ...registerData } = formData;
      const response = await authAPI.register(registerData as RegisterData);
      const { token, user } = response.data.data;
      
      localStorage.setItem('token', token);
      setAuth(user, token);
      
      navigate('/');
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const message = axiosError.response?.data?.message || 'Registration failed. Please try again.';
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
            <h1 className="font-display text-4xl lg:text-5xl mb-2">Create Account</h1>
            <p className="text-text-light text-lg">Join our marketplace today</p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="First Name"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                icon={<UserIcon size={20} />}
                placeholder="John"
                autoComplete="given-name"
                fullWidth={false}
              />

              <Input
                label="Last Name"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                icon={<UserIcon size={20} />}
                placeholder="Doe"
                autoComplete="family-name"
                fullWidth={false}
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={<Mail size={20} />}
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
              icon={<Lock size={20} />}
              placeholder="Min. 6 characters"
              autoComplete="new-password"
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              icon={<Lock size={20} />}
              placeholder="Re-enter password"
              autoComplete="new-password"
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text">Account Type</label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2 p-4 border-2 border-border rounded-lg cursor-pointer transition-all hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={formData.role === 'user'}
                    onChange={handleChange}
                    className="cursor-pointer"
                  />
                  <span>Buyer</span>
                </label>
                <label className="flex items-center gap-2 p-4 border-2 border-border rounded-lg cursor-pointer transition-all hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <input
                    type="radio"
                    name="role"
                    value="seller"
                    checked={formData.role === 'seller'}
                    onChange={handleChange}
                    className="cursor-pointer"
                  />
                  <span>Seller</span>
                </label>
              </div>
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
              icon={<ArrowRight size={20} />}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-10 text-center text-text-light">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:text-primary-dark transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Decoration Side */}
        <div className="hidden md:flex bg-gradient-to-br from-primary-dark to-primary relative items-center justify-center p-16 overflow-hidden">
          <div className="absolute w-[300px] h-[300px] bg-white/10 rounded-full -top-24 -right-24 animate-[float_6s_ease-in-out_infinite]" />
          <div className="absolute w-[200px] h-[200px] bg-white/10 rounded-full -bottom-12 -left-12 animate-[float_8s_ease-in-out_infinite_reverse]" />
          
          <div className="relative z-10 text-white text-center">
            <h2 className="font-display text-4xl lg:text-5xl mb-6 text-white">Join Our Community</h2>
            <p className="text-lg opacity-90 max-w-sm">
              Experience seamless shopping with trusted sellers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;