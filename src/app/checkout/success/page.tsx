'use client';

// app/checkout/success/page.tsx
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Container from '@/components/Container';
import Button from '@/components/ui/Button';
import { FiCheckCircle } from 'react-icons/fi';
import { useCartStore } from '@/store/useCartStore';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCartStore();
  
  // Clear cart on successful checkout
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <Container className="py-16">
      <div className="max-w-lg mx-auto text-center">
        <div className="mb-6 flex justify-center">
          <FiCheckCircle className="text-green-500 w-24 h-24" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
        
        <p className="text-gray-600 mb-8">
          Your order has been placed successfully. We've sent a confirmation email with your order details.
        </p>
        
        {sessionId && (
          <div className="mb-8 bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Order Reference:</p>
            <p className="font-mono text-sm">{sessionId}</p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button variant="outline" size="lg" asChild>
            <Link href="/">
              Continue Shopping
            </Link>
          </Button>
          
          <Button size="lg" asChild>
            <Link href="/">
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}