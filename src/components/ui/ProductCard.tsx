// components/ui/ProductCard.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductType } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: ProductType;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link href={`/product/${product.id}`} className="group">
      <div className="overflow-hidden rounded-xl bg-gray-100 aspect-square relative">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out"
        />
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="text-lg font-medium text-black group-hover:text-indigo-700 transition-colors duration-300">
          {product.name}
        </h3>
        <p className="font-semibold text-black">
          {formatCurrency(product.price)}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
