// app/page.tsx
import React from "react";
import Container from "@/components/Container";
import ProductGrid from "@/components/Product/ProductGrid";
import { getProducts } from "@/lib/firebase/db";

export const revalidate = 3600; // Revalidate at most every hour

export default async function Home() {
  const products = await getProducts();

  // Get featured products
  const featuredProducts = products.filter((product) => product.featured);

  return (
    <main>
      {/* Hero Section */}
      <div className="bg-black text-white py-16 md:py-24">
        <Container>
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find Your Perfect Style
            </h1>
            <p className="text-lg mb-8">
              Discover our curated collection of premium products that enhance
              your lifestyle.
            </p>
          </div>
        </Container>
      </div>

      {/* Featured Products */}
      <Container className="py-16">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        <ProductGrid
          products={
            featuredProducts.length ? featuredProducts : products.slice(0, 4)
          }
        />
      </Container>

      {/* All Products */}
      <Container className="py-16 border-t border-gray-200">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">All Products</h2>
      
        </div>
        <ProductGrid products={products.slice(0, 8)} />
      </Container>
    </main>
  );
}
