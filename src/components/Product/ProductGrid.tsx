// components/Product/ProductGrid.tsx
import React from "react";
import ProductCard from "@/components/ui/ProductCard";
import { ProductType } from "@/lib/types";

interface ProductGridProps {
  products: ProductType[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-xl font-semibold mb-4">No products found</h3>
        <p className="text-gray-500">
          Try adjusting your search or filter to find what you&apos;re looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
