// components/Cart/CartItem.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiTrash2 } from "react-icons/fi";
import { CartItemType } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import QuantitySelector from "@/components/ui/QuantitySelector";
import { useCartStore } from "@/store/useCartStore";

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCartStore();

  const handleIncrease = () => {
    updateQuantity(item.productId, item.quantity + 1);
  };

  const handleDecrease = () => {
    updateQuantity(item.productId, item.quantity - 1);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center py-4 border-b border-gray-200">
      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="100px"
        />
      </div>

      <div className="mt-4 sm:mt-0 sm:ml-6 flex-grow">
        <Link
          href={`/product/${item.productId}`}
          className="text-lg font-medium hover:text-indigo-700 transition-colors"
        >
          {item.name}
        </Link>
        <div className="mt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center mt-2 sm:mt-0">
            <QuantitySelector
              quantity={item.quantity}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
            />

            <button
              type="button"
              onClick={() => removeItem(item.productId)}
              className="ml-4 text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Remove item"
            >
              <FiTrash2 size={18} />
            </button>
          </div>

          <div className="mt-3 sm:mt-0 font-semibold">
            {formatCurrency(item.price)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
