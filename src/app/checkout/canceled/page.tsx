"use client";

// app/checkout/canceled/page.tsx
import React from "react";
import Link from "next/link";
import Container from "@/components/Container";
import Button from "@/components/ui/Button";
import { FiAlertCircle } from "react-icons/fi";

export default function CheckoutCanceledPage() {
  return (
    <Container className="py-16">
      <div className="max-w-lg mx-auto text-center">
        <div className="mb-6 flex justify-center">
          <FiAlertCircle className="text-yellow-500 w-24 h-24" />
        </div>

        <h1 className="text-3xl font-bold mb-4">Checkout Canceled</h1>

        <p className="text-gray-600 mb-8">
          Your checkout process was canceled. Your cart items are still saved,
          and you can continue shopping or try checking out again.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button variant="outline" size="lg" asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>

          <Button size="lg" asChild>
            <Link href="/cart">Return to Cart</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
