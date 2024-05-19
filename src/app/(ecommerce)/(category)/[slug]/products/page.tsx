import ProductsList from "@/app/(ecommerce)/components/ProductsList";
import { Category, Product } from "@/interfaces/product.interface";
import { getCategories, getProducts } from "@/lib/data";
import React from "react";

interface IProp {
  params: { slug: string };
}

const CategoryProducts = async ({ params }: IProp) => {
  const categorySlug = params.slug;
  const products: Product[] = await getProducts();
  const categories: Category[] = await getCategories();

  const category = categories.find((cat) => cat?.slug === categorySlug);

  const filteredProducts = category
    ? products.filter((product) => product?.category?._id === category?._id)
    : [];

  return (
    <div className="w-full font-dmsans">
      <section className="w-full">
        <div className="container mx-auto px-2 py-8">
          <ProductsList
            categories={categories}
            products={filteredProducts}
            category={category}
          />
        </div>
      </section>
    </div>
  );
};

export default CategoryProducts;
