"use client";
import useProducts from "@/hooks/useProducts";
import { Category } from "@/interfaces/product.interface";
import CategoryProductsTable from "../CategoryProductsTable";

const SingleCategoryProducts = ({ category }: { category: Category }) => {
  const { products } = useProducts();

  const catProducts = category
    ? products.filter((product) => product?.category?._id === category?._id)
    : [];

  return (
    <>
      <div className="w-full mb-4">
        <h4 className="font-bold text-xl mb-2">{category?.name}</h4>

        <p className="text-default-500 dark:text-default-400 max-w-xl">{category?.description}</p>
      </div>

      <div className="w-full mb-8">
        <CategoryProductsTable products={catProducts} />
      </div>
    </>
  );
};

export default SingleCategoryProducts;
