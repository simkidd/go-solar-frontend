"use client";
import { Category } from "@/interfaces/product.interface";
import CategoryProductsTable from "../CategoryProductsTable";

const SingleCategoryProducts = ({ category }: { category: Category }) => {
  return (
    <>
      <div className="w-full mb-4">
        <h4 className="font-bold text-xl mb-2">{category?.name}</h4>

        <p className="text-default-500 dark:text-default-400 max-w-xl">{category?.description}</p>
      </div>

      <div className="w-full mb-8">
        {category?._id && <CategoryProductsTable categoryId={category._id} />}
      </div>
    </>
  );
};

export default SingleCategoryProducts;
