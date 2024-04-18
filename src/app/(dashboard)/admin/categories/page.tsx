import React from "react";
import CreateCategoryForm from "../../components/CreateCategoryForm";
import { Category } from "@/interfaces/product.interface";
import { getCategories } from "@/lib/data";

const page = async () => {
  const categories: Category[] = await getCategories();

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-medium">Categories</h3>
      </div>
      <div className="grid lg:grid-cols-8 grid-cols-1 gap-4">
        <div className="lg:col-span-5 col-span-1 w-full bg-white dark:bg-[#222327] shadow rounded">
          <div className="p-4">
            {categories.map((category) => (
              <p key={category._id}>{category.name}</p>
            ))}
          </div>
        </div>
        <div className="lg:col-span-3 col-span-1 w-full bg-white dark:bg-[#222327] shadow rounded">
          <div className="p-4">
            <h4 className="font-medium text-xl mb-4">Create Category</h4>
            <CreateCategoryForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
