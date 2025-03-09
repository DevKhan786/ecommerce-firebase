"use client";

// app/checkout/page.tsx
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { formatCurrency } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  });

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Calculate totals
  const subtotal = getTotalPrice();
  const taxRate = 0.1; // 10% tax
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  // Redirect to cart if empty
  React.useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart");
    }
  }, [items, router]);

  // Handle checkout
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Form validation
      for (const [key, value] of Object.entries(formData)) {
        if (value.trim() === "") {
          throw new Error(`Please fill in all fields`);
        }
      }

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          userId: user?.uid || null,
          shippingAddress: {
            name: formData.name,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleCheckout} className="space-y-6">
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">
                Shipping Information
              </h2>

              <div className="space-y-4">
                <FormInput
                  label="Full Name"
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <FormInput
                  label="Email Address"
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <FormInput
                  label="Address"
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="City"
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />

                  <FormInput
                    label="State / Province"
                    id="state"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Zip / Postal Code"
                    id="zipCode"
                    name="zipCode"
                    type="text"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                  />

                  <FormInput
                    label="Country"
                    id="country"
                    name="country"
                    type="text"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <p className="text-gray-500">
                Payment will be processed securely via Stripe
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-xl">
                {error}
              </div>
            )}

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/cart")}
              >
                Back to Cart
              </Button>

              <Button type="submit" isLoading={isLoading}>
                Complete Order
              </Button>
            </div>
          </form>
        </div>

        <div>
          <div className="bg-gray-50 rounded-xl p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                <div key={item.id} className="py-3 flex justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p>{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>

              <div className="flex justify-between font-semibold text-lg pt-2">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
