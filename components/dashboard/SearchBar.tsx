"use client";

import { Search } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

interface SearchResultItem {
  _id: string;
  name: string;
}

const SearchBar = ({ placeholder }: { placeholder: string }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [resultArray, setResultArray] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchTerm(query);
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setResultArray([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`/api/search/?q=${searchTerm}`);
        setResultArray(response.data as SearchResultItem[]);
      } catch (err) {
        setError("Failed to fetch search results");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Set up debouncing with 300ms delay
    const handler = setTimeout(fetchData, 300);

    // Clear timeout on cleanup
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const pathname = usePathname();
  if (pathname.endsWith("/products") === false) {
    return null;
  }

  return (
    <div className="relative">
      <div className="relative inline-flex items-center gap-3 px-4 py-1.5 rounded-lg bg-gradient-to-b from-white via-gray-50 to-gray-100 border-2 border-gray-300/60 border-t-gray-200/80 border-b-gray-400/80 shadow-[0_1px_0_0_rgba(255,255,255,0.8)_inset,0_-1px_0_0_rgba(0,0,0,0.1)_inset,0_2px_4px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.1)] before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-b before:from-white/30 before:via-transparent before:to-transparent before:pointer-events-none overflow-hidden transition-all duration-200 ease-out focus-within:bg-gradient-to-b focus-within:from-white focus-within:to-gray-50   focus-within:shadow-[0_1px_0_0_rgba(255,255,255,0.9)_inset,0_-1px_0_0_rgba(0,0,0,0.15)_inset,0_4px_8px_rgba(59,130,246,0.15),0_2px_4px_rgba(0,0,0,0.1)] hover:border-t-gray-100/90 hover:border-b-gray-500/90 hover:shadow-[0_1px_0_0_rgba(255,255,255,0.9)_inset,0_-1px_0_0_rgba(0,0,0,0.12)_inset,0_3px_6px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.12)]">
        <button className="cursor-pointer">
          <Search className="w-4 h-4 text-gray-500 relative z-10 flex-shrink-0" />
        </button>
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 relative z-10 text-sm font-medium"
        />
      </div>
      {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
      <div className="absolute left-0 right-0 z-50 shadow-xl">
        <div className="max-h-60 overflow-y-auto">
          {loading && (
            <div className="flex justify-center p-2">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-blue-500"></div>
            </div>
          )}
          {!loading && resultArray.length === 0 && searchTerm && (
            <p className="text-gray-500 text-sm p-2 bg-white">
              No results found
            </p>
          )}
          {!loading && resultArray.length > 0 && (
            <ul className="bg-white rounded-lg shadow-lg border border-gray-200 divide-y divide-gray-200">
              {resultArray.map((item) => (
                <li
                  key={item._id}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/dashboard/products/${item._id}`)}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
