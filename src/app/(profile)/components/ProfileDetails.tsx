"use client";
import { useAuthStore } from "@/lib/stores/auth.store";
import React from "react";

const ProfileDetails = () => {
  const { user } = useAuthStore();

  return (
    <>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#2a2b2f] shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Name:</strong> {user?.firstname} {user?.lastname}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Email:</strong> {user?.email}
          </p>
        </div>
        <div className="bg-white dark:bg-[#2a2b2f] shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Account Settings</h2>
          <ul className="text-gray-700 dark:text-gray-300">
            <li className="mb-2">
              <a href="/profile/settings" className="hover:underline">
                Update Profile
              </a>
            </li>
            <li>
              <a href="/profile/settings/password" className="hover:underline">
                Change Password
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Order History</h2>
        <div className="bg-white dark:bg-[#2a2b2f] shadow-md rounded-lg p-4">
          <table className="min-w-full bg-white dark:bg-[#2a2b2f]">
            <thead>
              <tr>
                <th className="py-2 text-left">Order ID</th>
                <th className="py-2 text-left">Date</th>
                <th className="py-2 text-left">Status</th>
                <th className="py-2 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {/* Mock data, replace with dynamic content */}
              <tr>
                <td className="py-2">123456</td>
                <td className="py-2">2023-05-20</td>
                <td className="py-2">Delivered</td>
                <td className="py-2">$120.00</td>
              </tr>
              <tr>
                <td className="py-2">654321</td>
                <td className="py-2">2023-05-18</td>
                <td className="py-2">Pending</td>
                <td className="py-2">$75.00</td>
              </tr>
              {/* End mock data */}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Saved Addresses</h2>
        <div className="bg-white dark:bg-[#2a2b2f] shadow-md rounded-lg p-4">
          <p className="text-gray-700 dark:text-gray-300">
            No saved addresses.
          </p>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Payment Methods</h2>
        <div className="bg-white dark:bg-[#2a2b2f] shadow-md rounded-lg p-4">
          <p className="text-gray-700 dark:text-gray-300">
            No saved payment methods.
          </p>
        </div>
      </div>
    </>
  );
};

export default ProfileDetails;
