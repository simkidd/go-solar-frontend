import CreateProductForm from "@/app/(dashboard)/components/CreateProductForm";
import React from "react";

const page = () => {
  return (
    <div className="w-full max-w-[860px] mx-auto py-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-medium">Create Product</h3>
      </div>
      <div className="w-full bg-white dark:bg-[#222327] py-8 px-6 shadow">
        <CreateProductForm />
      </div>
    </div>
  );
};

export default page;
