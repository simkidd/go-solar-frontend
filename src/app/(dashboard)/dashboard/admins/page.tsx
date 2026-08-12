import type { Metadata } from "next";
import AdminsTable from "../../components/AdminsTable";

export const metadata: Metadata = {
  title: "Administrators & Staff | GoSolar Admin",
  description: "Manage system administrators and staff permissions.",
};

const AdminsPage = () => {
  return (
    <div className="w-full">
      <AdminsTable />
    </div>
  );
};

export default AdminsPage;
