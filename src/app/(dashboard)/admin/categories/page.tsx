import CategoryListTable from "../../components/CategoryListTable";
import CreateCategoryButton from "../../components/CreateCategoryButton";

const page = () => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-medium">Categories</h3>

        <CreateCategoryButton />
      </div>
      
      <div className="w-full bg-white dark:bg-[#222327] shadow rounded">
        <div className="p-4">
          <CategoryListTable />
        </div>
      </div>
    </div>
  );
};

export default page;
