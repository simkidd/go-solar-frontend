import { Category, Product } from "@/interfaces/product.interface";
import { getCategoryIcon } from "@/utils/getCategoriesIcon";
import Link from "next/link";
import React from "react";
import CategoryCard from "./CategoryCard";
import ProductCard from "./ProductCard";
import { Skeleton } from "@heroui/react";

interface CategorySectionProps {
  title: string;
  products: Product[];
  link: string;
  loading?: boolean;
}

const CategoriesSectionGrid: React.FC<{
  categories: Category[];
  loading?: boolean;
}> = ({ categories, loading }) => {
  return (
    <section className="w-full py-8">
      <h2 className="text-2xl font-bold mb-6">Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-32 rounded-lg" />
            ))
          : categories.map((category) => (
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
  loading,
}) => {
  // If not loading and no products, don't render the section
  if (!products || products.length === 0) {
    return null;
  }

  // Render the actual section with products
  return (
    <div className="mb-16">
      <div className="flex items-center justify-between bg-primary text-white px-6 py-3 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold">{title}</h3>
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
  );
};
