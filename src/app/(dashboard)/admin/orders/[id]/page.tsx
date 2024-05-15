import OrderDetails from "@/app/(dashboard)/components/OrderDetails";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const SingleOrderPage = () => {
  return (
    <div className="w-full max-w-[1000px] mx-auto py-4 font-inter">
      <div className="flex items-center justify-between mb-4">
        <Link href="/admin/orders">
          <button className="px-4 py-2 text-sm flex items-center">
            <ArrowLeft className="mr-2" size={16} />
            Go back
          </button>
        </Link>
      </div>
      <div className="w-full">
        <OrderDetails />
      </div>
    </div>
  );
};

export default SingleOrderPage;
