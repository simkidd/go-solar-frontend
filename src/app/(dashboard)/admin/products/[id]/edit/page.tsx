import UpdateProductForm from "@/app/(dashboard)/components/UpdateProductForm";
import { Category, Product } from "@/interfaces/product.interface";
import { getCategories, getProduct } from "@/lib/data";
import Link from "next/link";
import React from "react";

const EditProductPage = async ({ params }: { params: { id: string } }) => {
  const product: Product = await getProduct(params.id);
  const categories: Category[] = await getCategories();

  console.log(product)
  return (
    <div className="w-full max-w-[860px] mx-auto py-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-medium">Update Product</h3>

        <Link href={"/admin/products/" + params.id}>
          <button className="bg-primary text-white text-sm px-4 py-2">
            Cancel
          </button>
        </Link>
      </div>
      <div className="w-full bg-white dark:bg-[#222327] py-8 px-6 shadow rounded">
        <UpdateProductForm product={product} categories={categories} />
      </div>
    </div>
  );
};

export default EditProductPage;
