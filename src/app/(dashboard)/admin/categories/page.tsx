import CategoryListTable from "../../components/CategoryListTable";
import CreateCategoryForm from "../../components/CreateCategoryForm";

const page = () => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-medium">Categories</h3>
      </div>
      <div className="grid lg:grid-cols-10 grid-cols-1 gap-4">
        <div className="lg:col-span-7 col-span-1 w-full bg-white dark:bg-[#222327] shadow rounded">
          <div className="p-4">
            <CategoryListTable />
          </div>
        </div>
        <div className="lg:col-span-3 col-span-1 w-full bg-white dark:bg-[#222327] shadow rounded h-fit">
          <div className="p-4">
            <h4 className="font-medium text-xl mb-4">Add Category</h4>
            <CreateCategoryForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
