import React, { useState } from "react";

const OptimizedImage = ({ 
  src, 
  alt, 
  className = "", 
  width = 800,
  height = 600,
  quality = 75,
  format = "webp",
  objectFit = "cover"
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading spinner */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-neutral-800">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      )}

      {/* Main image with lazy loading */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`w-full h-full transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ objectFit }}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

export default OptimizedImage;
