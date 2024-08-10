import { Category, Product } from "@/interfaces/product.interface";
import { getCategoryIcon } from "@/utils/getCategoriesIcon";
import Link from "next/link";
import React from "react";
import CategoryCard from "./CategoryCard";
import ProductCard from "./ProductCard";

interface CategorySectionProps {
  title: string;
  products: Product[];
  link: string;
}

const CategoriesSectionGrid: React.FC<{ categories: Category[] }> = ({
  categories,
}) => {
  return (
    <section className="w-full py-8">
      <h2 className="text-2xl font-bold mb-6">Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {categories.map((category) => (
          <CategoryCard
            key={category._id}
            name={category?.name}
            icon={getCategoryIcon(category?.name)}
            link={`/${category?.slug}/products`}
          />
        ))}
      </div>
    </section>
  );
};

export default CategoriesSectionGrid;

export const CategorySection: React.FC<CategorySectionProps> = ({
  link,
  products,
  title,
}) => {
  return (
    <>
      {products && products?.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center justify-between bg-primary text-white px-6 py-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold tracking-wide">{title}</h2>
            <Link
              href={link}
              className="text-sm font-medium text-white hover:underline hover:text-yellow-300 transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-6 my-8">
            {products.slice(0, 6).map((item) => (
              <ProductCard key={item?._id} item={item} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};
