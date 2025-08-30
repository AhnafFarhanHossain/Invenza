"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Package, X, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  fileToBase64,
  isValidImageType,
  isValidImageSize,
} from "@/lib/image-utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

// Zod schema for validation
const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  quantity: z.number().min(0, "Quantity cannot be negative"),
  reorderLevel: z.number().min(0, "Reorder level cannot be negative"),
  costPrice: z.number().min(0, "Cost price cannot be negative"),
  sellPrice: z.number().min(0, "Sell price cannot be negative"),
  unit: z.string().min(1, "Unit is required"),
  image: z.string().optional(),
});
type ProductFormData = z.infer<typeof productSchema>;

const categories = [
  "Electronics",
  "Clothing",
  "Food & Beverages",
  "Home & Garden",
  "Sports & Outdoors",
  "Books",
  "Toys & Games",
  "Health & Beauty",
  "Automotive",
  "Other",
];
const units = [
  "pcs",
  "kg",
  "g",
  "lb",
  "oz",
  "l",
  "ml",
  "m",
  "cm",
  "ft",
  "in",
  "box",
  "pack",
  "set",
];

interface AddProductFormProps {
  onSubmit?: (data: ProductFormData) => Promise<void>;
  onCancel?: () => void;
}

export function AddProductForm({ onSubmit, onCancel }: AddProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sku: "",
      description: "",
      category: "",
      quantity: 0,
      reorderLevel: 0,
      costPrice: 0,
      sellPrice: 0,
      unit: "pcs",
      image: undefined,
    },
  });

  // State for image preview
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // Live preview from URL field
  const imageUrl = watch("image");

  // IMPORTANT: register category & unit since Select uses setValue
  // Hidden inputs ensure RHF tracks/validates these fields
  const CategoryHidden = () => (
    <input type="hidden" {...register("category")} />
  );
  const UnitHidden = () => <input type="hidden" {...register("unit")} />;

  // Final submit handler
  const onFormSubmit = async (data: ProductFormData) => {
    try {
      // If parent provided a custom handler, use it
      if (onSubmit) {
        await onSubmit(data);
        return;
      }

      try {
        console.log("Sending product data:", data);
        const res = await axios.post("/api/products", data);
        console.log("Product created successfully:", res.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Failed to create product:", err);
        if (err.response) {
          console.error("Error response:", err.response.data);
          // Handle authentication errors
          if (err.response.status === 401) {
            alert("Your session has expired. Please log in again.");
            router.push("/auth/signin");
            return;
          }
          alert(
            `Error: ${err.response.data.message || "Failed to create product"}`
          );
        } else {
          alert("Network error: Failed to create product");
        }
        return; // Don't reset form or redirect on error
      }

      // Optional: reset form & go back to list
      reset();
      router.push("/dashboard/products");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else router.back();
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset errors
    setImageError(null);

    // Validate file type
    if (!isValidImageType(file)) {
      setImageError("Please upload a valid image file (JPEG, PNG, GIF, WEBP)");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Validate file size (5MB max)
    if (!isValidImageSize(file, 5)) {
      setImageError("Image size must be less than 5MB");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    try {
      // Convert to base64
      const base64 = await fileToBase64(file);

      // Set the base64 string in form state
      setValue("image", base64);

      // Set preview URL
      setImagePreview(base64);
    } catch {
      setImageError("Failed to process image file");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Remove image
  const removeImage = () => {
    setValue("image", undefined);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Package className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-black">ADD NEW PRODUCT</h1>
          <p className="font-mono text-xs text-gray-600">
            Create a new product in your inventory
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* BASIC INFORMATION */}
        <Card className="border border-gray-200 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="font-mono text-sm font-bold text-black">
              BASIC INFORMATION
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="font-mono text-xs font-medium text-black"
                >
                  Product Name *
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Enter product name"
                  className={`font-mono text-xs placeholder:text-gray-500 border-soft-gray ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />
                {errors.name && (
                  <p className="font-mono text-[10px] text-red-600 font-medium">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="sku"
                  className="font-mono text-xs font-medium text-black"
                >
                  SKU
                </Label>
                <Input
                  id="sku"
                  {...register("sku")}
                  placeholder="Enter SKU"
                  className="font-mono text-xs placeholder:text-gray-500 border-soft-gray"
                />
                {errors.sku && (
                  <p className="font-mono text-[10px] text-red-600 font-medium">
                    {errors.sku.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="font-mono text-xs font-medium text-black"
              >
                Description
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Enter product description"
                className="font-mono text-xs placeholder:text-gray-500 border-soft-gray"
                rows={3}
              />
              {errors.description && (
                <p className="font-mono text-[10px] text-red-600 font-medium">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="category"
                className="font-mono text-xs font-medium text-black"
              >
                Category
              </Label>
              <CategoryHidden />
              <Select onValueChange={(value) => setValue("category", value)}>
                <SelectTrigger
                  className={`font-mono text-xs bg-white border border-gray-300 ${
                    errors.category ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue
                    placeholder="Select category"
                    className="text-gray-500"
                  />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300">
                  {categories.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="font-mono text-xs hover:bg-gray-100"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="font-mono text-[10px] text-red-600 font-medium">
                  {errors.category.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* INVENTORY & PRICING */}
        <Card className="border border-gray-200 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="font-mono text-sm font-bold text-black">
              INVENTORY & PRICING
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label
                  htmlFor="quantity"
                  className="font-mono text-xs font-medium text-black"
                >
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  {...register("quantity", { valueAsNumber: true })}
                  placeholder="0"
                  className={`font-mono text-xs placeholder:text-gray-500 bg-white border border-gray-300 ${
                    errors.quantity ? "border-red-500" : ""
                  }`}
                />
                {errors.quantity && (
                  <p className="font-mono text-[10px] text-red-600 font-medium">
                    {errors.quantity.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="reorderLevel"
                  className="font-mono text-xs font-medium text-black"
                >
                  Reorder Level
                </Label>
                <Input
                  id="reorderLevel"
                  type="number"
                  {...register("reorderLevel", { valueAsNumber: true })}
                  placeholder="0"
                  className={`font-mono text-xs placeholder:text-gray-500 bg-white border border-gray-300 ${
                    errors.reorderLevel ? "border-red-500" : ""
                  }`}
                />
                {errors.reorderLevel && (
                  <p className="font-mono text-[10px] text-red-600 font-medium">
                    {errors.reorderLevel.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="unit"
                  className="font-mono text-xs font-medium text-black"
                >
                  Unit
                </Label>
                <UnitHidden />
                <Select
                  onValueChange={(value) => setValue("unit", value)}
                  defaultValue="pcs"
                >
                  <SelectTrigger
                    className={`font-mono text-xs bg-white border border-gray-300 ${
                      errors.unit ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue
                      placeholder="Select unit"
                      className="text-gray-500"
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300">
                    {units.map((unit) => (
                      <SelectItem
                        key={unit}
                        value={unit}
                        className="font-mono text-xs hover:bg-gray-100"
                      >
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.unit && (
                  <p className="font-mono text-[10px] text-red-600 font-medium">
                    {errors.unit.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="costPrice"
                  className="font-mono text-xs font-medium text-black"
                >
                  Cost Price ($)
                </Label>
                <Input
                  id="costPrice"
                  type="number"
                  step="0.01"
                  {...register("costPrice", { valueAsNumber: true })}
                  placeholder="0.00"
                  className={`font-mono text-xs placeholder:text-gray-500 bg-white border border-gray-300 ${
                    errors.costPrice ? "border-red-500" : ""
                  }`}
                />
                {errors.costPrice && (
                  <p className="font-mono text-[10px] text-red-600 font-medium">
                    {errors.costPrice.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="sellPrice"
                  className="font-mono text-xs font-medium text-black"
                >
                  Sell Price ($)
                </Label>
                <Input
                  id="sellPrice"
                  type="number"
                  step="0.01"
                  {...register("sellPrice", { valueAsNumber: true })}
                  placeholder="0.00"
                  className={`font-mono text-xs placeholder:text-gray-500 bg-white border border-gray-300 ${
                    errors.sellPrice ? "border-red-500" : ""
                  }`}
                />
                {errors.sellPrice && (
                  <p className="font-mono text-[10px] text-red-600 font-medium">
                    {errors.sellPrice.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PRODUCT IMAGE UPLOAD */}
        <Card className="border border-gray-200 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="font-mono text-sm font-bold text-black">
              PRODUCT IMAGE
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label className="font-mono text-xs font-medium text-black">
                Upload Image
              </Label>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />

              {/* Upload button */}
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 font-mono text-xs font-medium text-gray-700"
              >
                <Upload className="mr-2 h-4 w-4" />
                Click to upload image
              </Button>

              {imageError && (
                <p className="font-mono text-[10px] text-red-600 font-medium">
                  {imageError}
                </p>
              )}

              <p className="font-mono text-[10px] text-gray-500">
                Supported formats: JPEG, PNG, GIF, WEBP (Max 5MB)
              </p>
            </div>

            {/* Image preview */}
            {(imagePreview || imageUrl) && (
              <div className="relative w-32">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview || imageUrl}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                  onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={removeImage}
                  className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-500 text-white hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ACTIONS */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-orange-500 font-mono text-xs font-medium text-white hover:bg-orange-600 disabled:opacity-50"
          >
            {isSubmitting ? "Creating Product..." : "Create Product"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="flex-1 border-gray-400 font-mono text-xs font-medium text-gray-700 hover:bg-gray-100 bg-white"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
