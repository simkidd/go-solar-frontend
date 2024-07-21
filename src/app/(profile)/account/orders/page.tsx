import UserOrders from "@/app/(ecommerce)/components/UserOrders";
import type { Metadata } from "next";
import React from "react";

const pageTitle = "My Orders";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
};

const UserOrdersPage = () => {
  return (
    <div className="container mx-auto px-4 py-4">
      <h2 className="flex items-center text-2xl font-bold mb-6">
        <span>My Orders</span>
      </h2>
      <UserOrders />
    </div>
  );
};

export default UserOrdersPage;
