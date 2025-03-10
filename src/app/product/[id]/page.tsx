import React from "react";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import ProductImage from "@/components/Product/ProductImage";
import ProductInfo from "@/components/Product/ProductInfo";
import { getProduct, getProducts } from "@/lib/firebase/db";
import { Metadata } from "next";

export const revalidate = 3600;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.slice(0, 10).map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = await getProduct(params.id);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.length > 0 ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
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
