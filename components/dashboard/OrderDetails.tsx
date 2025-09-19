"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { base64ToObjectUrl } from "@/lib/image-utils";

interface OrderItem {
  product: {
    _id: string;
    name: string;
    image?: string;
  };
  quantity: number;
  price: number;
  _id: string;
}

interface OrderItemsListProps {
  items: OrderItem[];
}

export default function OrderItemsList({ items }: OrderItemsListProps) {
  // Build a map of itemId -> resolved image URL (http/https/relative as-is, data URL converted to blob:)
  const [imageSrcMap, setImageSrcMap] = useState<Record<string, string>>({});

  const isDataImage = (src?: string) => !!src && src.startsWith("data:image/");
  const looksLikeUrl = (src?: string) =>
    !!src && /^(https?:\/\/|\/|\.\/|\.\.\/)/i.test(src);

  useEffect(() => {
    const looksLikeRawBase64 = (src?: string) =>
      !!src &&
      !looksLikeUrl(src) &&
      /^[A-Za-z0-9+/=]+$/.test(src) &&
      src.length > 100;

    const toDataUrl = (src: string) =>
      isDataImage(src) ? src : `data:image/png;base64,${src}`;

    const nextMap: Record<string, string> = {};
    const toRevoke: string[] = [];

    for (const item of items) {
      const img = item.product?.image;
      if (!img) continue;
      if (isDataImage(img) || looksLikeRawBase64(img)) {
        try {
          const dataUrl = toDataUrl(img);
          const url = base64ToObjectUrl(dataUrl);
          nextMap[item._id] = url;
          toRevoke.push(url);
        } catch {
          // Fallback to original string if conversion fails
          nextMap[item._id] = img;
        }
      } else if (looksLikeUrl(img)) {
        nextMap[item._id] = img;
      } else {
        // Unknown format; try to render as-is
        nextMap[item._id] = img;
      }
    }

    setImageSrcMap(nextMap);
    return () => {
      for (const url of toRevoke) {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // ignore
        }
      }
    };
  }, [items]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item._id}
          className="flex items-center gap-4 p-4 rounded-lg bg-white border border-slate-200 hover:border-slate-300 transition-colors duration-200"
        >
          {/* Product Image */}
          <div className="relative flex-shrink-0">
            {item?.product && imageSrcMap[item._id] ? (
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                {imageSrcMap[item._id].startsWith("blob:") ? (
                  <Image
                    src={imageSrcMap[item._id]}
                    alt={item.product?.name ?? "Product image"}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <Image
                    src={imageSrcMap[item._id]}
                    alt={item.product?.name ?? "Product image"}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                )}
              </div>
            ) : (
              <div className="w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                <div className="w-6 h-6 bg-slate-300 rounded opacity-60" />
              </div>
            )}

            {/* Quantity Badge */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-900 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm">
              {item.quantity}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-900 truncate">
              {item.product?.name ?? "Unknown product"}
            </h4>
            <p className="text-sm text-slate-500 mt-1">
              {formatCurrency(item.price)} each
            </p>
          </div>

          {/* Price Information */}
          <div className="text-right flex-shrink-0">
            <div className="text-lg font-semibold text-slate-900">
              {formatCurrency(item.price * item.quantity)}
            </div>
            <div className="text-xs text-slate-500">
              {item.quantity} × {formatCurrency(item.price)}
            </div>
          </div>
        </div>
      ))}

      {/* Total Summary at Bottom */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="flex justify-between items-center">
          <span className="text-slate-600">
            Total for {items.length} item{items.length !== 1 ? "s" : ""}
          </span>
          <span className="text-xl font-bold text-slate-900">
            {formatCurrency(
              items.reduce((sum, item) => sum + item.price * item.quantity, 0)
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
