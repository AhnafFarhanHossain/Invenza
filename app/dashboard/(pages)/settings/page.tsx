import BusinessDetails from "@/components/dashboard/settings/business-details";
import ProfileBlock from "@/components/dashboard/settings/profile-block";
import React from "react";

const Settings = () => {
  return (
    <div className="p-4 space-y-4 max-w-[1000px] mx-auto">
      <h1 className="text-2xl font-medium mb-8">Settings</h1>
      <h3 className="font-mono mt-2 tracking-tight font-bold">Profile Details</h3>
      <ProfileBlock />
      <h3 className="font-mono mt-2 tracking-tight font-bold">Business Details</h3>
      <BusinessDetails />
    </div>
  );
};

export default Settings;
