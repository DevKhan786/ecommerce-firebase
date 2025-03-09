// components/Cart/CartSummary.tsx
import React from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/utils";

const CartSummary = () => {
  const router = useRouter();
  const { items, getTotalPrice } = useCartStore();
  const totalPrice = getTotalPrice();

  // Constants
  const SHIPPING_PRICE = 0; // Free shipping
  const TAX_RATE = 0.1; // 10% tax

  // Calculations
  const taxAmount = totalPrice * TAX_RATE;
  const totalAmount = totalPrice + taxAmount + SHIPPING_PRICE;

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Subtotal ({items.length} items)</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>
            {SHIPPING_PRICE === 0 ? "Free" : formatCurrency(SHIPPING_PRICE)}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Tax (estimated)</span>
          <span>{formatCurrency(taxAmount)}</span>
        </div>

        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </div>

      <Button
        fullWidth
        className="mt-6"
        onClick={handleCheckout}
        disabled={items.length === 0}
      >
        Proceed to Checkout
      </Button>
    </div>
  );
};

export default CartSummary;
