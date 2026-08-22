"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import useCategories from "@/hooks/useCategories";
import { usePublishedProductsQuery } from "@/hooks/queries/useProductsQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftCircleIcon,
  FilterIcon,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FilterComp from "./FilterComp";
import ProductCard from "./ProductCard";
import FaqNewsletterSection from "@/components/home/FaqNewsletterSection";
import { useActiveBannersQuery } from "@/hooks/queries/useBannersQuery";
import Link from "next/link";

const ProductsList = ({
  categorySlug,
  query,
}: {
  categorySlug?: string;
  query?: string;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    categories: allCategories,
    isLoading: categoriesLoading,
    isError: categoriesError,
    refetch: refetchCategories,
  } = useCategories();

  const { data: serverBanners = [] } = useActiveBannersQuery();

  // Find the category based on the categorySlug
  const category = useMemo(
    () => allCategories.find((cat) => cat.slug === categorySlug),
    [allCategories, categorySlug],
  );

  const itemPerPage = 20;

  // Parse filters directly from URL searchParams
  const activeSort = searchParams.get("sort") || "newest";
  const activeMinPrice = parseInt(searchParams.get("minPrice") || "50000", 10);
  const activeMaxPrice = parseInt(
    searchParams.get("maxPrice") || "10000000",
    10,
  );
  const activeBrands = useMemo(() => {
    const brandsParam = searchParams.get("brands");
    return brandsParam ? brandsParam.split(",") : [];
  }, [searchParams]);
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Local state for sidebar (before applying)
  const [tempPriceRange, setTempPriceRange] = useState<number[]>([
    activeMinPrice,
    activeMaxPrice,
  ]);
  const [tempSelectedBrands, setTempSelectedBrands] =
    useState<string[]>(activeBrands);
  const [openFilter, setOpenFilter] = useState(false);

  // Keep sidebar in sync with URL changes (e.g. resets, browser navigation)
  useEffect(() => {
    setTempPriceRange([activeMinPrice, activeMaxPrice]);
    setTempSelectedBrands(activeBrands);
  }, [activeMinPrice, activeMaxPrice, activeBrands]);

  // Fetch published products filtered, sorted, and paginated from the backend
  const {
    data: productsRes,
    isLoading: productsLoading,
    isError: productsError,
    refetch: refetchProducts,
  } = usePublishedProductsQuery({
    page,
    limit: itemPerPage,
    q: searchParams.get("q") || query || undefined,
    category: category?._id || undefined,
    sort: searchParams.get("sort") || undefined,
    minPrice: searchParams.get("minPrice") ? activeMinPrice : undefined,
    maxPrice: searchParams.get("maxPrice") ? activeMaxPrice : undefined,
    brands: searchParams.get("brands") || undefined,
  });

  const publishedProducts = productsRes?.products || [];
  const totalProductsCount = productsRes?.pagination?.total || 0;
  const totalPages = productsRes?.pagination?.pages || 1;

  const brands = productsRes?.brands || [];

  const handleBrandChange = (brand: string) => {
    setTempSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("minPrice", String(tempPriceRange[0]));
    params.set("maxPrice", String(tempPriceRange[1]));
    if (tempSelectedBrands.length > 0) {
      params.set("brands", tempSelectedBrands.join(","));
    } else {
      params.delete("brands");
    }
    params.set("page", "1"); // Reset to page 1 when filters are applied

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setOpenFilter(false);
  };

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(newPage));
      const url = `${pathname}?${params.toString()}`;
      router.push(url, { scroll: false });
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [pathname, router, searchParams],
  );

  const paginatedProducts = publishedProducts;

  const firstRow = useMemo(
    () => paginatedProducts.slice(0, 8),
    [paginatedProducts],
  );
  const secondRow = useMemo(
    () => paginatedProducts.slice(8),
    [paginatedProducts],
  );
  const promoBanner = useMemo(() => {
    return serverBanners.find(
      (b: any) => b.placement === "storefront_promo_strip",
    );
  }, [serverBanners]);

  const handleResetFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("brands");
    params.delete("sort");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setOpenFilter(false);
  };

  const renderSkeletons = (count: number) => {
    return Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="space-y-3 p-4 border rounded-2xl bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800"
      >
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-4 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-1/2 rounded-md" />
      </div>
    ));
  };

  if (productsLoading || categoriesLoading) {
    return (
      <div className="grid lg:grid-cols-9 grid-cols-1 gap-8 font-inter">
        <div className="col-span-2 hidden lg:block space-y-4">
          <Skeleton className="h-8 w-1/2 rounded-lg" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-xl" />
          ))}
        </div>

        <div className="lg:col-span-7 col-span-1 space-y-6">
          <div className="h-14 border rounded-2xl border-zinc-150 dark:border-zinc-850 bg-white dark:bg-zinc-900" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {renderSkeletons(8)}
          </div>
        </div>
      </div>
    );
  }

  if (productsError || categoriesError) {
    return (
      <div className="w-full flex items-center justify-center py-16 px-4 font-inter">
        <div className="flex flex-col items-center max-w-sm text-center space-y-4">
          <AlertCircle className="w-8 h-8 text-zinc-400 dark:text-zinc-500 stroke-[1.5]" />
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Failed to load products
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
              className="text-xs rounded-xl text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50"
            >
              <Link href="/">Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-16">
      <div className="grid lg:grid-cols-9 grid-cols-1 gap-8 font-inter">
        <div className="col-span-2 hidden lg:block">
          <FilterComp
            categories={allCategories}
            priceRange={[activeMinPrice, activeMaxPrice]}
            tempPriceRange={tempPriceRange}
            setTempPriceRange={setTempPriceRange}
            selectedBrands={tempSelectedBrands}
            handleBrandChange={handleBrandChange}
            brands={brands}
            handleApplyFilters={handleApplyFilters}
            handleResetFilters={handleResetFilters}
          />
        </div>

        <div className="lg:col-span-7 col-span-1 space-y-6">
          <div className="flex flex-col border rounded-3xl border-zinc-150 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs text-xs font-semibold">
            <div className="px-6 py-4 flex items-center justify-between border-b dark:border-zinc-800">
              <p className="font-extrabold text-base text-zinc-900 dark:text-white tracking-tight">
                {query
                  ? `Search Results for "${query}"`
                  : category
                    ? category.name
                    : "Shop Online"}
              </p>
              <div className="flex items-center gap-2">
                <span className="hidden md:block text-zinc-400">Sort By:</span>
                <select
                  value={activeSort}
                  onChange={(e) => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("sort", e.target.value);
                    params.set("page", "1"); // Reset page on sort change
                    router.push(`${pathname}?${params.toString()}`, {
                      scroll: false,
                    });
                  }}
                  className="border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 focus:outline-none bg-transparent cursor-pointer font-bold"
                >
                  <option value="name-asc" className="dark:bg-zinc-900">
                    A-Z
                  </option>
                  <option value="name-desc" className="dark:bg-zinc-900">
                    Z-A
                  </option>
                  <option value="newest" className="dark:bg-zinc-900">
                    Newest
                  </option>
                  <option value="price-asc" className="dark:bg-zinc-900">
                    Price: Low to High
                  </option>
                  <option value="price-desc" className="dark:bg-zinc-900">
                    Price: High to Low
                  </option>
                </select>
              </div>
            </div>
            <div className="px-6 py-3 flex items-center justify-between text-zinc-500">
              <p>
                Showing{" "}
                <span className="text-primary font-bold">
                  {totalProductsCount > 0 ? (page - 1) * itemPerPage + 1 : 0} -{" "}
                  {Math.min(page * itemPerPage, totalProductsCount)}
                </span>{" "}
                of {totalProductsCount} products
              </p>

              <Button
                className="lg:hidden bg-primary hover:bg-primary/90 text-white rounded-xl gap-1.5 h-8 text-[10px]"
                onClick={() => setOpenFilter(!openFilter)}
              >
                <FilterIcon size={12} />
                Filters
              </Button>
            </div>
          </div>

          {totalProductsCount < 1 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 bg-white dark:bg-zinc-900 border rounded-3xl border-zinc-150 dark:border-zinc-800 p-8 shadow-xs">
              <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">
                No Products Found
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm leading-relaxed">
                {query
                  ? `We couldn't find any products matching "${query}". Try adjusting your search or filters.`
                  : "We couldn't find any products matching your filters. Try resetting filters."}
              </p>
              <Button
                onClick={handleResetFilters}
                className="bg-[#08AA08] hover:bg-[#079907] text-white rounded-xl font-bold px-6 text-xs uppercase"
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {firstRow.map((product) => (
                  <ProductCard key={product?._id} item={product} />
                ))}
              </div>

              {secondRow.length > 0 && promoBanner && (
                <div className="w-full relative rounded-3xl overflow-hidden shadow-xs border border-zinc-150 dark:border-zinc-800 bg-zinc-950 p-6 md:p-8 min-h-[140px] flex items-center">
                  <div
                    className="absolute inset-0 z-0 bg-cover bg-center opacity-30 hover:scale-102 transition-transform duration-[10s]"
                    style={{ backgroundImage: `url('${promoBanner.image}')` }}
                  />
                  <div className="absolute inset-0 z-10 bg-linear-to-r from-black via-black/80 to-transparent" />
                  <div className="relative z-20 space-y-2 text-white max-w-xl">
                    {promoBanner.badge && (
                      <span className="inline-block text-[8px] font-bold text-[#08AA08] bg-[#08AA08]/10 px-2 py-0.5 rounded-md uppercase tracking-widest">
                        {promoBanner.badge}
                      </span>
                    )}
                    <h4 className="text-sm md:text-base font-extrabold tracking-tight leading-snug">
                      {promoBanner.title}
                    </h4>
                    {promoBanner.subtitle && (
                      <p className="text-[11px] text-zinc-350 leading-relaxed line-clamp-1 font-semibold">
                        {promoBanner.subtitle}
                      </p>
                    )}
                    {promoBanner.ctaLink && (
                      <Link
                        href={promoBanner.ctaLink}
                        className="inline-block text-[10px] font-bold text-[#08AA08] hover:underline"
                      >
                        {promoBanner.ctaText || "Configure Setup"} →
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {secondRow.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {secondRow.map((product) => (
                    <ProductCard key={product?._id} item={product} />
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 pt-6 border-t border-zinc-100 dark:border-zinc-850">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="gap-1 rounded-xl text-zinc-700 dark:text-zinc-300"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-xs font-semibold text-zinc-500 px-4">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="gap-1 rounded-xl text-zinc-700 dark:text-zinc-300"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {openFilter && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
            onClick={() => setOpenFilter(false)}
          />
        )}

        <div
          className={`lg:hidden fixed top-0 left-0 h-full w-full max-w-[280px] bg-white dark:bg-zinc-950 shadow-xl z-50 transition-transform duration-300 ease-in-out overflow-y-auto scrollbar-hide border-r dark:border-zinc-900 ${
            openFilter ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="pt-4 px-4 flex justify-between items-center">
            <span className="text-xs font-extrabold uppercase text-zinc-400">
              Filters
            </span>
            <button
              className="flex items-center text-xs font-bold text-primary gap-1"
              onClick={() => setOpenFilter(false)}
            >
              <ArrowLeftCircleIcon size={14} />
              <span>Back</span>
            </button>
          </div>
          <div className="w-full p-4">
            <FilterComp
              categories={allCategories}
              priceRange={[activeMinPrice, activeMaxPrice]}
              tempPriceRange={tempPriceRange}
              setTempPriceRange={setTempPriceRange}
              selectedBrands={tempSelectedBrands}
              handleBrandChange={handleBrandChange}
              brands={brands}
              handleApplyFilters={handleApplyFilters}
              handleResetFilters={handleResetFilters}
            />
          </div>
        </div>
      </div>
      <FaqNewsletterSection />
    </div>
  );
};

export default ProductsList;
