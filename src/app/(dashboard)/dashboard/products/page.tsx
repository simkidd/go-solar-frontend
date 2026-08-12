import type { Metadata } from "next";
import CreateProductButton from "../../components/products/CreateProductButton";
import ProductsTable from "../../components/products/ProductsTable";

const pageTitle = "Products";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
};

const ProductsListPage = async () => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold">Products</h3>

        <CreateProductButton />
      </div>
      <div className="w-full mb-8">
        <ProductsTable />
      </div>
    </div>
  );
};

export default ProductsListPage;
