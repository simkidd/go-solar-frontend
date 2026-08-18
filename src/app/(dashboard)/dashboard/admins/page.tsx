import type { Metadata } from "next";
import { AdminsTable } from "../../components/AdminsTable";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { USER_DETAILS } from "@/utils/constants";
import { User } from "@/interfaces/auth.interface";

export const metadata: Metadata = {
  title: "Administrators & Staff | GoSolar Admin",
  description: "Manage system administrators and staff permissions.",
};

const AdminsPage = async () => {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get(USER_DETAILS)?.value;

  let isSuperAdmin = false;
  if (userCookie) {
    try {
      const user = JSON.parse(userCookie) as User;
      isSuperAdmin = user?.isSuperAdmin || false;
    } catch (e) {
      console.error(e);
    }
  }

  if (!isSuperAdmin) {
    redirect("/unauthorized");
  }

  return (
    <div className="w-full">
      <AdminsTable />
    </div>
  );
};

export default AdminsPage;
