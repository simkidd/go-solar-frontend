"use client"
import { useAuthStore } from "@/lib/stores/auth.store";
import React, { useState } from "react";

const AccountPassordForm = () => {
  const {} = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      // changePassword(currentPassword, newPassword);
    } else {
      alert("New passwords do not match.");
    }
  };

  return (
    <div className="bg-white dark:bg-[#2a2b2f] shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Change Password</h2>
      <form onSubmit={handleChangePassword}>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-300"
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default AccountPassordForm;
