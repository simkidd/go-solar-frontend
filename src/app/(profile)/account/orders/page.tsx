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
    <div className="space-y-6">
      <h2 className="flex items-center text-xl font-black uppercase tracking-wider text-zinc-900 dark:text-white">
        <span>My Orders</span>
      </h2>
      <UserOrders />
    </div>
  );
};

export default UserOrdersPage;
