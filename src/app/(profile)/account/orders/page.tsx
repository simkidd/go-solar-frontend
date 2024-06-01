import UserOrders from "@/app/(ecommerce)/components/UserOrders";
import type { Metadata } from "next";
import React from "react";

const pageTitle = "My Orders";

export const metadata: Metadata = {
  title: pageTitle,
};

const UserOrdersPage = () => {
  return (
    <div>
      <UserOrders />
    </div>
  );
};

export default UserOrdersPage;
