"use client";

import React from "react";
import Image from "next/image";
import { Bell, Menu, Plus, Search, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { usePathname } from "next/navigation";

interface ActivityBarProps {
  onSidebarToggle: () => void;
  onAddProduct?: () => void;
  onAddOrder?: () => void;
  onSignOut?: () => void;
}

export function ActivityBar({
  onSidebarToggle,
  onAddProduct,
  onAddOrder,
  onSignOut,
}: ActivityBarProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [userEmail, setUserEmail] = React.useState<string>("");
  const [userName, setUserName] = React.useState<string>("");
  const pathname = usePathname();

  const checkIfProductsPage = () => {
    if (pathname.endsWith("/products")) {
      return true;
    }
    return false;
  };

  React.useEffect(() => {
    // Get user data from localStorage
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("userEmail") || "";
      const name = localStorage.getItem("userName") || "";
      setUserEmail(email);
      setUserName(name);

      // If localStorage is empty, fetch from API
      if (!email || !name) {
        fetchUserData();
      }
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/auth/profile");
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUserEmail(data.user.email);
          setUserName(data.user.name);
          // Also store in localStorage for future use
          localStorage.setItem("userEmail", data.user.email);
          localStorage.setItem("userName", data.user.name);
        }
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const handleAddProduct = () => {
    if (onAddProduct) {
      onAddProduct();
    } else {
      console.log("Add product clicked");
    }
  };

  const handleAddOrder = () => {
    if (onAddOrder) {
      onAddOrder();
    } else {
      console.log("Add order clicked");
    }
  };

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
    } else {
      console.log("Sign out clicked");
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-30 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left Section - Menu + Logo + Title */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="h-8 w-8 rounded-sm hover:bg-orange-50 border border-soft-gray"
          >
            <Menu className="h-4 w-4 text-gray-700" />
          </Button>

          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/40">
              <Image
                src="/invenza-icon.png"
                alt="Invenza"
                width={20}
                height={20}
                className="h-5 w-5"
              />
            </div>
            <span className="font-mono text-sm font-bold text-black">
              INVENZA
            </span>
            <span className="hidden font-mono text-xs text-gray-500 sm:block">
              Dashboard
            </span>
          </div>
        </div>

        {/* Right Section - Search Bar + Actions + Profile */}
        <div className="flex items-center gap-3">
          {checkIfProductsPage() && (
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search products"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 w-full rounded-md border-gray-200 bg-gray-50 pl-9 pr-4 font-mono text-xs placeholder:text-gray-400 focus:bg-white focus:border-orange-300 focus:ring-orange-200"
                />
              </div>
            </div>
          )}
          {/* Add Order Button */}
          <Button onClick={handleAddOrder} size="sm" variant="outline">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            <span className="hidden sm:inline">Add New Order</span>
          </Button>

          {/* Add Product Button */}
          <Button
            onClick={handleAddProduct}
            size="sm"
            className="h-8 rounded-md bg-orange-500 px-3 font-mono text-xs font-medium text-white hover:bg-orange-600 transition-colors duration-200"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            <span className="hidden sm:inline">Add Product</span>
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 rounded-md hover:bg-gray-100"
          >
            <Bell className="h-4 w-4 text-gray-600" />
            <Badge className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-orange-500 p-0 text-[10px] font-mono text-white">
              3
            </Badge>
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-md hover:bg-gray-100"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
                  <User className="h-3.5 w-3.5 text-gray-600" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 font-mono bg-light-base border-soft-gray"
            >
              <div className="px-2 py-1.5">
                <p className="text-xs font-medium text-black">
                  {userName || "User"}
                </p>
                <p className="text-[10px] text-gray-500">
                  {userEmail || "user@example.com"}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs cursor-pointer">
                <User className="mr-2 h-3.5 w-3.5" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs cursor-pointer">
                <Settings className="mr-2 h-3.5 w-3.5" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-xs text-red-600 focus:text-red-600 cursor-pointer"
              >
                <LogOut className="mr-2 h-3.5 w-3.5" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
