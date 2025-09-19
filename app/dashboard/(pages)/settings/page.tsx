import ProfileBlock from "@/components/dashboard/settings/profile-block";
import React from "react";

const Settings = () => {
  return (
    <div className="p-4 space-y-4 max-w-[1000px] mx-auto">
      <h1 className="text-2xl font-medium mb-8">Settings</h1>
      <ProfileBlock />
    </div>
  );
};

export default Settings;
