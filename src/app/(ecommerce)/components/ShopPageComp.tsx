"use client";
import React from "react";
import Cta from "@/app/(ecommerce)/components/Cta";
import { Category } from "@/interfaces/product.interface";
import { useProductStore } from "@/lib/stores/product.store";
import CategoriesSectionGrid, {
  CategorySection,
} from "../components/CategorySection";
import SpecialOffers from "../components/SpecialOffers";
import ViewHistoryComp from "../components/ViewHistory";
import useProducts from "@/hooks/useProducts";
import useCategories from "@/hooks/useCategories";
import { Skeleton } from "@heroui/react";

const ShopPageComp = () => {
  const { offers } = useProductStore();

  const {
    products: allProducts,
    isError: productsError,
    isLoading: productsLoading,
    refetch: refetchProducts,
  } = useProducts();
  const {
    categories: allCategories,
    isLoading: categoriesLoading,
    isError: categoriesError,
    refetch: refetchCategories,
  } = useCategories();

  const publishedProducts = allProducts.filter(
    (product) => product.isPublished
  );

  const productsInCategory = (category: Category) => {
    return publishedProducts.filter(
      (product) => product?.category?._id === category?._id
    );
  };

  const topOffers = offers
    .filter((offer) => offer.isActive)
    .sort((a, b) => b.percentageOff - a.percentageOff)
    .slice(0, 3);

  if (productsError || categoriesError) {
    return (
      <section className="w-full">
        <div className="container mx-auto px-2 py-10">
          <p>Error loading data. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      <div className="container mx-auto px-2 py-10">
        <CategoriesSectionGrid
          categories={allCategories}
          loading={categoriesLoading}
        />

        <div className="mb-6">
          <Cta />
        </div>

        {/* Category Sections */}
        {productsLoading || categoriesLoading
          ? // Show 2-3 skeleton sections during loading
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="mb-16">
                <div className="flex items-center justify-between bg-primary text-white px-6 py-3 rounded-lg shadow-md">
                  <Skeleton className="h-8 w-1/3 rounded-lg" />{" "}
                  {/* Skeleton for title */}
                </div>
                <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-6 my-8">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <Skeleton key={idx} className="h-60 rounded-lg" /> // Skeleton for products
                  ))}
                </div>
              </div>
            ))
          : // Render actual category sections after loading
            allCategories.map((category) => (
              <CategorySection
                key={category?._id}
                title={category?.name}
                products={productsInCategory(category)}
                link={`/${category?.slug}/products`}
              />
            ))}

        <div className="mb-6">
          <Cta />
        </div>

        <SpecialOffers offers={topOffers} />

        <ViewHistoryComp />
      </div>
    </section>
  );
};

export default ShopPageComp;
