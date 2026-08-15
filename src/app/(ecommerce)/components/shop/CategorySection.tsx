import { Category, Product } from "@/interfaces/product.interface";
import { getCategoryIcon } from "@/utils/getCategoriesIcon";
import Link from "next/link";
import React from "react";
import CategoryCard from "./CategoryCard";
import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";

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
    <section className="w-full py-6 font-inter relative px-10">
      <div className="flex items-center justify-between mb-6 -mx-10 select-none">
        <div className="space-y-0.5 pl-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">
            Explore Categories
          </span>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Browse Departments
          </h2>
        </div>
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
                <CarouselItem
                  key={index}
                  className="pl-6 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                >
                  <div className="w-full">
                    <Skeleton className="h-28 rounded-2xl" />
                  </div>
                </CarouselItem>
              ))
            : categories.map((category) => (
                <CarouselItem
                  key={category._id}
                  className="pl-6 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                >
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
        <CarouselPrevious className="-left-10 hover:scale-105 transition-transform" />
        <CarouselNext className="-right-10 hover:scale-105 transition-transform" />
      </Carousel>
    </section>
  );
};

export { CategoriesSectionGrid };
export default CategoriesSectionGrid;

export const CategorySection: React.FC<CategorySectionProps> = ({
  link,
  products,
  title,
}) => {
  // If no products, don't render the section
  if (!products || products.length === 0) {
    return null;
  }

  // Render the actual section with products
  return (
    <div className="mb-16 font-inter space-y-8">
      <div className="flex items-end justify-between border-b border-border/60 pb-4 select-none">
        <div className="space-y-0.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">
            Department
          </span>
          <h3 className="text-xl font-extrabold text-foreground tracking-tight">
            {title}
          </h3>
        </div>
        <Link
          href={link}
          className="text-xs font-black uppercase tracking-wider text-primary hover:underline transition-colors flex items-center gap-1 cursor-pointer"
        >
          View All {title} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="grid lg:grid-cols-4 md:grid-cols-4 grid-cols-2 gap-6 my-8">
        {products.slice(0, 5).map((item) => (
          <ProductCard key={item?._id} item={item} />
        ))}
      </div>
    </div>
  );
};
