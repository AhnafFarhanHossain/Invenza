"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Upload, X, Package } from "lucide-react"
import Image from "next/image"
import { useForm } from "react-hook-form"



import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Zod schema for validation
const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().optional(),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  quantity: z.number().min(0, "Quantity cannot be negative"),
  reorderLevel: z.number().min(0, "Reorder level cannot be negative"),
  costPrice: z.number().min(0, "Cost price cannot be negative"),
  sellPrice: z.number().min(0, "Sell price cannot be negative"),
  unit: z.string().min(1, "Unit is required"),
  image: z.string().optional(),
})

type ProductFormData = z.infer<typeof productSchema>

// Category options (you can customize these)
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
]

// Unit options
const units = ["pcs", "kg", "g", "lb", "oz", "l", "ml", "m", "cm", "ft", "in", "box", "pack", "set"]

interface AddProductFormProps {
  onSubmit?: (data: ProductFormData) => Promise<void>
  onCancel?: () => void
}

export function AddProductForm({ onSubmit, onCancel }: AddProductFormProps) {
  const router = useRouter()
  const [imagePreview, setImagePreview] = React.useState<string>("")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
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
      image: "",
    },
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Handle Image Uploadf
  }

  const removeImage = () => {
    setImagePreview("")
    setValue("image", "")
  }

  const onFormSubmit = async (data: ProductFormData) => {
    // Handle Form Submit
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      router.back()
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Package className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-black">ADD NEW PRODUCT</h1>
          <p className="font-mono text-xs text-gray-600">Create a new product in your inventory</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card className="border border-gray-200 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="font-mono text-sm font-bold text-black">BASIC INFORMATION</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-mono text-xs font-medium text-black">
                  Product Name *
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Enter product name"
                  className={`font-mono text-xs placeholder:text-gray-500 ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && <p className="font-mono text-[10px] text-red-600 font-medium">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku" className="font-mono text-xs font-medium text-black">
                  SKU
                </Label>
                <Input
                  id="sku"
                  {...register("sku")}
                  placeholder="Enter SKU"
                  className="font-mono text-xs placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="font-mono text-xs font-medium text-black">
                Description
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Enter product description"
                className="font-mono text-xs placeholder:text-gray-500"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="font-mono text-xs font-medium text-black">
                Category
              </Label>
              <Select onValueChange={(value) => setValue("category", value)}>
                <SelectTrigger className={`font-mono text-xs bg-white border border-gray-300 ${errors.category ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select category" className="text-gray-500" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="font-mono text-xs hover:bg-gray-100">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="font-mono text-[10px] text-red-600 font-medium">{errors.category.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Inventory & Pricing */}
        <Card className="border border-gray-200 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="font-mono text-sm font-bold text-black">INVENTORY & PRICING</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="quantity" className="font-mono text-xs font-medium text-black">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  {...register("quantity", { valueAsNumber: true })}
                  placeholder="0"
                  className={`font-mono text-xs placeholder:text-gray-500 bg-white border border-gray-300 ${errors.quantity ? "border-red-500" : ""}`}
                />
                {errors.quantity && <p className="font-mono text-[10px] text-red-600 font-medium">{errors.quantity.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reorderLevel" className="font-mono text-xs font-medium text-black">
                  Reorder Level
                </Label>
                <Input
                  id="reorderLevel"
                  type="number"
                  {...register("reorderLevel", { valueAsNumber: true })}
                  placeholder="0"
                  className={`font-mono text-xs placeholder:text-gray-500 bg-white border border-gray-300 ${errors.reorderLevel ? "border-red-500" : ""}`}
                />
                {errors.reorderLevel && <p className="font-mono text-[10px] text-red-600 font-medium">{errors.reorderLevel.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit" className="font-mono text-xs font-medium text-black">
                  Unit
                </Label>
                <Select onValueChange={(value) => setValue("unit", value)} defaultValue="pcs">
                  <SelectTrigger className={`font-mono text-xs bg-white border border-gray-300 ${errors.unit ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Select unit" className="text-gray-500" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300">
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit} className="font-mono text-xs hover:bg-gray-100">
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.unit && <p className="font-mono text-[10px] text-red-600 font-medium">{errors.unit.message}</p>}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="costPrice" className="font-mono text-xs font-medium text-black">
                  Cost Price ($)
                </Label>
                <Input
                  id="costPrice"
                  type="number"
                  step="0.01"
                  {...register("costPrice", { valueAsNumber: true })}
                  placeholder="0.00"
                  className={`font-mono text-xs placeholder:text-gray-500 bg-white border border-gray-300 ${errors.costPrice ? "border-red-500" : ""}`}
                />
                {errors.costPrice && <p className="font-mono text-[10px] text-red-600 font-medium">{errors.costPrice.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sellPrice" className="font-mono text-xs font-medium text-black">
                  Sell Price ($)
                </Label>
                <Input
                  id="sellPrice"
                  type="number"
                  step="0.01"
                  {...register("sellPrice", { valueAsNumber: true })}
                  placeholder="0.00"
                  className={`font-mono text-xs placeholder:text-gray-500 bg-white border border-gray-300 ${errors.sellPrice ? "border-red-500" : ""}`}
                />
                {errors.sellPrice && <p className="font-mono text-[10px] text-red-600 font-medium">{errors.sellPrice.message}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Image */}
        <Card className="border border-gray-200 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="font-mono text-sm font-bold text-black">PRODUCT IMAGE</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!imagePreview ? (
                <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="mt-2">
                      <Label htmlFor="image" className="cursor-pointer">
                        <span className="font-mono text-xs font-medium text-orange-500 hover:text-orange-600">
                          Upload an image
                        </span>
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </Label>
                    </div>
                    <p className="font-mono text-[10px] text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  import Image from "next/image"

                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Product Preview"
                    width={128}
                    height={128}
                    className="w-32 rounded-lg border border-gray-200"
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
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
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
  )
}
