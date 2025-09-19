"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart,
  Box,
  ChevronDown,
  Home,
  LogOut,
  Package,
  PanelRightOpen,
  PlusSquare,
  Settings,
  ShoppingCart,
  User,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
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
    url: "/dashboard/settings",
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
          className="w-[260px] bg-white p-0 transition-all duration-300 ease-in-out border-r border-gray-200 [&>button]:hidden"
        >
          {/* Navigation */}
          <div className="flex h-full flex-col bg-white">
            {/* Header */}
            <div className="border-b border-gray-200 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center bg-primary/10 rounded-none">
                  <Image
                    src="/invenza-icon.png"
                    alt="Invenza"
                    width={20}
                    height={20}
                    className="h-5 w-5"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-light text-black tracking-wider">
                    INVENZA
                  </span>
                  <span className="text-[10px] text-gray-500 font-light">
                    Dashboard
                  </span>
                </div>
              </div>
            </div>

            <nav className="flex-1 py-3 px-3">
              <div className="space-y-1">
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
                              flex w-full items-center justify-between px-3 py-2 text-left text-xs font-light transition-all duration-150 cursor-pointer border border-transparent rounded-none
                              ${
                                isActive
                                  ? "bg-orange-50 text-[#ff6b00] border-orange-200"
                                  : "text-black hover:bg-gray-50 hover:border-gray-200"
                              }
                            `}
                          >
                            <div className="flex items-center gap-3">
                              <item.icon
                                className={`h-4 w-4 ${
                                  isActive ? "text-[#ff6b00]" : "text-gray-500"
                                }`}
                              />
                              <span className="tracking-wide">{item.title}</span>
                            </div>
                            <ChevronDown
                              className={`h-4 w-4 transition-transform duration-150 ${
                                isActive ? "text-[#ff6b00]" : "text-gray-500"
                              } group-data-[state=open]/collapsible:rotate-180`}
                            />
                          </button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="transition-all duration-150 ease-in-out overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                          <div className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-3">
                            {item.items.map((subItem) => {
                              const isSubActive = isActiveLink(subItem.url);
                              return (
                                <Link
                                  key={subItem.title}
                                  href={subItem.url}
                                  onClick={handleLinkClick}
                                  className={`
                                    flex items-center gap-3 px-3 py-1.5 text-xs font-light transition-all duration-150 border border-transparent rounded-none
                                    ${
                                      isSubActive
                                        ? "bg-orange-50 text-[#ff6b00] border-orange-200"
                                        : "text-black hover:bg-gray-50 hover:border-gray-200"
                                    }
                                  `}
                                >
                                  <subItem.icon
                                    className={`h-4 w-4 ${
                                      isSubActive
                                        ? "text-[#ff6b00]"
                                        : "text-gray-500"
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
                        flex items-center gap-3 px-3 py-2 text-xs font-light transition-all duration-150 border border-transparent rounded-none
                        ${
                          isActive
                            ? "bg-orange-50 text-[#ff6b00] border-orange-200"
                            : "text-black hover:bg-gray-50 hover:border-gray-200"
                        }
                      `}
                    >
                      <item.icon
                        className={`h-4 w-4 ${
                          isActive ? "text-[#ff6b00]" : "text-gray-500"
                        }`}
                      />
                      <span className="tracking-wide">{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Close Button */}
            <div className="border-t border-gray-200 p-3">
              <SheetClose className="flex items-center justify-center w-full h-10 hover:bg-gray-50 cursor-pointer border border-gray-200 hover:border-orange-200 transition-all duration-150 rounded-none">
                <PanelRightOpen className="h-4 w-4 text-gray-500" />
                <span className="ml-2 text-xs text-black font-light tracking-wide">Close</span>
              </SheetClose>
            </div>

            {/* Logout Button */}
            <div className="border-t border-gray-200 p-3 mt-auto">
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-start gap-3 px-3 py-2 text-xs font-light text-black hover:bg-red-50 hover:text-red-700 transition-all duration-150 border border-transparent hover:border-red-200 rounded-none"
              >
                <LogOut className="h-4 w-4 text-gray-500" />
                <span className="tracking-wide">Logout</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
