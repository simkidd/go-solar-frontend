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
    <div className="w-full">
      <ProductsTable />
    </div>
  );
};

export default ProductsListPage;
