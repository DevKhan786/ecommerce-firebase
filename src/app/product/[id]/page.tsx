// src/app/product/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import ProductImage from "@/components/Product/ProductImage";
import ProductInfo from "@/components/Product/ProductInfo";
import { getProduct } from "@/lib/firebase/db";
import Loading from "@/components/ui/Loading";
import { ProductType } from "../../../lib/types";

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProduct(params.id);
        if (!data) {
          notFound();
        }
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <Container className="py-12">
        <Loading />
      </Container>
    );
  }

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
