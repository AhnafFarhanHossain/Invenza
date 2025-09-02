"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ShoppingCart, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  sellPrice: number;
  quantity: number;
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

const AddOrderForm = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get("/api/products");
        if (response.status === 200) {
          setProducts(response.data.products || []);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    }
    fetchProducts();
  }, []);

  const totalAmount = orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const selectedProduct = products.find((p) => p._id === selectedProductId);

  const addItemToOrder = () => {
    if (!selectedProduct || quantity <= 0) return;
    const existingItemIndex = orderItems.findIndex(
      (item) => item.productId === selectedProductId
    );
    if (existingItemIndex >= 0) {
      const updatedItems = [...orderItems];
      updatedItems[existingItemIndex].quantity += quantity;
      setOrderItems(updatedItems);
    } else {
      setOrderItems((prev) => [
        ...prev,
        {
          productId: selectedProductId,
          name: selectedProduct.name,
          price: selectedProduct.sellPrice,
          quantity: quantity,
        },
      ]);
    }
    setSelectedProductId("");
    setQuantity(1);
  };

  const removeItem = (index: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const submitOrder = async () => {
    if (!customerName || !customerEmail || orderItems.length === 0) {
      alert("Please fill all required fields and add at least one item.");
      return;
    }

    const requestBody = {
      customerName,
      customerEmail,
      items: orderItems.map((item) => ({
        productId: item.productId, // Send the ID
        quantity: item.quantity, // Send the quantity
      })),
    };

    try {
      setIsSubmitting(true);
      const response = await axios.post("/api/orders", requestBody);
      if (response.status === 201) {
        toast.success("Order created successfully!");
        router.push("/dashboard/orders");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <ShoppingCart className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-black font-mono">
            CREATE NEW ORDER
          </h1>
          <p className="font-mono text-xs text-gray-600">
            Create a new order for your customer
          </p>
        </div>
      </div>

      {/* Customer Information */}
      <Card className="border border-gray-200 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="font-mono text-sm font-bold text-black">
            CUSTOMER INFORMATION
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="customerName"
                className="font-mono text-xs font-medium text-black"
              >
                Customer Name *
              </Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                className="font-mono text-xs placeholder:text-gray-500 bg-white border border-gray-300"
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="customerEmail"
                className="font-mono text-xs font-medium text-black"
              >
                Customer Email *
              </Label>
              <Input
                id="customerEmail"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Enter customer email"
                className="font-mono text-xs placeholder:text-gray-500 bg-white border border-gray-300"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Products */}
      <Card className="border border-gray-200 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="font-mono text-sm font-bold text-black">
            ADD PRODUCTS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label
                htmlFor="product"
                className="font-mono text-xs font-medium text-black"
              >
                Select Product
              </Label>
              <Select
                value={selectedProductId}
                onValueChange={setSelectedProductId}
              >
                <SelectTrigger className="font-mono text-xs bg-white border border-gray-300">
                  <SelectValue
                    placeholder="Choose a product"
                    className="text-gray-500"
                  />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300">
                  {products.map((product) => (
                    <SelectItem
                      key={product._id}
                      value={product._id}
                      className="font-mono text-xs hover:bg-gray-100"
                    >
                      {product.name} - ${product.sellPrice}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="font-mono text-xs placeholder:text-gray-500 bg-white border border-gray-300"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={addItemToOrder}
                disabled={!selectedProductId || quantity <= 0}
                className="w-full bg-orange-500 font-mono text-xs font-medium text-white hover:bg-orange-600 disabled:opacity-50"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add to Order
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      {orderItems.length > 0 && (
        <Card className="border border-gray-200 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="font-mono text-sm font-bold text-black">
              ORDER ITEMS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-mono">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-mono">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-mono">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-mono">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-mono">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orderItems.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-mono">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button
                          onClick={() => removeItem(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-900 hover:bg-red-50 font-mono text-xs"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Total Amount */}
      {orderItems.length > 0 && (
        <Card className="border border-gray-200 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="font-mono text-sm font-bold text-black">
              ORDER TOTAL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 font-mono">
                Total Amount:{" "}
                <span className="text-blue-600">${totalAmount.toFixed(2)}</span>
              </h3>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          onClick={submitOrder}
          disabled={
            isSubmitting ||
            !customerName ||
            !customerEmail ||
            orderItems.length === 0
          }
          className="flex-1 bg-orange-500 font-mono text-xs font-medium text-white hover:bg-orange-600 disabled:opacity-50"
        >
          {isSubmitting ? "Creating Order..." : "Create Order"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="flex-1 border-gray-400 font-mono text-xs font-medium text-gray-700 hover:bg-gray-100 bg-white"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default AddOrderForm;
