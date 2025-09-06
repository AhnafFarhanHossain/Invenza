"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  BarChart,
  Box,
  ChevronDown,
  Home,
  LogOut,
  Package,
  PlusSquare,
  Settings,
  ShoppingCart,
  User,
  Users,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "../ui/button";

// Navigation data structure
const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Products",
    icon: Box,
    items: [
      {
        title: "All Products",
        url: "/dashboard/products",
        icon: Box,
      },
      {
        title: "Add Product",
        url: "/dashboard/products/new",
        icon: PlusSquare,
      },
    ],
  },
  {
    title: "Orders",
    url: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    url: "/dashboard/customers",
    icon: Users,
  },
  {
    title: "Reports",
    url: "/dashboard/reports",
    icon: BarChart,
  },
  {
    title: "Settings",
    icon: Settings,
    items: [
      {
        title: "Store Settings",
        url: "/dashboard/settings/store",
        icon: Settings,
      },
      {
        title: "Profile",
        url: "/dashboard/settings/profile",
        icon: User,
      },
    ],
  },
];

interface DashboardSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DashboardSidebar({
  isOpen,
  onOpenChange,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await axios.post("/api/auth/logout");
    router.push("/");
    toast.success("Logged out successfully");
  };

  const isActiveLink = (url: string) => {
    return pathname === url;
  };

  const hasActiveChild = (items: { url: string }[]) => {
    return items?.some((item) => pathname === item.url);
  };

  const handleLinkClick = () => {
    onOpenChange(false);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent
          side="left"
          className="w-[260px] bg-white p-0 transition-all duration-300 ease-in-out border-r border-gray-200"
        >
          {/* Navigation */}
          <div className="flex h-full flex-col bg-white">
            <nav className="flex-1 py-3 px-2">
              <div className="space-y-0.5">
                {navigationItems.map((item) => {
                  const isActive = item.url
                    ? isActiveLink(item.url)
                    : hasActiveChild(item.items || []);

                  if (item.items) {
                    // Collapsible menu item with subitems
                    return (
                      <Collapsible
                        key={item.title}
                        defaultOpen={hasActiveChild(item.items)}
                        className="group/collapsible"
                      >
                        <CollapsibleTrigger asChild>
                          <button
                            className={`
                              flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium transition-all duration-150 cursor-pointer border border-transparent
                              ${
                                isActive
                                  ? "bg-orange-50 text-orange-700"
                                  : "text-gray-700 hover:bg-gray-50"
                              }
                            `}
                          >
                            <div className="flex items-center gap-3">
                              <item.icon
                                className={`h-4 w-4 ${
                                  isActive ? "text-orange-600" : "text-gray-500"
                                }`}
                              />
                              <span>{item.title}</span>
                            </div>
                            <ChevronDown
                              className={`h-4 w-4 transition-transform duration-150 ${
                                isActive ? "text-orange-600" : "text-gray-400"
                              } group-data-[state=open]/collapsible:rotate-180`}
                            />
                          </button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="transition-all duration-150 ease-in-out overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                          <div className="ml-1 mt-0.5 space-y-0.5 border-l border-gray-200">
                            {item.items.map((subItem) => {
                              const isSubActive = isActiveLink(subItem.url);
                              return (
                                <Link
                                  key={subItem.title}
                                  href={subItem.url}
                                  onClick={handleLinkClick}
                                  className={`
                                    flex items-center gap-3 px-3 py-1.5 text-sm transition-all duration-150 border border-transparent
                                    ${
                                      isSubActive
                                        ? "bg-orange-100 text-orange-700 font-medium"
                                        : "text-gray-600 hover:bg-gray-50"
                                    }
                                  `}
                                >
                                  <subItem.icon
                                    className={`h-4 w-4 ${
                                      isSubActive
                                        ? "text-orange-600"
                                        : "text-gray-400"
                                    }`}
                                  />
                                  <span>{subItem.title}</span>
                                </Link>
                              );
                            })}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  }

                  // Regular menu item
                  return (
                    <Link
                      key={item.title}
                      href={item.url!}
                      onClick={handleLinkClick}
                      className={`
                        flex items-center gap-3 px-3 py-2 text-sm font-medium transition-all duration-150 border border-transparent
                        ${
                          isActive
                            ? "bg-orange-50 text-orange-700"
                            : "text-gray-700 hover:bg-gray-50"
                        }
                      `}
                    >
                      <item.icon
                        className={`h-4 w-4 ${
                          isActive ? "text-orange-600" : "text-gray-500"
                        }`}
                      />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center bg-orange-500">
                  <Image
                    src="/invenza-icon.png"
                    alt="Invenza"
                    width={20}
                    height={20}
                    className="h-5 w-5"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900">
                    INVENZA
                  </span>
                  <span className="text-xs text-gray-500">Dashboard</span>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <div className="border-t border-gray-200 p-2 mt-auto">
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-start gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-700 transition-all duration-150 border border-transparent"
              >
                <LogOut className="h-4 w-4 text-gray-500" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
