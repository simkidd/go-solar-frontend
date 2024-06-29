import type { Metadata } from "next";
import UsersTable from "../../components/UsersTable";

const pageTitle = "Users";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
};

const UsersPage = () => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-semibold">Users</h3>
      </div>
      <div className="w-full mb-8">
        <UsersTable />
      </div>
    </div>
  );
};

export default UsersPage;
