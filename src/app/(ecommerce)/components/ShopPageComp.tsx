"use client";
import React, { useMemo } from "react";
import { Category, Product } from "@/interfaces/product.interface";
import { useActiveOffersQuery } from "@/hooks/queries/useOffersQuery";

import { usePublishedProductsQuery } from "@/hooks/queries/useProductsQuery";
import CategoriesSectionGrid, { CategorySection } from "./shop/CategorySection";
import ViewHistoryComp from "../components/ViewHistory";
import useProducts from "@/hooks/useProducts";
import useCategories from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Zap,
  ShieldCheck,
  Truck,
  Headphones,
  ArrowRight,
  CreditCard,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import ProductCard from "./shop/ProductCard";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";

const ShopFeaturesBar = () => (
  <section className="w-full py-8 bg-zinc-50/50 dark:bg-zinc-900/10 border-b border-border/80 ">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* Secure Payments Card */}
        <div className="bg-card text-card-foreground border border-border/80 rounded-2xl p-5 hover:border-primary/20 hover:shadow-xs transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5">
          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-[10px] text-foreground uppercase tracking-widest mb-0.5">
              Secure Payments
            </h4>
            <p className="text-[10px] text-muted-foreground font-semibold leading-tight">
              Safe and verified transactions
            </p>
          </div>
        </div>

        {/* Money-Back Guarantee Card */}
        <div className="bg-card text-card-foreground border border-border/80 rounded-2xl p-5 hover:border-primary/20 hover:shadow-xs transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5">
          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <RotateCcw className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-[10px] text-foreground uppercase tracking-widest mb-0.5">
              Money-Back Guarantee
            </h4>
            <p className="text-[10px] text-muted-foreground font-semibold leading-tight">
              30 days hassle-free return policy
            </p>
          </div>
        </div>

        {/* 24/7 Support Card */}
        <div className="bg-card text-card-foreground border border-border/80 rounded-2xl p-5 hover:border-primary/20 hover:shadow-xs transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5">
          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Headphones className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-[10px] text-foreground uppercase tracking-widest mb-0.5">
              24/7 Support
            </h4>
            <p className="text-[10px] text-muted-foreground font-semibold leading-tight">
              Expert customer assistance
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

import LeaderboardBanner from "./shop/LeaderboardBanner";

const ShopPageComp = () => {
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

  const publishedProducts = useMemo(
    () => allProducts.filter((product: Product) => product.isPublished),
    [allProducts],
  );

  const topLevelCategories = useMemo(() => {
    return allCategories.filter((cat: Category) => !cat.parent);
  }, [allCategories]);

  const productsInCategory = (category: Category) => {
    return publishedProducts.filter((product: Product) => {
      if (!product.category) return false;
      if (product.category._id === category._id) return true;
      const parentId =
        typeof product.category.parent === "object"
          ? product.category.parent?._id
          : product.category.parent;
      return parentId === category._id;
    });
  };

  const featuredPackages = publishedProducts
    .filter(
      (product: Product) =>
        product.category?.slug === "packages" ||
        product.category?.name?.toLowerCase() === "packages",
    )
    .slice(0, 3);

  const bestSellers = publishedProducts
    .filter(
      (product: Product) =>
        product.category?.slug !== "packages" &&
        product.category?.name?.toLowerCase() !== "packages",
    )
    .slice(0, 5);

  // ── Active offers for Flash Deals strip ──
  const { data: activeOffers = [] } = useActiveOffersQuery();
  const firstOffer = activeOffers[0] ?? null;
  const { data: offerProductsData, isLoading: offerProductsLoading } =
    usePublishedProductsQuery({ page: 1, limit: 8, offer: firstOffer?._id });
  const offerProducts: Product[] = offerProductsData?.products || [];

  if (productsError || categoriesError) {
    return (
      <section className="w-full font-inter bg-background text-foreground">
        <ShopFeaturesBar />
        <div className="w-full flex items-center justify-center py-20 px-4 font-inter">
          <div className="flex flex-col items-center max-w-sm text-center space-y-4">
            <AlertCircle className="w-8 h-8 text-zinc-400 dark:text-zinc-500 stroke-[1.5]" />
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                Failed to load shop data
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Please check your connection and try again.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  refetchCategories();
                  refetchProducts();
                }}
                className="text-xs rounded-xl"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                Retry
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-xs rounded-xl text-zinc-550 hover:text-zinc-950 dark:hover:text-zinc-50"
              >
                <Link href="/">Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full font-inter bg-background text-foreground">
      {/* Trust elements bar */}
      <ShopFeaturesBar />

      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Categories Section */}
        <CategoriesSectionGrid
          categories={topLevelCategories}
          loading={categoriesLoading}
        />

        {/* Leaderboard Banner — pure graphic, random pick from active pool */}
        <LeaderboardBanner />

        {/* Flash Deals strip — only when an active offer exists */}
        {firstOffer && (
          <div className="space-y-8">
            <div className="flex items-end justify-between border-b border-border/60 pb-4 ">
              <div className="space-y-0.5">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary">
                  <Zap className="h-3.5 w-3.5 fill-primary" /> Flash Deal ·{" "}
                  {firstOffer.percentageOff}% Off
                </span>
                <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
                  {firstOffer.name}
                </h2>
              </div>
              <Link
                href="/offers"
                className="text-xs font-black uppercase tracking-wider text-primary hover:underline transition-colors flex items-center gap-1 cursor-pointer shrink-0 ml-4"
              >
                See All Deals <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {offerProductsLoading
                ? Array.from({ length: 4 }).map((_, idx) => (
                    <Skeleton key={idx} className="h-60 rounded-3xl" />
                  ))
                : offerProducts.map((prod: Product) => (
                    <ProductCard key={prod._id} item={prod} />
                  ))}
            </div>
          </div>
        )}

        {/* Best Selling Hardware section */}
        <div className="space-y-8">
          <div className="flex items-end justify-between border-b border-border/60 pb-4 ">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                Best Sellers
              </span>
              <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
                Best Selling Solar Hardware
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-black uppercase tracking-wider text-primary hover:underline transition-colors flex items-center gap-1 cursor-pointer"
            >
              View All Products <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productsLoading
              ? Array.from({ length: 5 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-60 rounded-2xl" />
                ))
              : bestSellers.map((prod: Product) => (
                  <ProductCard key={prod._id} item={prod} />
                ))}
          </div>
        </div>

        {/* Category Sections (Fallback lists) */}
        <div className="space-y-12">
          {productsLoading || categoriesLoading
            ? Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="mb-16">
                  <div className="flex items-end justify-between border-b border-border/60 pb-4 ">
                    <Skeleton className="h-8 w-1/3 rounded-xl bg-muted" />
                  </div>
                  <div className="grid lg:grid-cols-4 md:grid-cols-4 grid-cols-2 gap-6 my-8">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="space-y-3 p-4 border border-border/60 rounded-2xl bg-card"
                      >
                        <Skeleton className="h-40 w-full rounded-xl" />
                        <Skeleton className="h-4 w-3/4 rounded-md" />
                        <Skeleton className="h-4 w-1/2 rounded-md" />
                      </div>
                    ))}
                  </div>
                </div>
              ))
            : topLevelCategories.map((category: Category) => (
                <CategorySection
                  key={category?._id}
                  title={category?.name}
                  products={productsInCategory(category)}
                  link={`/${category?.slug}/products`}
                />
              ))}
        </div>

        <ViewHistoryComp />
      </div>
    </section>
  );
};

export default ShopPageComp;
