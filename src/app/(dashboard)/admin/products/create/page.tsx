import CreateProductForm from "@/app/(dashboard)/components/CreateProductForm";
import { Category } from "@/interfaces/product.interface";
import { getCategories } from "@/lib/data";
import Link from "next/link";
import React from "react";

const page = async () => {
  const categories: Category[] = await getCategories();

  return (
    <div className="w-full max-w-[860px] mx-auto py-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-medium">Add New Product</h3>

        <Link href="/admin/products">
          <button className="bg-primary text-white text-sm px-4 py-2">View all</button>
        </Link>
      </div>
      <div className="w-full bg-white dark:bg-[#222327] py-8 px-6 shadow rounded">
        <CreateProductForm categories={categories} />
      </div>
    </div>
  );
};

export default page;
