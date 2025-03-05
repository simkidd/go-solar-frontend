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
    <div className="w-full container mx-auto py-4 font-inter">
      <UserDetails id={id} />
    </div>
  );
};

export default SingleUserPage;
