"use client";

// app/cart/page.tsx
import React from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import CartItem from "@/components/Cart/CartItem";
import CartSummary from "@/components/Cart/CartSummary";
import Button from "@/components/ui/Button";
import { useCartStore } from "@/store/useCartStore";

export default function CartPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();

  const handleContinueShopping = () => {
    router.push("/");
  };

  if (items.length === 0) {
    return (
      <Container className="py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Your Cart is Empty</h1>
          <p className="text-gray-500 mb-8">
            Looks like you haven&apos;t added any products to your cart yet.
          </p>
          <Button onClick={handleContinueShopping}>Continue Shopping</Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">
                Cart Items ({items.length})
              </h2>
              <button
                onClick={clearCart}
                className="text-red-500 text-sm hover:underline"
              >
                Clear Cart
              </button>
            </div>

            <div>
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Button variant="outline" onClick={handleContinueShopping}>
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>

        <div>
          <CartSummary />
        </div>
      </div>
    </Container>
  );
}
