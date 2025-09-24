import BusinessDetails from "@/components/dashboard/settings/business-details";
import NotificationSettings from "@/components/dashboard/settings/notification-settings";
import ProfileBlock from "@/components/dashboard/settings/profile-block";
import KeyboardShortcuts from "@/components/dashboard/settings/keyboard-shortcuts";
import React from "react";

const Settings = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>
      
      <div className="space-y-8">
        <div className="space-y-6">
          <h2 className="text-lg font-bold font-mono">Profile Details</h2>
          <ProfileBlock />
        </div>
        
        <div className="space-y-6">
          <h2 className="text-lg font-bold font-mono">Business Details</h2>
          <BusinessDetails />
        </div>
        
        <div className="space-y-6">
          <h2 className="text-lg font-bold font-mono">Keyboard Shortcuts</h2>
          <KeyboardShortcuts />
        </div>
        
        <div className="space-y-6">
          <h2 className="text-lg font-bold font-mono">Notification Preferences</h2>
          <NotificationSettings />
        </div>
      </div>
    </div>
  );
};

export default Settings;
