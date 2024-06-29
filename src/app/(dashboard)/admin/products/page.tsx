import type { Metadata } from "next";
import CreateProductButton from "../../components/CreateProductButton";
import ProductsTable from "../../components/ProductsTable";

const pageTitle = "Products";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
};

const ProductsListPage = async () => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-medium">Products</h3>

        <CreateProductButton />
      </div>
      <div className="w-full mb-8">
        <ProductsTable />
      </div>
    </div>
  );
};

export default ProductsListPage;
