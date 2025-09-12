"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
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
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchTerm(query);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setSearchTerm("");
      setResultArray([]);
      // Focus the input after a short delay to allow the element to render
      setTimeout(() => {
        const input = document.getElementById("search-input");
        if (input) input.focus();
      }, 50);
    }
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

  // Close the search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const pathname = usePathname();
  if (pathname.endsWith("/products") === false) {
    return null;
  }

  return (
    <div className="relative w-full" ref={searchRef}>
      {/* Mobile search toggle button */}
      <button
        className="md:hidden p-2 rounded-md hover:bg-gray-100 flex items-center justify-center"
        onClick={toggleExpand}
      >
        <Search className="w-4 h-4 text-gray-500" />
      </button>

      {/* Search bar - shown on desktop or when expanded on mobile */}
      <div
        className={`${
          isExpanded ? "fixed md:relative top-0 left-0 right-0 z-50 bg-white p-4 md:p-0" : "hidden md:block"
        }`}
      >
        <div className="relative flex items-center md:w-full">
          <div className="relative inline-flex items-center gap-3 px-4 py-1.5 rounded-lg bg-gradient-to-b from-white via-gray-50 to-gray-100 border-2 border-gray-300/60 border-t-gray-200/80 border-b-gray-400/80 shadow-[0_1px_0_0_rgba(255,255,255,0.8)_inset,0_-1px_0_0_rgba(0,0,0,0.1)_inset,0_2px_4px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.1)] before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-b before:from-white/30 before:via-transparent before:to-transparent before:pointer-events-none overflow-hidden transition-all duration-200 ease-out focus-within:bg-gradient-to-b focus-within:from-white focus-within:to-gray-50 focus-within:border-neutral-400/60 focus-within:border-t-neutral-300/70 focus-within:border-b-neutral-500/70 focus-within:shadow-[0_1px_0_0_rgba(255,255,255,0.9)_inset,0_-1px_0_0_rgba(0,0,0,0.15)_inset,0_4px_8px_rgba(59,130,246,0.15),0_2px_4px_rgba(0,0,0,0.1)] hover:border-t-gray-100/90 hover:border-b-gray-500/90 hover:shadow-[0_1px_0_0_rgba(255,255,255,0.9)_inset,0_-1px_0_0_rgba(0,0,0,0.12)_inset,0_3px_6px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.12)] w-full">
            <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <input
              id="search-input"
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              onChange={handleInputChange}
              className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 text-sm font-medium w-full md:py-0"
            />
            {/* Mobile close button */}
            <button 
              className="md:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setIsExpanded(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results dropdown - full height on mobile */}
        <div
          className={`${
            isExpanded
              ? "fixed inset-0 top-16 z-40 bg-white md:absolute md:top-full md:inset-auto"
              : "absolute"
          } left-0 right-0 shadow-xl`}
        >
          <div className="max-h-[calc(100vh-4rem)] md:max-h-60 overflow-y-auto">
            {loading && (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-500"></div>
              </div>
            )}

            {!loading && resultArray.length === 0 && searchTerm && (
              <p className="text-gray-500 text-center text-sm p-4 bg-white">
                No results found
              </p>
            )}

            {!loading && resultArray.length > 0 && (
              <ul className="bg-white divide-y divide-gray-100">
                {resultArray.map((item) => (
                  <li
                    key={item._id}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      router.push(`/dashboard/products/${item._id}`);
                      setIsExpanded(false);
                    }}
                  >
                    <span className="font-medium text-sm text-gray-800">
                      {item.name}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
