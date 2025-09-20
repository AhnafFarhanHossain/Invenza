"use client";

import React, { useState, useRef, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { Package, X, Upload } from "lucide-react";
import {
  useForm,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  FieldErrors,
} from "react-hook-form";
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

interface EditProductFormProps {
  product: ProductFormData & { _id: string };
  onSubmit?: (data: ProductFormData) => Promise<void>;
  onCancel?: () => void;
}

interface ImageUploadSectionProps {
  watch: UseFormWatch<ProductFormData>;
  imageError: string | null;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

interface BasicInfoSectionProps {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
  product: ProductFormData & { _id: string };
}

interface InventoryPricingSectionProps {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
  product: ProductFormData & { _id: string };
}

// Optimized sub-components
const ImageUploadSection = memo(
  ({
    watch,
    imageError,
    handleFileUpload,
    removeImage,
    fileInputRef,
  }: ImageUploadSectionProps) => (
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

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 font-mono text-xs font-medium text-gray-700"
          >
            <Upload className="mr-2 h-4 w-4" />
            {watch("image") ? "Replace image" : "Upload new image"}
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

        {watch("image") && (
          <div className="relative w-32">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={watch("image")}
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
  )
);

ImageUploadSection.displayName = "ImageUploadSection";

const BasicInfoSection = memo(
  ({ register, errors, setValue, product }: BasicInfoSectionProps) => (
    <Card className="border border-gray-200 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="font-mono text-sm font-bold text-black">
          BASIC INFORMATION
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="font-mono text-xs font-medium text-black">
              Product Name *
            </Label>
            <Input
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
            <Label className="font-mono text-xs font-medium text-black">
              SKU
            </Label>
            <Input
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
          <Label className="font-mono text-xs font-medium text-black">
            Description
          </Label>
          <Textarea
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
          <Label className="font-mono text-xs font-medium text-black">
            Category
          </Label>
          <input type="hidden" {...register("category")} />
          <Select
            onValueChange={(value: string) => setValue("category", value)}
            defaultValue={product.category}
          >
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
  )
);

BasicInfoSection.displayName = "BasicInfoSection";

const InventoryPricingSection = memo(
  ({ register, errors, setValue, product }: InventoryPricingSectionProps) => (
    <Card className="border border-gray-200 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="font-mono text-sm font-bold text-black">
          INVENTORY & PRICING
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label className="font-mono text-xs font-medium text-black">
              Quantity
            </Label>
            <Input
              type="number"
              {...register("quantity", { valueAsNumber: true })}
              placeholder="0"
              className={`font-mono text-xs placeholder:text-gray-500 bg-white border border-gray-300 ${
                errors.quantity ? "border-red-500" : ""
              }`}
              onWheel={(e) => e.currentTarget.blur()}
            />
            {errors.quantity && (
              <p className="font-mono text-[10px] text-red-600 font-medium">
                {errors.quantity.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="font-mono text-xs font-medium text-black">
              Reorder Level
            </Label>
            <Input
              type="number"
              {...register("reorderLevel", { valueAsNumber: true })}
              placeholder="0"
              className={`font-mono text-xs placeholder:text-gray-500 bg-white border border-gray-300 ${
                errors.reorderLevel ? "border-red-500" : ""
              }`}
              onWheel={(e) => e.currentTarget.blur()}
            />
            {errors.reorderLevel && (
              <p className="font-mono text-[10px] text-red-600 font-medium">
                {errors.reorderLevel.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="font-mono text-xs font-medium text-black">
              Unit
            </Label>
            <input type="hidden" {...register("unit")} />
            <Select
              onValueChange={(value: string) => setValue("unit", value)}
              defaultValue={product.unit}
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
            <Label className="font-mono text-xs font-medium text-black">
              Cost Price ($)
            </Label>
            <Input
              type="number"
              step="0.01"
              {...register("costPrice", { valueAsNumber: true })}
              placeholder="0.00"
              className={`font-mono text-xs placeholder:text-gray-500 bg-white border border-gray-300 ${
                errors.costPrice ? "border-red-500" : ""
              }`}
              onWheel={(e) => e.currentTarget.blur()}
            />
            {errors.costPrice && (
              <p className="font-mono text-[10px] text-red-600 font-medium">
                {errors.costPrice.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="font-mono text-xs font-medium text-black">
              Sell Price ($)
            </Label>
            <Input
              type="number"
              step="0.01"
              {...register("sellPrice", { valueAsNumber: true })}
              placeholder="0.00"
              className={`font-mono text-xs placeholder:text-gray-500 bg-white border border-gray-300 ${
                errors.sellPrice ? "border-red-500" : ""
              }`}
              onWheel={(e) => e.currentTarget.blur()}
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
  )
);

InventoryPricingSection.displayName = "InventoryPricingSection";

export function EditProductForm({
  product,
  onSubmit,
  onCancel,
}: EditProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
        defaultValues: product,
  });

  const onFormSubmit = useCallback(
    async (data: ProductFormData) => {
      try {
        if (onSubmit) {
          await onSubmit(data);
          return;
        }

        try {
          await axios.put(`/api/products/${product._id}`, data);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          if (err.response?.status === 401) {
            alert("Your session has expired. Please log in again.");
            router.push("/auth/signin");
            return;
          }
          alert(
            `Error: ${
              err.response?.data?.message || "Failed to update product"
            }`
          );
        }

        router.push("/dashboard/products");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        alert(err.message || "Something went wrong");
      }
    },
    [onSubmit, product._id, router]
  );

  const handleCancel = useCallback(() => {
    if (onCancel) onCancel();
    else router.back();
  }, [onCancel, router]);

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setImageError(null);

      if (!isValidImageType(file)) {
        setImageError(
          "Please upload a valid image file (JPEG, PNG, GIF, WEBP)"
        );
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      if (!isValidImageSize(file, 5)) {
        setImageError("Image size must be less than 5MB");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      try {
        const base64 = await fileToBase64(file);
        setValue("image", base64);
      } catch {
        setImageError("Failed to process image file");
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [setValue]
  );

  const removeImage = useCallback(() => {
    setValue("image", undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [setValue]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Package className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-black">EDIT PRODUCT</h1>
          <p className="font-mono text-xs text-gray-600">
            Update product details in your inventory
          </p>
                </div>
      </div>

      {!isDirty && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <p className="font-bold">No changes made</p>
          <p>You need to make changes to the product before you can update it.</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <BasicInfoSection
          register={register}
          errors={errors}
          setValue={setValue}
          product={product}
        />

        <InventoryPricingSection
          register={register}
          errors={errors}
          setValue={setValue}
          product={product}
        />

        <ImageUploadSection
          watch={watch}
          imageError={imageError}
          handleFileUpload={handleFileUpload}
          removeImage={removeImage}
          fileInputRef={fileInputRef}
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={!isDirty || isSubmitting}
            className="flex-1 bg-orange-500 font-mono text-xs font-medium text-white hover:bg-orange-600 disabled:opacity-50"
          >
            {isSubmitting ? "Updating Product..." : "Update Product"}
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
