// components/ui/QuantitySelector.tsx
import React from "react";
import { FiMinus, FiPlus } from "react-icons/fi";

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  max?: number;
}

const QuantitySelector = ({
  quantity,
  onIncrease,
  onDecrease,
  max = 99,
}: QuantitySelectorProps) => {
  return (
    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= 1}
        className="w-10 h-10 flex items-center justify-center text-black hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        <FiMinus size={16} />
      </button>

      <div className="w-12 h-10 flex items-center justify-center border-x border-gray-300">
        <span className="text-sm font-medium">{quantity}</span>
      </div>

      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max}
        className="w-10 h-10 flex items-center justify-center text-black hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        <FiPlus size={16} />
      </button>
    </div>
  );
};

export default QuantitySelector;
