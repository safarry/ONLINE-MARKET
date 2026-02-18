import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { productsAPI } from '../services/api';
import Button from '../components/button';
import Input from '../components/input';
import type { Product } from '../types';

const CreateProduct: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'books',
    stock: '',
  });

  const categories = [
    'books',
    'electronics',
    'fashion',
    'home & living',
    'beauty',
    'sports',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxFiles = 5;
    
    if (imageFiles.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} images allowed`);
      return;
    }

    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviews]);
    setImageFiles(prev => [...prev, ...files]);
    setError('');
  };

  const removeImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!formData.title || !formData.description || !formData.price || !formData.stock) {
        setError('All fields are required');
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('stock', formData.stock);

      // Append image files
      imageFiles.forEach(file => {
        formDataToSend.append('images', file);
      });

      const response = await productsAPI.create(formDataToSend);
      
      setSuccess('Product created successfully!');
      setFormData({
        title: '',
        description: '',
        price: '',
        category: 'books',
        stock: '',
      });
      setPreviewImages([]);
      setImageFiles([]);

      setTimeout(() => {
        navigate('/products');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] py-16 bg-background-alt">
      <div className="container max-w-2xl">
        <div className="bg-surface rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-text mb-2">Create Product</h1>
          <p className="text-text-light mb-8">Add a new product to your store</p>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 rounded-lg text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Title */}
            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                Product Title
              </label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter product title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                rows={4}
                className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Category & Price Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-primary focus:outline-none transition-colors capitalize"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-text mb-2">
                  Price ($)
                </label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                Stock Quantity
              </label>
              <Input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="0"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                Product Images (Max 5)
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-input"
                  disabled={imageFiles.length >= 5}
                />
                <label htmlFor="image-input" className="cursor-pointer">
                  <Icons.Upload size={32} className="mx-auto mb-2 text-text-light" />
                  <p className="text-text font-semibold">Click to upload or drag and drop</p>
                  <p className="text-text-light text-sm">PNG, JPG, GIF up to 10MB</p>
                  <p className="text-xs text-text-light mt-2">
                    {imageFiles.length}/5 images selected
                  </p>
                </label>
              </div>

              {/* Image Previews */}
              {previewImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-text mb-2">Preview</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {previewImages.map((preview, index) => (
                      <div key={index} className="relative overflow-hidden rounded-lg bg-background-alt">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                        >
                          <Icons.X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-lg"
            >
              {loading ? 'Creating Product...' : 'Create Product'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
