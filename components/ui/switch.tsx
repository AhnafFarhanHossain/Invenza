"use client";

import React from "react";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Switch = ({
  checked,
  onCheckedChange,
  disabled = false,
}: SwitchProps) => {
  const handleCheckboxChange = () => {
    if (!disabled) {
      onCheckedChange(!checked);
    }
  };

  // Ensure checked is always a boolean to avoid controlled/uncontrolled issues
  const isChecked = Boolean(checked);

  return (
    <label
      className={`flex cursor-pointer select-none items-center ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`box block h-8 w-14 rounded-full transition-colors duration-200 ${
            isChecked ? "bg-primary" : "bg-gray-300"
          }`}
        ></div>
        <div
          className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
            isChecked ? "translate-x-full" : ""
          }`}
        ></div>
      </div>
    </label>
  );
};

// Legacy component for backward compatibility
const Switcher = () => {
  const [isChecked, setIsChecked] = React.useState(false);

  return <Switch checked={isChecked} onCheckedChange={setIsChecked} />;
};

export { Switch };
export default Switcher;
