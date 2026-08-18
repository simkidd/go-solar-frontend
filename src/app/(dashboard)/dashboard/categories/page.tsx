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
    <div className="w-full">
      <CategoryTable />
    </div>
  );
};

export default page;
