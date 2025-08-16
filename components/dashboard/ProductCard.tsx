import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { base64ToObjectUrl } from "@/lib/image-utils";

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

interface ProductCardProps {
  product?: Product;
  isLoading?: boolean;
}

const ProductCard = ({ product, isLoading = false }: ProductCardProps) => {
  const [imageObjectUrl, setImageObjectUrl] = useState<string | null>(null);
  
  useEffect(() => {
    // Cleanup object URL on component unmount
    return () => {
      if (imageObjectUrl) {
        URL.revokeObjectURL(imageObjectUrl);
      }
    };
  }, [imageObjectUrl]);

  useEffect(() => {
    if (product?.image && product.image.startsWith('data:image')) {
      try {
        const url = base64ToObjectUrl(product.image);
        setImageObjectUrl(url);
      } catch (error) {
        console.error("Error converting base64 image:", error);
        setImageObjectUrl(null);
      }
    } else {
      setImageObjectUrl(null);
    }
  }, [product?.image]);
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 transition-all duration-200">
        <div className="relative aspect-square">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="p-4">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2 mb-3" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const isInStock = product.quantity > 0;
  const isLowStock = product.quantity <= product.reorderLevel;
  const isOutOfStock = product.quantity === 0;

  return (
    <div className="bg-white border border-gray-200 transition-all duration-200 hover:border-gray-300">
      <div className="relative aspect-square">
        {product.image ? (
        <Image
          src={imageObjectUrl || product.image}
          alt={product.name}
          fill
          className="object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://placehold.co/350x350";
          }}
          loading="lazy"
          unoptimized={true}
        />
        ) : (
          <Image
            src="https://placehold.co/350x350"
            alt="No image"
            fill
            className="object-cover"
            loading="lazy"
            unoptimized={true}
          />
        )}
        <div className="absolute top-2 right-2">
          <div className={`w-3 h-3 ${
            isLowStock ? "bg-amber-500" : isInStock ? "bg-emerald-500" : "bg-gray-400"
          }`} />
        </div>
      </div>
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
            {product.description || "No description"}
          </p>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-lg font-bold text-gray-900">
                ${product.sellPrice.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                Cost: ${product.costPrice.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {product.quantity} <span className="text-xs text-gray-500">{product.unit}</span>
              </p>
              <p className="text-xs text-gray-500">
                Reorder: {product.reorderLevel}
              </p>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {product.category || "Uncategorized"}
            </span>
            <span className="text-xs text-gray-400 font-mono">
              {product.sku || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
