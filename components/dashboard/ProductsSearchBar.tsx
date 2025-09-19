"use client";

import { Search, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSearch } from "@/lib/context/SearchContext";

export default function SearchBar({ placeholder }: { placeholder: string }) {
  const { searchQuery, setSearchQuery } = useSearch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const pathname = usePathname();
  if (pathname.endsWith("/products") === false) {
    return null;
  }

  return (
    <div className="relative w-full">
      <div className="relative flex items-center md:w-full">
        <div className="relative inline-flex items-center gap-3 px-4 py-1.5 rounded-lg bg-gradient-to-b from-white via-gray-50 to-gray-100 border-2 border-gray-300/60 border-t-gray-200/80 border-b-gray-400/80 shadow-[0_1px_0_0_rgba(255,255,255,0.8)_inset,0_-1px_0_0_rgba(0,0,0,0.1)_inset,0_2px_4px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.1)] before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-b before:from-white/30 before:via-transparent before:to-transparent before:pointer-events-none overflow-hidden transition-all duration-200 ease-out focus-within:bg-gradient-to-b focus-within:from-white focus-within:to-gray-50 focus-within:border-neutral-400/60 focus-within:border-t-neutral-300/70 focus-within:border-b-neutral-500/70 focus-within:shadow-[0_1px_0_0_rgba(255,255,255,0.9)_inset,0_-1px_0_0_rgba(0,0,0,0.15)_inset,0_4px_8px_rgba(59,130,246,0.15),0_2px_4px_rgba(0,0,0,0.1)] hover:border-t-gray-100/90 hover:border-b-gray-500/90 hover:shadow-[0_1px_0_0_rgba(255,255,255,0.9)_inset,0_-1px_0_0_rgba(0,0,0,0.12)_inset,0_3px_6px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.12)] w-full">
          <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <input
            id="search-input"
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleInputChange}
            className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 text-sm font-medium w-full md:py-0 pr-8"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
