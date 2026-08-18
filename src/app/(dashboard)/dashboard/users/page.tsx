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
    <div className="w-full">
      <UsersTable />
    </div>
  );
};

export default UsersPage;
