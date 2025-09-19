"use client";

import { useEffect, useState } from "react";
import { Bell, Package, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    fetch("/api/notifications?limit=10")
      .then((r) => r.json())
      .then((d) => setNotifications(d.notifications));
  }, [open]);

  const markAsRead = async (id: string) => {
    await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const iconMap: Record<string, React.ReactNode> = {
    low_stock: <Package className="h-4 w-4" />,
    new_order: <ShoppingCart className="h-4 w-4" />,
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#ff6b00] text-white rounded-full text-xs w-4 h-4 flex items-center justify-center font-light">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-white border border-gray-200 rounded-none shadow-lg" align="end">
        <div className="p-2 space-y-1 max-h-80 overflow-auto">
          {notifications.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4 font-light tracking-wider">
              NO NOTIFICATIONS
            </p>
          )}
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`px-4 py-3 rounded-none border border-gray-200 cursor-pointer transition-colors ${
                n.read ? "bg-gray-50" : "bg-white"
              } hover:bg-gray-50`}
              onClick={() => markAsRead(n._id)}
            >
              <div className="flex items-start gap-3">
                <div className={`p-1.5 rounded ${n.read ? "bg-orange-50" : "bg-[#ff6b00]/10"}`}>
                  {iconMap[n.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-light text-black">{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1.5 font-mono">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
