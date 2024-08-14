"use client";
import { Category } from "@/interfaces/product.interface";
import { useProductStore } from "@/lib/stores/product.store";
import CategoryProductsTable from "./CategoryProductsTable";

const SingleCategoryProducts = ({ category }: { category: Category }) => {
  const { products } = useProductStore();

  const catProducts = category
    ? products.filter((product) => product?.category?._id === category?._id)
    : [];

  return (
    <>
      <div className="w-full">
        <h4 className="font-semibold text-xl">{category?.name}</h4>
      </div>

      <div className="w-full mb-8">
        <CategoryProductsTable products={catProducts} />
      </div>
    </>
  );
};

export default SingleCategoryProducts;
