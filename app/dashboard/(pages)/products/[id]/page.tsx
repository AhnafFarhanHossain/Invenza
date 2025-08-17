"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { base64ToObjectUrl } from "@/lib/image-utils";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  DollarSign,
  Calendar,
  Hash,
} from "lucide-react";
import { format } from "date-fns";

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

const SingleProductPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageObjectUrl, setImageObjectUrl] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const unwrapParams = async () => {
      const unwrappedParams = await params;
      setId(unwrappedParams.id);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    return () => {
      if (imageObjectUrl) {
        URL.revokeObjectURL(imageObjectUrl);
      }
    };
  }, [imageObjectUrl]);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`, {
          cache: "no-store",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to load product");
        }

        const data = await res.json();
        setProduct(data.product);

        if (
          data.product?.image &&
          data.product.image.startsWith("data:image")
        ) {
          try {
            const url = base64ToObjectUrl(data.product.image);
            setImageObjectUrl(url);
          } catch (error) {
            console.error("Error converting base64 image:", error);
            setImageObjectUrl(null);
          }
        } else {
          setImageObjectUrl(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }

      router.push("/dashboard/products");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  const getStockStatus = () => {
    if (!product) return null;

    const isInStock = product.quantity > 0;
    const isLowStock = product.quantity <= product.reorderLevel;
    const isOutOfStock = product.quantity === 0;

    if (isOutOfStock) {
      return { label: "Out of Stock", color: "destructive" };
    } else if (isLowStock) {
      return { label: "Low Stock", color: "warning" };
    } else {
      return { label: "In Stock", color: "success" };
    }
  };

  const stockStatus = getStockStatus();

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <Skeleton className="aspect-[4/3] w-full rounded-lg" />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/products")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Product not found</p>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/products")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const profitMargin = (
    ((product.sellPrice - product.costPrice) / product.costPrice) *
    100
  ).toFixed(1);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          className="mb-6 -ml-2"
          onClick={() => router.push("/dashboard/products")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              {product.name}
            </h1>
            <p className="text-gray-600 mt-2">
              {product.description || "No description available"}
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/products/${id}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg overflow-hidden">
            <div className="aspect-[4/3] relative bg-gray-50">
              {product.image ? (
                <Image
                  src={imageObjectUrl || product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/600x400";
                  }}
                  loading="lazy"
                  unoptimized={true}
                />
              ) : (
                <Image
                  src="https://placehold.co/600x400"
                  alt="No image"
                  fill
                  className="object-cover"
                  loading="lazy"
                  unoptimized={true}
                />
              )}
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Product Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Hash className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">SKU:</span>
                  <span className="font-mono text-gray-900">
                    {product.sku || "N/A"}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Category:</span>
                  <span className="text-gray-900">
                    {product.category || "Uncategorized"}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-900">
                    {format(new Date(product.createdAt), "MMM dd, yyyy")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stock Status */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Stock Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge
                  variant={stockStatus?.color as any}
                  className="font-medium"
                >
                  {stockStatus?.label}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Available</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {product.quantity} {product.unit}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Reorder Level</span>
                  <span className="text-sm text-gray-900">
                    {product.reorderLevel} {product.unit}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cost Price</span>
                <span className="text-lg font-semibold text-gray-900">
                  ${product.costPrice.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Selling Price</span>
                <span className="text-lg font-semibold text-gray-900">
                  ${product.sellPrice.toFixed(2)}
                </span>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Profit per Unit</span>
                  <span className="text-lg font-semibold text-emerald-600">
                    +${(product.sellPrice - product.costPrice).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600">Profit Margin</span>
                  <span
                    className={`text-sm font-medium ${
                      parseFloat(profitMargin) >= 0
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {profitMargin}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Product ID */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Product ID
            </h3>
            <div className="bg-gray-50 rounded-md p-3">
              <p className="font-mono text-sm text-gray-700 break-all">
                {product._id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
