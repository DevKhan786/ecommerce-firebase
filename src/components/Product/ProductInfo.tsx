// components/Product/ProductInfo.tsx
"use client"
import React, { useState } from "react";
import { ProductType } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import Button from "@/components/ui/Button";
import QuantitySelector from "@/components/ui/QuantitySelector";
import { useCartStore } from "@/store/useCartStore";

interface ProductInfoProps {
  product: ProductType;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCartStore();

  const handleIncrease = () => {
    setQuantity((prev) => Math.min(prev + 1, product.inventory));
  };

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleAddToCart = () => {
    setIsAdding(true);

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
    });

    // Show feedback briefly
    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{product.name}</h1>

      <p className="text-2xl font-semibold">{formatCurrency(product.price)}</p>

      <div className="prose prose-gray max-w-none">
        <p>{product.description}</p>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <div className="flex items-center">
          <span className="mr-4 font-medium">Quantity</span>
          <QuantitySelector
            quantity={quantity}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            max={product.inventory}
          />

          <div className="ml-4 text-sm text-gray-500">
            {product.inventory > 10
              ? "In stock"
              : product.inventory > 0
              ? `Only ${product.inventory} left!`
              : "Out of stock"}
          </div>
        </div>
      </div>

      <Button
        onClick={handleAddToCart}
        isLoading={isAdding}
        disabled={product.inventory === 0}
        size="lg"
        fullWidth
      >
        {isAdding ? "Adding to Cart..." : "Add to Cart"}
      </Button>
    </div>
  );
};

export default ProductInfo;
