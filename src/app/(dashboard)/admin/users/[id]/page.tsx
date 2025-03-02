import UserDetails from "@/app/(dashboard)/components/UserDetails";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const SingleUserPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return (
    <div className="w-full max-w-[1000px] mx-auto py-4 font-inter">
      <div className="flex items-center justify-between mb-4">
        <Link href="/admin/users">
          <button className="px-4 py-2 text-sm flex items-center">
            <ArrowLeft className="mr-2" size={16} />
            Go back
          </button>
        </Link>
        <div className="flex items-center gap-2"></div>
      </div>

      <div className="w-full bg-white dark:bg-[#222327] py-16 px-6 shadow rounded">
        <UserDetails id={id} />
      </div>
    </div>
  );
};

export default SingleUserPage;
