"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredProducts: Product[];
  setFilteredProducts: (products: Product[]) => void;
}

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

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        filteredProducts,
        setFilteredProducts,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

export type { Product };