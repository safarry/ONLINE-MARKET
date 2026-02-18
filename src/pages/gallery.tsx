import React, { useState } from 'react';
import * as Icons from 'lucide-react';

// Dynamic import of all product images
const imageModules = import.meta.glob<{ default: string }>(
  '../assets/ass*.jpg',
  { eager: true }
) as Record<string, { default: string }>;

const allImages = Object.values(imageModules).map(module => module.default);

const ImageGallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 12;

  const totalPages = Math.ceil(allImages.length / imagesPerPage);
  const startIdx = (currentPage - 1) * imagesPerPage;
  const currentImages = allImages.slice(startIdx, startIdx + imagesPerPage);

  return (
    <div className="min-h-[calc(100vh-200px)] py-16 bg-background-alt">
      <div className="container">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-text mb-2">Product Image Gallery</h1>
          <p className="text-text-light">Browse all {allImages.length} available product images</p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {currentImages.map((image, index) => (
            <div
              key={startIdx + index}
              onClick={() => setSelectedImage(image)}
              className="group relative overflow-hidden rounded-lg bg-surface shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer h-64"
            >
              <img
                src={image}
                alt={`Image ${startIdx + index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <Icons.Eye size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="absolute bottom-2 left-2 bg-primary text-white px-2 py-1 rounded text-xs font-semibold">
                #{startIdx + index + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mb-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border-2 border-border hover:border-primary disabled:opacity-50 transition-colors"
            >
              <Icons.ChevronLeft size={20} />
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg font-semibold transition-all ${
                    currentPage === page
                      ? 'bg-primary text-white'
                      : 'border-2 border-border hover:border-primary'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border-2 border-border hover:border-primary disabled:opacity-50 transition-colors"
            >
              <Icons.ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Info */}
        <div className="text-center text-text-light mb-8">
          Showing {startIdx + 1}-{Math.min(startIdx + imagesPerPage, allImages.length)} of {allImages.length} images
        </div>

        {/* Full Screen Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="max-w-4xl w-full max-h-[90vh] relative">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-white text-black p-2 rounded-full hover:bg-gray-200 z-10"
              >
                <Icons.X size={24} />
              </button>
              <img
                src={selectedImage}
                alt="Full screen"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
