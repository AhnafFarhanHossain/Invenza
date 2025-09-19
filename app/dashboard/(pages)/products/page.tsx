"use client";
import React, { useState, useEffect, useMemo } from "react";
import ProductCard from "@/components/dashboard/ProductCard";
import { useSearch } from "@/lib/context/SearchContext";
import { filterProducts } from "@/lib/utils/search";
import { useDebounce } from "@/hooks/useDebounce";
import { cachedFetch } from "@/lib/utils/cache";

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

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { searchQuery } = useSearch();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Memoize filtered products for better performance
  const filteredProducts = useMemo(() => {
    return filterProducts(products, debouncedSearchQuery);
  }, [products, debouncedSearchQuery]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await cachedFetch<{ products: Product[] }>("/api/products", {
          credentials: "include",
          cacheTtl: 2 * 60 * 1000, // Cache for 2 minutes
        });

        setProducts(data.products || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (error) {
    return (
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-6">All Products</h1>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center py-8">
            <p className="text-red-600 font-base mb-4">
              Failed to load products 😓
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-light text-black tracking-wide mb-4">All Products</h1>
        {searchQuery && (
          <div className="text-sm text-gray-600">
            {loading ? (
              "Searching..."
            ) : (
              `Found ${filteredProducts.length} result${filteredProducts.length !== 1 ? 's' : ''} for &ldquo;${searchQuery}&rdquo;`
            )}
          </div>
        )}
      </div>
      {loading ? (
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 animate-pulse"
          role="status" 
          aria-label="Loading products"
        >
          {Array.from({ length: 10 }).map((_, index) => (
            <ProductCard key={index} isLoading={true} />
          ))}
        </div>
      ) : (
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 animate-fade-in"
          role="grid"
          aria-label="Products list"
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} searchQuery={searchQuery} />
          ))}
          {filteredProducts.length === 0 && searchQuery && (
            <div className="col-span-full bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-muted-foreground">
                No products found matching &ldquo;{searchQuery}&rdquo;
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Try searching with different keywords
              </p>
            </div>
          )}
          {products.length === 0 && !searchQuery && (
            <div className="col-span-full bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-muted-foreground">No products found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
