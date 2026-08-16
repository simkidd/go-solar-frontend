"use client";
import React, { useMemo } from "react";
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
import { Zap, ShieldCheck, Truck, Headphones, ArrowRight } from "lucide-react";
import Link from "next/link";
import ProductCard from "./shop/ProductCard";
import { Button } from "@/components/ui/button";

const ShopFeaturesBar = () => (
  <section className="w-full py-8 bg-zinc-50/50 dark:bg-zinc-900/10 border-b border-border/80 select-none">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {/* Fast Shipping Card */}
        <div className="bg-card text-card-foreground border border-border/80 rounded-2xl p-5 hover:border-primary/20 hover:shadow-xs transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-[10px] text-foreground uppercase tracking-widest mb-0.5">
              Fast Shipping
            </h4>
            <p className="text-[10px] text-muted-foreground font-semibold leading-tight">
              Delivered within 3-5 working days
            </p>
          </div>
        </div>

        {/* 5-Year Warranty Card */}
        <div className="bg-card text-card-foreground border border-border/80 rounded-2xl p-5 hover:border-primary/20 hover:shadow-xs transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-[10px] text-foreground uppercase tracking-widest mb-0.5">
              5-Year Warranty
            </h4>
            <p className="text-[10px] text-muted-foreground font-semibold leading-tight">
              Full hardware replacement protection
            </p>
          </div>
        </div>

        {/* Expert Mounting Card */}
        <div className="bg-card text-card-foreground border border-border/80 rounded-2xl p-5 hover:border-primary/20 hover:shadow-xs transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-[10px] text-foreground uppercase tracking-widest mb-0.5">
              Expert Mounting
            </h4>
            <p className="text-[10px] text-muted-foreground font-semibold leading-tight">
              Installed by licensed solar technicians
            </p>
          </div>
        </div>

        {/* 24/7 Support Card */}
        <div className="bg-card text-card-foreground border border-border/80 rounded-2xl p-5 hover:border-primary/20 hover:shadow-xs transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Headphones className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-[10px] text-foreground uppercase tracking-widest mb-0.5">
              24/7 Support
            </h4>
            <p className="text-[10px] text-muted-foreground font-semibold leading-tight">
              Post-install remote telemetry monitoring
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

  const publishedProducts = useMemo(
    () => allProducts.filter((product: Product) => product.isPublished),
    [allProducts]
  );

  const topLevelCategories = useMemo(() => {
    return allCategories.filter((cat: Category) => !cat.parent);
  }, [allCategories]);

  const productsInCategory = (category: Category) => {
    return publishedProducts.filter((product: Product) => {
      if (!product.category) return false;
      if (product.category._id === category._id) return true;
      const parentId = typeof product.category.parent === "object"
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

  const topOffers = offers
    .filter((offer: any) => offer.isActive)
    .sort((a: any, b: any) => b.percentageOff - a.percentageOff)
    .slice(0, 3);

  if (productsError || categoriesError) {
    return (
      <section className="w-full font-inter bg-background text-foreground">
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
    <section className="w-full font-inter bg-background text-foreground">
      {/* Trust elements bar */}
      <ShopFeaturesBar />

      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Categories Section */}
        <CategoriesSectionGrid
          categories={topLevelCategories}
          loading={categoriesLoading}
        />

        {/* Promo banner placeholder */}
        <div className="mb-6">
          {serverBanners && serverBanners.length > 1 ? (
            <div className="w-full relative rounded-3xl overflow-hidden shadow-xs border border-border/80 bg-zinc-950 min-h-[160px] flex items-center font-inter p-8 md:p-12">
              <div
                className="absolute inset-0 z-0 bg-cover bg-center opacity-30 hover:scale-102 transition-transform duration-[10s]"
                style={{ backgroundImage: `url('${serverBanners[1].image}')` }}
              />
              <div className="absolute inset-0 z-10 bg-gradient-to-r from-black via-black/80 to-transparent" />
              <div className="relative z-20 max-w-xl space-y-2 text-white">
                {serverBanners[1].badge && (
                  <span className="inline-block text-[9px] font-black bg-primary text-white px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {serverBanners[1].badge}
                  </span>
                )}
                <h3 className="text-lg md:text-xl font-black tracking-tight leading-tight">
                  {serverBanners[1].title}
                </h3>
                {serverBanners[1].subtitle && (
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed font-semibold">
                    {serverBanners[1].subtitle}
                  </p>
                )}
                {serverBanners[1].ctaLink && (
                  <div className="pt-2">
                    <Link href={serverBanners[1].ctaLink}>
                      <Button className="bg-primary hover:bg-primary/90 text-white text-[10px] font-black uppercase tracking-widest h-8 px-4 rounded-xl shadow-xs transition-all hover:scale-[1.02] cursor-pointer">
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
          <div className="flex items-end justify-between border-b border-border/60 pb-4 select-none">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                Pre-Configured
              </span>
              <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
                Complete Solar Packages
              </h2>
            </div>
            <Link
              href="/packages"
              className="text-xs font-black uppercase tracking-wider text-primary hover:underline transition-colors flex items-center gap-1 cursor-pointer"
            >
              View All Packages <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {productsLoading
              ? Array.from({ length: 3 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-72 rounded-2xl" />
                ))
              : featuredPackages.map((pkg: Product) => (
                  <ProductCard key={pkg._id} item={pkg} />
                ))}
          </div>
        </div>

        {/* Best Selling Hardware section */}
        <div className="space-y-8">
          <div className="flex items-end justify-between border-b border-border/60 pb-4 select-none">
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
                  <div className="flex items-end justify-between border-b border-border/60 pb-4 select-none">
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

        {/* Offers and history segments */}
        <SpecialOffers offers={topOffers} />

        <ViewHistoryComp />
      </div>
    </section>
  );
};

export default ShopPageComp;
