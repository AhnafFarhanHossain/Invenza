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
          className="w-[260px] bg-white p-0 transition-transform duration-300 ease-in-out font-mono"
        >
          {/* Header */}
          <div className="p-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-light-base/80">
                <Image
                  src="/invenza-icon.png"
                  alt="Invenza"
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-dark-base">
                  INVENZA
                </span>
                <span className="text-[10px] font-medium text-dark-base/100">
                  ADMIN
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex h-full flex-col bg-white">
            <nav className="flex-1 space-y-1 p-3">
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
                            flex w-full items-center justify-between rounded-none px-3 py-2 text-left text-xs font-medium transition-all duration-200
                            ${
                              isActive
                                ? "bg-orange-500 text-white"
                                : "text-gray-900 hover:bg-orange-50 hover:text-orange-600"
                            }
                          `}
                        >
                          <div className="flex items-center gap-2.5">
                            <item.icon className="h-3.5 w-3.5" />
                            <span>{item.title}</span>
                          </div>
                          <ChevronDown className="h-3 w-3 transition-transform duration-300 group-data-[state=open]/collapsible:rotate-180" />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="transition-all duration-300 ease-in-out">
                        <div className="ml-4 mt-1 space-y-0.5">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.title}
                              href={subItem.url}
                              onClick={handleLinkClick}
                              className={`
                                flex items-center gap-2.5 rounded-none px-3 py-1.5 text-xs transition-all duration-200
                                ${
                                  isActiveLink(subItem.url)
                                    ? "bg-orange-500 text-white"
                                    : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                                }
                              `}
                            >
                              <subItem.icon className="h-3 w-3" />
                              <span>{subItem.title}</span>
                            </Link>
                          ))}
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
                      flex items-center gap-2.5 rounded-none px-3 py-2 text-xs font-medium transition-all duration-200
                      ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-gray-900 hover:bg-orange-50 hover:text-orange-600"
                      }
                    `}
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Logout Button */}
            <div className="border-t border-gray-100 p-3">
              <Button
                onClick={handleLogout}
                variant={"destructive"}
                size={"default"}
                className="w-full"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
