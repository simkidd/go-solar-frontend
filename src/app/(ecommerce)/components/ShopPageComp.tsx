"use client";
import React from "react";
import Cta from "@/app/(ecommerce)/components/shop/Cta";
import { Category, Product } from "@/interfaces/product.interface";
import { useActiveOffersQuery } from "@/hooks/queries/useOffersQuery";
import { useActiveBannersQuery } from "@/hooks/queries/useBannersQuery";
import CategoriesSectionGrid, { CategorySection } from "./shop/CategorySection";
import SpecialOffers from "./shop/SpecialOffers";
import ViewHistoryComp from "../components/ViewHistory";
import useProducts from "@/hooks/useProducts";
import useCategories from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Zap,
  ShieldCheck,
  Truck,
  Headphones,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import ProductCard from "./shop/ProductCard";
import { Button } from "@/components/ui/button";



const ShopFeaturesBar = () => (
  <section className="w-full py-8 bg-zinc-50 dark:bg-zinc-900/40 border-b border-zinc-150 dark:border-zinc-800">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#08AA08]/10 text-[#08AA08] flex items-center justify-center shrink-0">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-zinc-900 dark:text-white uppercase tracking-wider">
              Fast Shipping
            </h4>
            <p className="text-[10px] text-zinc-500">
              Delivered within 3-5 working days
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#08AA08]/10 text-[#08AA08] flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-zinc-900 dark:text-white uppercase tracking-wider">
              5-Year Warranty
            </h4>
            <p className="text-[10px] text-zinc-500">
              Full replacement protection
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#08AA08]/10 text-[#08AA08] flex items-center justify-center shrink-0">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-zinc-900 dark:text-white uppercase tracking-wider">
              Expert Mounting
            </h4>
            <p className="text-[10px] text-zinc-500">
              Installed by licensed technicians
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#08AA08]/10 text-[#08AA08] flex items-center justify-center shrink-0">
            <Headphones className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-zinc-900 dark:text-white uppercase tracking-wider">
              24/7 Support
            </h4>
            <p className="text-[10px] text-zinc-500">
              Post-install remote telemetry
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ShopPageComp = () => {
  const { data: offers = [] } = useActiveOffersQuery();
  const { data: serverBanners = [] } = useActiveBannersQuery();

  const {
    products: allProducts,
    isError: productsError,
    isLoading: productsLoading,
  } = useProducts();
  const {
    categories: allCategories,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategories();

  const publishedProducts = allProducts.filter(
    (product) => product.isPublished,
  );

  const productsInCategory = (category: Category) => {
    return publishedProducts.filter(
      (product) => product?.category?._id === category?._id,
    );
  };

  const featuredPackages = publishedProducts
    .filter(
      (product) =>
        product.category?.slug === "packages" ||
        product.category?.name?.toLowerCase() === "packages",
    )
    .slice(0, 3);

  const bestSellers = publishedProducts
    .filter(
      (product) =>
        product.category?.slug !== "packages" &&
        product.category?.name?.toLowerCase() !== "packages",
    )
    .slice(0, 6);

  const topOffers = offers
    .filter((offer) => offer.isActive)
    .sort((a, b) => b.percentageOff - a.percentageOff)
    .slice(0, 3);

  if (productsError || categoriesError) {
    return (
      <section className="w-full font-inter bg-white dark:bg-zinc-950">
        <ShopFeaturesBar />
        <div className="container mx-auto px-4 py-10">
          <p className="text-center text-rose-500 font-bold">
            Error loading shop data. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full font-inter bg-white dark:bg-zinc-950">
      {/* Trust elements bar */}
      <ShopFeaturesBar />

      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Categories Section */}
        <CategoriesSectionGrid
          categories={allCategories}
          loading={categoriesLoading}
        />

        {/* Promo banner placeholder */}
        <div className="mb-6">
          {serverBanners && serverBanners.length > 1 ? (
            <div className="w-full relative rounded-3xl overflow-hidden shadow-xs border border-zinc-150 dark:border-zinc-800 bg-zinc-950 min-h-[160px] flex items-center font-inter p-8 md:p-12">
              <div
                className="absolute inset-0 z-0 bg-cover bg-center opacity-30 hover:scale-102 transition-transform duration-[10s]"
                style={{ backgroundImage: `url('${serverBanners[1].image}')` }}
              />
              <div className="absolute inset-0 z-10 bg-linear-to-r from-black via-black/80 to-transparent" />
              <div className="relative z-20 max-w-xl space-y-2 text-white">
                {serverBanners[1].badge && (
                  <span className="inline-block text-[9px] font-extrabold bg-[#08AA08] text-white px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {serverBanners[1].badge}
                  </span>
                )}
                <h3 className="text-lg md:text-xl font-black tracking-tight leading-tight">{serverBanners[1].title}</h3>
                {serverBanners[1].subtitle && (
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed font-semibold">{serverBanners[1].subtitle}</p>
                )}
                {serverBanners[1].ctaLink && (
                  <div className="pt-2">
                    <Link href={serverBanners[1].ctaLink}>
                      <Button className="bg-[#08AA08] hover:bg-[#079907] text-white text-[10px] font-extrabold uppercase tracking-widest h-8 px-4 rounded-xl shadow-xs transition-all hover:scale-102">
                        {serverBanners[1].ctaText || "Explore"}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Cta />
          )}
        </div>

        {/* Pre-configured Complete Packages segment */}
        <div className="space-y-8">
          <div className="flex items-end justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#08AA08]">
                Pre-Configured
              </span>
              <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                Complete Solar Packages
              </h2>
            </div>
            <Link
              href="/packages"
              className="text-xs font-bold text-[#08AA08] flex items-center gap-1 hover:underline"
            >
              View All Packages <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {productsLoading
              ? Array.from({ length: 3 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-72 rounded-2xl" />
                ))
              : featuredPackages.map((pkg) => (
                  <ProductCard key={pkg._id} item={pkg} />
                ))}
          </div>
        </div>

        {/* Best Selling Hardware section */}
        <div className="space-y-8">
          <div className="flex items-end justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#08AA08]">
                Best Sellers
              </span>
              <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                Best Selling Solar Hardware
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold text-[#08AA08] flex items-center gap-1 hover:underline"
            >
              View All Products <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {productsLoading
              ? Array.from({ length: 6 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-60 rounded-2xl" />
                ))
              : bestSellers.map((prod) => (
                  <ProductCard key={prod._id} item={prod} />
                ))}
          </div>
        </div>

        {/* Category Sections (Fallback lists) */}
        <div className="space-y-12">
          {productsLoading || categoriesLoading
            ? Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="mb-16">
                  <div className="flex items-center justify-between bg-[#08AA08] text-white px-6 py-3 rounded-2xl shadow-sm">
                    <Skeleton className="h-8 w-1/3 rounded-xl bg-white/20" />
                  </div>
                  <div className="grid lg:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-6 my-8">
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="space-y-3 p-4 border rounded-2xl bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800"
                      >
                        <Skeleton className="h-40 w-full rounded-xl" />
                        <Skeleton className="h-4 w-3/4 rounded-md" />
                        <Skeleton className="h-4 w-1/2 rounded-md" />
                      </div>
                    ))}
                  </div>
                </div>
              ))
            : allCategories.map((category) => (
                <CategorySection
                  key={category?._id}
                  title={category?.name}
                  products={productsInCategory(category)}
                  link={`/${category?.slug}/products`}
                />
              ))}
        </div>

        {/* Offers and history segments */}
        <SpecialOffers offers={topOffers} />

        <ViewHistoryComp />
      </div>
    </section>
  );
};

export default ShopPageComp;
