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
  const getCategoryByIndexOrSlug = (slug: string, index: number) => {
    const found = categories.find(
      (c) =>
        c.slug === slug || c.name.toLowerCase().includes(slug.replace("-", " "))
    );
    if (found) return found;
    return categories[index] || null;
  };

  const cat1 = getCategoryByIndexOrSlug("packages", 0);
  const cat2 = getCategoryByIndexOrSlug("inverters", 1);
  const cat3 = getCategoryByIndexOrSlug("solar-panels", 2);
  const cat4 = getCategoryByIndexOrSlug("batteries", 3);

  const activeCats = [cat1, cat2, cat3, cat4].filter(Boolean) as Category[];

  if (loading) {
    return (
      <section className="w-full py-8 font-inter">
        <div className="flex flex-col mb-8 select-none">
          <Skeleton className="h-4 w-28 rounded-md mb-2 bg-muted/65" />
          <Skeleton className="h-8 w-60 rounded-lg bg-muted/65" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="min-h-[220px] rounded-3xl bg-muted/65" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-8 font-inter">
      <div className="flex flex-col mb-8 select-none">
        <span className="text-[10px] font-black uppercase tracking-widest text-primary">
          Explore Categories
        </span>
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight font-heading Outfit">
          Browse Solar Departments
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {activeCats.map((cat) => (
          <Link
            key={cat._id}
            href={`/${cat.slug}/products`}
            className="group bg-card text-card-foreground border border-border/80 rounded-3xl p-6 flex flex-col items-center text-center justify-between min-h-[230px] transition-all duration-300 hover:border-primary/20 hover:shadow-xs hover:-translate-y-1 cursor-pointer select-none"
          >
            {/* Centered Large Icon in Circular Wrapper */}
            <div className="h-16 w-16 rounded-full bg-primary/5 dark:bg-primary/10 text-primary flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:text-white mb-4 shadow-xs">
              <span className="text-2xl">
                {React.createElement(getCategoryIcon(cat.name))}
              </span>
            </div>
            
            <div className="space-y-1.5 w-full flex-1 flex flex-col justify-center">
              <h3 className="text-xs font-black text-foreground tracking-wider group-hover:text-primary transition-colors Outfit uppercase">
                {cat.name}
              </h3>
              <p className="text-[10px] text-muted-foreground font-semibold line-clamp-2 max-w-[160px] mx-auto leading-relaxed">
                {cat.slug === "packages" 
                  ? "Pre-engineered, complete solar setups"
                  : cat.description || `High quality ${cat.name.toLowerCase()} hardware.`}
              </p>
            </div>

            <div className="pt-4 text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Explore <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
        ))}
      </div>
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
