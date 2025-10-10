"use client";

import React from "react";

const KeyboardShortcuts = () => {
  const shortcuts = [
    {
      key: "N",
      description: "Add New Product",
      action: "Navigates to the new product form",
    },
    {
      key: "O",
      description: "Add New Order",
      action: "Navigates to the new order form",
    },
    {
      key: "P",
      description: "Products Page",
      action: "Navigates to the products page",
    },
    {
      key: "R",
      description: "Reports Page",
      action: "Navigates to the reports page",
    },
    {
      key: "S",
      description: "Settings Page",
      action: "Navigates to the settings page",
    },
    {
      key: "/",
      description: "Search Focus",
      action: "Focuses on the search bar in products page",
    },
    {
      key: "Escape",
      description: "Clear Focus",
      action: "Removes focus from all elements",
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
      <h2 className="font-mono text-sm md:text-base font-bold text-black mb-4 md:mb-6">
        Keyboard Shortcuts
      </h2>
      <div className="space-y-3 md:space-y-4">
        {shortcuts.map((shortcut, index) => (
          <div
            key={index}
            className="flex items-center gap-3 md:gap-4 p-3 md:p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center justify-center w-16 md:w-24 h-8 md:h-10 bg-gray-100 border border-gray-200 rounded font-mono text-xs md:text-sm font-bold text-black">
              {shortcut.key}
            </div>
            <div className="flex-1">
              <p className="font-mono text-xs md:text-sm font-bold text-black">
                {shortcut.description}
              </p>
              <p className="font-mono text-xs md:text-sm text-gray-600 mt-1">
                {shortcut.action}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyboardShortcuts;
