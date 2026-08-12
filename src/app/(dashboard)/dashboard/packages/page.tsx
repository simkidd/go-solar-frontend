import type { Metadata } from "next";
import PackagesTable from "../../components/packages/PackagesTable";

export const metadata: Metadata = {
  title: "Solar Packages Management | GoSolar Admin",
  description: "Manage pre-configured hybrid solar packages and bundles.",
};

const PackagesAdminPage = () => {
  return (
    <div className="w-full">
      <PackagesTable />
    </div>
  );
};

export default PackagesAdminPage;
