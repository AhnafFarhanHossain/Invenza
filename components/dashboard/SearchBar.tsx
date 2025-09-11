"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";

interface SearchResultItem {
  _id: string;
  name: string;
}

export default function SearchBar({ placeholder }: { placeholder: string }) {
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
    <div className="relative w-full">
      <div className="relative flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:gap-3 rounded-lg bg-gray-100 border border-gray-300 transition-all duration-200 ease-out focus-within:bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
        <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 text-sm font-medium w-full"
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
}
