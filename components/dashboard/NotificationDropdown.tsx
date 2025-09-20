"use client";

import { useEffect, useState } from "react";
import { Bell, Package, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import toast from "react-hot-toast";

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

  // Effect to mark all notifications as read when dropdown is opened
  useEffect(() => {
    if (open) {
      const markAllAsRead = async () => {
        try {
          // Get all unread notifications
          const response = await fetch("/api/notifications?unreadOnly=true&limit=100");
          if (response.ok) {
            const data = await response.json();
            if (data.notifications && data.notifications.length > 0) {
              // Mark all as read
              await Promise.all(
                data.notifications.map((n: Notification) => 
                  fetch(`/api/notifications/${n._id}/read`, { method: "PATCH" })
                )
              );
              
              // Update local state to reflect read status
              setNotifications(prevNotifications => 
                prevNotifications.map(n => ({ ...n, read: true }))
              );
            }
          }
        } catch (error) {
          console.error("Error marking notifications as read:", error);
        }
      };
      
      markAllAsRead();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    fetch("/api/notifications?limit=10")
      .then((r) => r.json())
      .then((d) => setNotifications(d.notifications));
  }, [open]);

  // Effect to show the latest notification as a toast when it's unread
  useEffect(() => {
    const fetchAndShowLatestNotification = async () => {
      try {
        const response = await fetch("/api/notifications?unreadOnly=true&limit=1");
        if (response.ok) {
          const data = await response.json();
          if (data.notifications && data.notifications.length > 0) {
            const latestNotification = data.notifications[0];
            
            // Only show toast if notification is unread
            if (!latestNotification.read) {
              // Map notification type to appropriate icon
              const getNotificationIcon = (type: string) => {
                switch (type) {
                  case "low_stock":
                    return <Package className="h-4 w-4" />;
                  case "new_order":
                    return <ShoppingCart className="h-4 w-4" />;
                  default:
                    return null;
                }
              };

              // Show toast with notification content
              toast(
                (t) => (
                  <div 
                    className="flex items-start gap-3 p-2 cursor-pointer"
                    onClick={() => {
                      toast.dismiss(t.id);
                    }}
                  >
                    <div className="p-1.5 rounded bg-[#ff6b00]/10">
                      {getNotificationIcon(latestNotification.type)}
                    </div>
                    <div>
                      <p className="text-sm font-light text-black">{latestNotification.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{latestNotification.message}</p>
                    </div>
                  </div>
                ),
                {
                  duration: 5000,
                  position: "top-right",
                  style: {
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0",
                  },
                  className: "font-mono",
                }
              );
            }
          }
        }
      } catch (error) {
        console.error("Error fetching latest notification:", error);
      }
    };

    // Check for latest notification every 30 seconds
    const intervalId = setInterval(fetchAndShowLatestNotification, 30000);
    
    // Initial check when component mounts
    fetchAndShowLatestNotification();
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

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
