"use client";
import React from "react";
import { getUserIdFromRequest } from "@/lib/auth";

const Products = () => {
  const [products, setProducts] = React.useState<string[]>([]);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"></div>
    </div>
  );
};

export default Products;
