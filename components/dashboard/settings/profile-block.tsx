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
    <div className="bg-white border border-gray-200 rounded-none p-5 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-4 w-full">
        <div className="rounded-full bg-soft-gray p-4 flex-shrink-0">
          <User className="w-6 h-6 text-gray-600" />
        </div>
        <div className="w-full">
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">Name</label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-none focus:outline-none focus:ring-1 focus:ring-orange-500 font-light"
                  placeholder="Name"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-none focus:outline-none focus:ring-1 focus:ring-orange-500 font-light"
                  placeholder="Email"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-0.5">
              <h1 className="font-medium text-lg">{userName}</h1>
              <p className="text-gray-500 text-sm font-mono">{userEmail}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2 w-full md:w-auto">
        <Button 
          variant={"destructive"} 
          onClick={() => handleSignOut()}
          className="w-full md:w-auto justify-start px-4 py-2 text-sm"
        >
          Sign Out
          <LogOut className="w-4 h-4 ml-2" />
        </Button>
        {isEditing ? (
          <div className="flex gap-2">
            <Button 
              onClick={saveProfile}
              className="flex-1 md:flex-none px-4 py-2 text-sm"
            >
              Save
            </Button>
            <Button 
              variant="outline" 
              onClick={cancelEditing}
              className="flex-1 md:flex-none px-4 py-2 text-sm"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button 
            variant="outline" 
            onClick={startEditing}
            className="w-full md:w-auto px-4 py-2 text-sm"
          >
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileBlock;
