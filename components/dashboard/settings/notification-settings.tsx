"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Bell,
  AlertTriangle,
  ShoppingCart,
  Package,
  HelpCircle,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import toast from "react-hot-toast";
import axios from "axios";

interface NotificationPreferences {
  lowStockNotifications: boolean;
  newOrderNotification: boolean;
  outOfStockNotification: boolean;
}

const NotificationSettings = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    lowStockNotifications: true,
    newOrderNotification: true,
    outOfStockNotification: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalPreferences, setOriginalPreferences] =
    useState<NotificationPreferences>({
      lowStockNotifications: true,
      newOrderNotification: true,
      outOfStockNotification: true,
    });

  // Fetch user preferences on component mount
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/user/preferences");
        if (response.data && response.data.preferences) {
          const prefs = response.data.preferences;
          // Ensure all preference values are booleans with defaults
          const safePrefs: NotificationPreferences = {
            lowStockNotifications: Boolean(prefs.lowStockNotifications ?? true),
            newOrderNotification: Boolean(prefs.newOrderNotification ?? true),
            outOfStockNotification: Boolean(
              prefs.outOfStockNotification ?? true
            ),
          };
          setPreferences(safePrefs);
          setOriginalPreferences(safePrefs);
        }
      } catch (error) {
        console.error("Failed to fetch preferences:", error);
        toast.error("Failed to load notification preferences");
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  const handleToggle = (key: keyof NotificationPreferences) => {
    // Optimistic UI update
    const newPreferences = {
      ...preferences,
      [key]: !preferences[key],
    };
    setPreferences(newPreferences);

    // Show immediate feedback
    const notificationTypeMap = {
      lowStockNotifications: "Low Stock",
      newOrderNotification: "New Order",
      outOfStockNotification: "Out of Stock",
    };

    const notificationType = notificationTypeMap[key];
    const isEnabled = newPreferences[key];

    toast.success(
      `${notificationType} notifications ${isEnabled ? "enabled" : "disabled"}`,
      {
        duration: 2000,
        style: {
          backgroundColor: isEnabled ? "#f0fdf4" : "#fef2f2",
          border: `1px solid ${isEnabled ? "#10b981" : "#ef4444"}`,
          borderRadius: "0",
        },
        className: "font-mono",
      }
    );
  };

  const savePreferences = useCallback(async () => {
    try {
      setSaving(true);
      await axios.patch("/api/user/preferences", {
        preferences: preferences,
      });
      setOriginalPreferences(preferences);

      // Enhanced success feedback
      toast.success("Notification preferences saved successfully!", {
        duration: 3000,
        style: {
          backgroundColor: "#f0fdf4",
          border: "1px solid #10b981",
          borderRadius: "0",
        },
        className: "font-mono",
      });
    } catch (error) {
      console.error("Failed to save preferences:", error);

      // Revert optimistic updates on error
      setPreferences(originalPreferences);

      toast.error(
        "Failed to save notification preferences. Please try again.",
        {
          duration: 4000,
          style: {
            backgroundColor: "#fef2f2",
            border: "1px solid #ef4444",
            borderRadius: "0",
          },
          className: "font-mono",
        }
      );
    } finally {
      setSaving(false);
    }
  }, [preferences, originalPreferences]);

  const resetPreferences = useCallback(() => {
    setPreferences(originalPreferences);
    toast("Preferences reset to last saved values", {
      duration: 2000,
      style: {
        backgroundColor: "#f3f4f6",
        border: "1px solid #6b7280",
        borderRadius: "0",
      },
      className: "font-mono",
    });
  }, [originalPreferences]);

  // Check if there are unsaved changes
  useEffect(() => {
    const hasChanges =
      preferences.lowStockNotifications !==
        originalPreferences.lowStockNotifications ||
      preferences.newOrderNotification !==
        originalPreferences.newOrderNotification ||
      preferences.outOfStockNotification !==
        originalPreferences.outOfStockNotification;

    setHasChanges(hasChanges);
  }, [preferences, originalPreferences]);

  // Keyboard shortcuts for save and reset
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + S to save
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        if (hasChanges && !saving) {
          savePreferences();
        }
      }
      // Escape to reset
      if (event.key === "Escape") {
        event.preventDefault();
        if (hasChanges && !saving) {
          resetPreferences();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [hasChanges, saving, savePreferences, resetPreferences]);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-none p-5 md:p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-none animate-pulse"></div>
          <div>
            <div className="h-5 bg-gray-200 rounded w-40 animate-pulse mb-2"></div>
            <div className="h-3 bg-gray-100 rounded w-32 animate-pulse"></div>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 rounded-none p-4 md:p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-none animate-pulse"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                    <div className="h-3 bg-gray-100 rounded w-48 animate-pulse"></div>
                  </div>
                </div>
                <div className="h-8 w-14 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-none p-5 md:p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-50 flex items-center justify-center rounded-none">
            <Bell className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
          </div>
          <div>
            <h3 className="font-medium text-lg md:text-xl">
              Notification Settings
            </h3>
            <p className="text-xs text-gray-500 font-mono mt-0.5">
              Manage your notification preferences
            </p>
            {hasChanges && (
              <p className="text-xs text-gray-400 font-mono mt-1">
                Press Ctrl+S to save • Esc to reset
              </p>
            )}
          </div>
        </div>

        {hasChanges && (
          <div className="flex items-center gap-2 text-xs font-mono text-orange-600 bg-orange-50 px-3 py-1.5 rounded-none">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            Unsaved changes
          </div>
        )}
      </div>

      {/* Content Section */}
      <TooltipProvider>
        <div className="space-y-4">
          {/* Low Stock Notifications */}
          <div className="bg-gray-50 rounded-none p-4 md:p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-yellow-100 flex items-center justify-center rounded-none">
                  <Package className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-black text-base md:text-lg">
                        Low Stock Alerts
                      </h4>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-900 text-white border-gray-700 rounded-none font-mono text-xs max-w-64">
                          <p>
                            Get notified when product quantities fall below
                            their reorder level. Helps you maintain adequate
                            inventory levels.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">
                      Notify when products are running low
                    </p>
                  </div>
                </div>
              </div>
              <Switch
                checked={preferences.lowStockNotifications}
                onCheckedChange={() => handleToggle("lowStockNotifications")}
                disabled={saving}
              />
            </div>
          </div>

          {/* Out of Stock Notifications */}
          <div className="bg-gray-50 rounded-none p-4 md:p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-100 flex items-center justify-center rounded-none">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-black text-base md:text-lg">
                        Out of Stock Alerts
                      </h4>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-900 text-white border-gray-700 rounded-none font-mono text-xs max-w-64">
                          <p>
                            Get immediate alerts when products reach zero
                            quantity. Critical for avoiding stockouts and
                            customer disappointment.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">
                      Notify when products are completely out of stock
                    </p>
                  </div>
                </div>
              </div>
              <Switch
                checked={preferences.outOfStockNotification}
                onCheckedChange={() => handleToggle("outOfStockNotification")}
                disabled={saving}
              />
            </div>
          </div>

          {/* New Order Notifications */}
          <div className="bg-gray-50 rounded-none p-4 md:p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 flex items-center justify-center rounded-none">
                  <ShoppingCart className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-black text-base md:text-lg">
                        New Order Alerts
                      </h4>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-900 text-white border-gray-700 rounded-none font-mono text-xs max-w-64">
                          <p>
                            Stay informed about incoming orders in real-time.
                            Helps you respond quickly to customer orders and
                            manage fulfillment.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">
                      Notify when new orders are placed
                    </p>
                  </div>
                </div>
              </div>
              <Switch
                checked={preferences.newOrderNotification}
                onCheckedChange={() => handleToggle("newOrderNotification")}
                disabled={saving}
              />
            </div>
          </div>
        </div>
      </TooltipProvider>

      {/* Action Buttons */}
      {hasChanges && (
        <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
          <Button
            onClick={savePreferences}
            disabled={saving}
            className="px-5 py-2.5 text-sm"
          >
            {saving ? "Saving..." : "Save Preferences"}
          </Button>
          <Button
            variant="outline"
            onClick={resetPreferences}
            disabled={saving}
            className="px-5 py-2.5 text-sm"
          >
            Reset Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;
