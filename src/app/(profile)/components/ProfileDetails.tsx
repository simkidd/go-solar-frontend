"use client";
import { useAuthStore } from "@/lib/stores/auth.store";
import React from "react";

const ProfileDetails = () => {
  const { user } = useAuthStore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-[#2a2b2f] p-6">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Name:</strong> {user?.firstname} {user?.lastname}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Email:</strong> {user?.email}
        </p>
      </div>

      <div className="bg-white dark:bg-[#2a2b2f] p-6">
        <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
        <ul className="text-gray-700 dark:text-gray-300">
          
          <li>
            <a href="/account/settings" className="hover:underline">
              Change Password
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileDetails;
