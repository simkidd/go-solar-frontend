import React from "react";
import BannersTable from "../../components/banners/BannersTable";

export const metadata = {
  title: "Storefront Banners | GoSolar Admin",
  description: "Manage hero marketing banners for the storefront shop page",
};

const BannersPage = () => {
  return (
    <div className="space-y-6">
      <BannersTable />
    </div>
  );
};

export default BannersPage;
