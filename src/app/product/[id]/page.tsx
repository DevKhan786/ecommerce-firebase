// app/product/[id]/page.tsx
import React from "react";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import ProductImage from "@/components/Product/ProductImage";
import ProductInfo from "@/components/Product/ProductInfo";
import { getProduct, getProducts } from "@/lib/firebase/db";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export const revalidate = 3600; // Revalidate at most every hour

// Generate static params for the most popular products
export async function generateStaticParams() {
  const products = await getProducts();
  return products.slice(0, 10).map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <Container className="py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProductImage images={product.images} name={product.name} />
        <ProductInfo product={product} />
      </div>
    </Container>
  );
}
