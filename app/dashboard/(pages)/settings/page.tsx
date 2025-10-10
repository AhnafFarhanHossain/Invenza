import BusinessDetails from "@/components/dashboard/settings/business-details";
import NotificationSettings from "@/components/dashboard/settings/notification-settings";
import ProfileBlock from "@/components/dashboard/settings/profile-block";
import KeyboardShortcuts from "@/components/dashboard/settings/keyboard-shortcuts";
import React from "react";

const Settings = () => {
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6 md:space-y-8">
      <div className="space-y-2 md:space-y-4 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-black tracking-tight">
          Settings
        </h1>
        <p className="text-xs md:text-sm lg:text-base text-dark-base">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="space-y-6 md:space-y-8">
        <div className="space-y-4 md:space-y-6">
          <h2 className="text-base md:text-lg font-bold font-mono">Profile Details</h2>
          <ProfileBlock />
        </div>

        <div className="space-y-4 md:space-y-6">
          <h2 className="text-base md:text-lg font-bold font-mono">Business Details</h2>
          <BusinessDetails />
        </div>

        <div className="space-y-4 md:space-y-6">
          <h2 className="text-base md:text-lg font-bold font-mono">Keyboard Shortcuts</h2>
          <KeyboardShortcuts />
        </div>

        <div className="space-y-4 md:space-y-6">
          <h2 className="text-base md:text-lg font-bold font-mono">
            Notification Preferences
          </h2>
          <NotificationSettings />
        </div>
      </div>
    </div>
  );
};

export default Settings;
