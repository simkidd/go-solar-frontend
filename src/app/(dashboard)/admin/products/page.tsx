import CreateProductButton from "../../components/CreateProductButton";
import ProductListTable from "../../components/ProductListTable";

const ProductsListPage = async () => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-medium">Products</h3>

        <CreateProductButton />
      </div>
      <div className="w-full bg-white dark:bg-[#222327] shadow rounded">
        <ProductListTable />
      </div>
    </div>
  );
};

export default ProductsListPage;
