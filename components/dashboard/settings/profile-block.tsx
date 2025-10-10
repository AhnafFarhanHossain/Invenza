"use client";

import React from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { LogOut } from "lucide-react";

const ProfileBlock = () => {
  const [userEmail, setUserEmail] = React.useState("");
  const [userName, setUserName] = React.useState("");

  const [newUserEmail, setNewUserEmail] = React.useState("");
  const [newUserName, setNewUserName] = React.useState("");

  const [isEditing, setIsEditing] = React.useState(false);
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/auth/profile");
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUserEmail(data.user.email);
          setUserName(data.user.name);
          localStorage.setItem("userEmail", data.user.email);
          localStorage.setItem("userName", data.user.name);
        }
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("userEmail") || "";
      const name = localStorage.getItem("userName") || "";
      setUserEmail(email);
      setUserName(name);

      if (!email || !name) {
        fetchUserData();
      }
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await axios.post("/api/auth/logout");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      router.push("/auth/signin");
      toast.success("Logged out successfully");
    } catch {
      toast.error("Failed to logout");
    }
  };

  const startEditing = () => {
    setNewUserName(userName);
    setNewUserEmail(userEmail);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setNewUserName("");
    setNewUserEmail("");
    setIsEditing(false);
  };

  const saveProfile = async () => {
    if (!newUserName || !newUserEmail) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.patch("/api/auth/profile", {
        newUserName,
        newUserEmail,
      });

      if (response.status === 200) {
        setUserEmail(newUserEmail);
        setUserName(newUserName);
        localStorage.setItem("userEmail", newUserEmail);
        localStorage.setItem("userName", newUserName);

        setIsEditing(false);
        setNewUserName("");
        setNewUserEmail("");
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-none p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
      <div className="flex items-center gap-3 md:gap-4 w-full">
        <div className="rounded-full bg-primary/10 p-3 md:p-4 flex-shrink-0">
          <User className="w-5 h-5 md:w-6 md:h-6 text-primary" />
        </div>
        <div className="w-full">
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">
                  Name
                </label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-none focus:outline-none focus:ring-1 focus:ring-orange-500 font-light text-sm md:text-base"
                  placeholder="Name"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-none focus:outline-none focus:ring-1 focus:ring-orange-500 font-light text-sm md:text-base"
                  placeholder="Email"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-0.5">
              <h1 className="font-medium text-base md:text-lg">{userName}</h1>
              <p className="text-gray-500 text-xs md:text-sm font-mono">{userEmail}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto mt-2">
        <Button
          variant={"destructive"}
          onClick={() => handleSignOut()}
          className="flex-1 justify-center px-3 md:px-4 py-2 text-sm"
        >
          Sign Out
          <LogOut className="w-4 h-4 ml-2" />
        </Button>
        {isEditing ? (
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={saveProfile}
              className="flex-1 sm:flex-none px-3 md:px-4 py-2 text-sm"
            >
              Save
            </Button>
            <Button
              variant="outline"
              onClick={cancelEditing}
              className="flex-1 sm:flex-none px-3 md:px-4 py-2 text-sm"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={startEditing}
            className="flex-1 px-3 md:px-4 py-2 text-sm text-left"
          >
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileBlock;
