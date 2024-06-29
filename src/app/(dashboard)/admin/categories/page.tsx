import type { Metadata } from "next";
import CategoryTable from "../../components/CategoryTable";
import CreateCategoryButton from "../../components/CreateCategoryButton";

const pageTitle = "Categories";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
};

const page = () => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-semibold">Categories</h3>

        <CreateCategoryButton />
      </div>

      <div className="w-full mb-8">
        <CategoryTable />
      </div>
    </div>
  );
};

export default page;
