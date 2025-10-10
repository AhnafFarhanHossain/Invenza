"use client";

import { useState, useEffect } from "react";
import { Building2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";

interface BusinessData {
  exists: boolean;
  businessName: string;
  address: string;
  phone: string;
  email: string;
  currency: string;
  weightUnit: string;
  lowStockThreshold: number;
}

export default function BusinessSection() {
  const [data, setData] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<BusinessData>>({});

  useEffect(() => {
    fetchBusinessData();
  }, []);

  const fetchBusinessData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/settings/business");
      const businessData = await response.json();
      setData(businessData);
      setFormData(businessData);
    } catch (error) {
      console.error("Failed to fetch business data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/settings/business", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsEditing(false);
        fetchBusinessData(); // Refresh data
      }
    } catch (error) {
      console.error("Failed to save business data:", error);
      toast.error("Failed to save business details");
    }
  };

  const handleCancel = () => {
    setFormData(data || {});
    setIsEditing(false);
  };

  if (loading) {
    return <Skeleton className="h-32 w-full" />;
  }

  if (!data) {
    return <div>Error loading business settings</div>;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-none p-4 md:p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4 md:mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-50 flex items-center justify-center rounded-none">
            <Building2 className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
          </div>
          <div>
            <h3 className="font-medium text-base md:text-lg">
              Business Information
            </h3>
            <p className="text-xs text-gray-500 font-mono mt-0.5">
              Manage your business profile and settings
            </p>
          </div>
        </div>

        {!isEditing && data.exists && (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="px-3 md:px-4 py-2 text-sm"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit Details
          </Button>
        )}
      </div>

      {/* Content Section */}
      <div className="space-y-4 md:space-y-6">
        {!isEditing && !data.exists ? (
          // Empty state - no business details yet
          <div className="text-center py-8 md:py-10">
            <div className="mx-auto w-12 h-12 md:w-16 md:h-16 bg-orange-50 flex items-center justify-center rounded-none mb-4 md:mb-6">
              <Building2 className="w-6 h-6 md:w-8 md:h-8 text-orange-500" />
            </div>
            <h3 className="font-medium text-base md:text-lg mb-3">
              No Business Information
            </h3>
            <p className="text-gray-500 text-xs md:text-sm font-mono mb-4 md:mb-6 max-w-md mx-auto">
              You haven't added any business details yet. Adding this
              information will help personalize your experience.
            </p>
            <Button
              onClick={() => setIsEditing(true)}
              className="px-4 md:px-6 py-2.5 text-sm"
            >
              Add Business Details
            </Button>
          </div>
        ) : !isEditing ? (
          // Display mode - business details exist
          <div className="space-y-3 md:space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
              <div className="bg-gray-50 rounded-none p-3 md:p-5">
                <div className="flex flex-col gap-1">
                  <Label className="text-xs text-gray-500 uppercase tracking-wider font-light">
                    Business Name
                  </Label>
                  <p className="font-medium text-black text-sm md:text-base ">
                    {data.businessName || "Not set"}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-none p-3 md:p-5">
                <div className="flex flex-col gap-1">
                  <Label className="text-xs text-gray-500 uppercase tracking-wider font-light">
                    Currency
                  </Label>
                  <p className="font-medium text-black text-sm md:text-base ">
                    {data.currency}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-none p-3 md:p-5">
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-gray-500 uppercase tracking-wider font-light">
                  Address
                </Label>
                <p className="font-medium text-black text-sm md:text-base ">
                  {data.address || "Not provided"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
              {data.phone && (
                <div className="bg-gray-50 rounded-none p-3 md:p-5">
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs text-gray-500 uppercase tracking-wider font-light">
                      Phone
                    </Label>
                    <p className="font-medium text-black text-sm md:text-base ">
                      {data.phone}
                    </p>
                  </div>
                </div>
              )}

              {data.email && (
                <div className="bg-gray-50 rounded-none p-3 md:p-5">
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs text-gray-500 uppercase tracking-wider font-light">
                      Email
                    </Label>
                    <p className="font-medium text-black text-sm md:text-base ">
                      {data.email}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Edit mode
          <div className="space-y-4 md:space-y-6">
            <div className="bg-orange-50 rounded-none p-3 md:p-5">
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
                <h3 className="font-medium text-base md:text-lg">
                  Edit Business Information
                </h3>
              </div>
              <p className="text-xs text-gray-500 font-mono mt-1">
                Update your business details below
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="businessName"
                  className="text-xs text-gray-500 uppercase tracking-wider font-light"
                >
                  Business Name
                </Label>
                <Input
                  id="businessName"
                  value={formData.businessName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, businessName: e.target.value })
                  }
                  placeholder="Your business name"
                  className="border border-gray-200 rounded-none focus:outline-none focus:ring-1 focus:ring-orange-500 font-light text-sm md:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="currency"
                  className="text-xs text-gray-500 uppercase tracking-wider font-light"
                >
                  Currency
                </Label>
                <Select
                  value={formData.currency || "USD"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, currency: value })
                  }
                >
                  <SelectTrigger className="border border-gray-200 rounded-none focus:outline-none focus:ring-1 focus:ring-orange-500 font-light text-sm md:text-base">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                    <SelectItem value="BDT">BDT (৳)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="address"
                  className="text-xs text-gray-500 uppercase tracking-wider font-light"
                >
                  Address (Optional)
                </Label>
                <textarea
                  id="address"
                  value={formData.address || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Business address"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-none focus:outline-none focus:ring-1 focus:ring-orange-500 font-light resize-none text-sm md:text-base"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-xs text-gray-500 uppercase tracking-wider font-light"
                  >
                    Phone (Optional)
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="Phone number"
                    className="border border-gray-200 rounded-none focus:outline-none focus:ring-1 focus:ring-orange-500 font-light text-sm md:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-xs text-gray-500 uppercase tracking-wider font-light"
                  >
                    Email (Optional)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Business email"
                    className="border border-gray-200 rounded-none focus:outline-none focus:ring-1 focus:ring-orange-500 font-light text-sm md:text-base"
                  />
                </div>
              </div>

              <div className="flex gap-2 md:gap-3 pt-2 md:pt-4">
                <Button
                  onClick={handleSave}
                  className="px-4 md:px-5 py-2.5 text-sm"
                >
                  Save Details
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="px-4 md:px-5 py-2.5 text-sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
