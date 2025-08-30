"use client";

import React, { useState } from "react";
import { ActivityBar } from "@/components/dashboard/ActivityBar";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAddProduct = () => {
    router.push("/dashboard/products/new");
  };

  const handleSignOut = async () => {
    try {
      await axios.post("/api/auth/logout");
      // Clear user data from localStorage
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      router.push("/auth/signin");
      toast.success("Logged out successfully");
    } catch {
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar
        isOpen={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />
      <div className="flex-1 flex flex-col">
        <ActivityBar
          onSidebarToggle={handleSidebarToggle}
          onAddProduct={handleAddProduct}
          onSignOut={handleSignOut}
        />
        <main className="mt-14 flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
