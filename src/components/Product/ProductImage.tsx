// components/Product/ProductImage.tsx
"use client";
import React, { useState } from "react";
import Image from "next/image";

interface ProductImageProps {
  images: string[];
  name: string;
}

const ProductImage = ({ images, name }: ProductImageProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images.length) {
    return (
      <div className="aspect-square w-full bg-gray-100 rounded-xl flex items-center justify-center">
        <p className="text-gray-400">No image available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="aspect-square w-full bg-gray-100 rounded-xl overflow-hidden relative">
        <Image
          src={images[activeIndex]}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="flex space-x-2 overflow-auto py-1">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`w-20 h-20 rounded-md overflow-hidden bg-gray-100 relative flex-shrink-0 ${
                activeIndex === index ? "ring-2 ring-indigo-700" : ""
              }`}
            >
              <Image
                src={image}
                alt={`${name} - Image ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImage;
