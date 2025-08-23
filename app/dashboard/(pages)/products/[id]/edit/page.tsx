"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { EditProductForm } from "@/components/dashboard/EditProductForm";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  sku: string;
  quantity: number;
  reorderLevel: number;
  costPrice: number;
  sellPrice: number;
  unit: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/products/${id}`);

        if (res.status !== 200) {
          throw new Error("Failed to load product");
        }

        const data = await res.data;
        setProduct(data.product);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (data: any) => {
    try {
      await axios.patch(`/api/products/${id}`, data);
      router.push(`/dashboard/products/${id}`);
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Failed to update product. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => router.push(`/dashboard/products/${id}`)}>
          Back to Product
        </Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="text-gray-600 mb-4">Product not found</p>
        <Button onClick={() => router.push("/dashboard/products")}>
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <EditProductForm
        product={product}
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/dashboard/products/${id}`)}
      />
    </div>
  );
}
