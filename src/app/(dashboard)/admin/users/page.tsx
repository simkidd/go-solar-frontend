import UsersListTable from "../../components/UsersListTable";
import type { Metadata } from "next";

const pageTitle = "Users";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
};

const UsersPage = () => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-medium">Users</h3>
      </div>
      <div className="w-full bg-white dark:bg-[#222327] shadow">
        <UsersListTable />
      </div>
    </div>
  );
};

export default UsersPage;
