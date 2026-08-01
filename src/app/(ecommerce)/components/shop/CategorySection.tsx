import { Category, Product } from "@/interfaces/product.interface";
import { getCategoryIcon } from "@/utils/getCategoriesIcon";
import Link from "next/link";
import React from "react";
import CategoryCard from "./CategoryCard";
import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

interface CategorySectionProps {
  title: string;
  products: Product[];
  link: string;
  loading?: boolean;
}

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const CategoriesSectionGrid: React.FC<{
  categories: Category[];
  loading?: boolean;
}> = ({ categories, loading }) => {
  return (
    <section className="w-full py-8 font-inter relative px-10">
      <div className="flex items-center justify-between mb-6 -mx-10">
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Categories
        </h2>
      </div>

      {/* Categories Cards Carousel */}
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full relative"
      >
        <CarouselContent className="-ml-6">
          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index} className="pl-6 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                  <div className="w-full">
                    <Skeleton className="h-32 rounded-2xl" />
                  </div>
                </CarouselItem>
              ))
            : categories.map((category) => (
                <CarouselItem key={category._id} className="pl-6 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                  <div className="w-full">
                    <CategoryCard
                      name={category?.name}
                      icon={getCategoryIcon(category?.name)}
                      link={`/${category?.slug}/products`}
                    />
                  </div>
                </CarouselItem>
              ))}
        </CarouselContent>
        {/* Navigation Arrows on Left and Right borders */}
        <CarouselPrevious className="-left-10 hover:scale-115 transition-transform" />
        <CarouselNext className="-right-10 hover:scale-115 transition-transform" />
      </Carousel>
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
    <div className="mb-16 font-inter">
      <div className="flex items-center justify-between bg-primary text-white px-6 py-3 rounded-2xl shadow-sm">
        <h3 className="text-xl font-bold tracking-tight">{title}</h3>
        <Link
          href={link}
          className="text-xs font-bold text-white hover:underline transition-colors uppercase tracking-wider"
        >
          View all
        </Link>
      </div>
      <div className="grid lg:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-6 my-8">
        {products.slice(0, 6).map((item) => (
          <ProductCard key={item?._id} item={item} />
        ))}
      </div>
    </div>
  );
};
