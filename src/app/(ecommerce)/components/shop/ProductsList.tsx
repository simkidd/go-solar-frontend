"use client";
import useCategories from "@/hooks/useCategories";
import useProducts from "@/hooks/useProducts";
import { Product } from "@/interfaces/product.interface";
import { Pagination, Skeleton } from "@heroui/react";
import { ArrowLeftCircleIcon, FilterIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import FilterComp from "./FilterComp";
import ProductCard from "./ProductCard";

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

  // Memoize publishedProducts to avoid unnecessary recalculations
  const publishedProducts = useMemo(
    () => allProducts.filter((product) => product.isPublished),
    [allProducts]
  );

  // Find the category based on the categorySlug
  const category = useMemo(
    () => allCategories.find((cat) => cat.slug === categorySlug),
    [allCategories, categorySlug]
  );

  // Filter products by category and search query
  const filteredProducts = useMemo(() => {
    let filtered = [...publishedProducts];

    // Filter by category if categorySlug is provided
    if (categorySlug) {
      filtered = filtered.filter(
        (product) => product.category?.slug === categorySlug
      );
    }

    // Filter by search query if query is provided
    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerCaseQuery) ||
          product.description.toLowerCase().includes(lowerCaseQuery) ||
          product.brand.toLowerCase().includes(lowerCaseQuery)
      );
    }

    return filtered;
  }, [publishedProducts, categorySlug, query]);

  const [priceRange, setPriceRange] = useState<number[]>([50000, 5000000]);
  const [tempPriceRange, setTempPriceRange] = useState<number[]>([
    50000, 5000000,
  ]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [tempSelectedBrands, setTempSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const [page, setPage] = useState<number>(initialPage);
  const [openFilter, setOpenFilter] = useState(false);
  const itemPerPage = 4;
  const totalPages = Math.ceil(filteredProducts.length / itemPerPage);

  const brands = useMemo(
    () => Array.from(new Set(filteredProducts.map((product) => product.brand))),
    [filteredProducts]
  );

  // Apply filters and sorting
  const finalFilteredProducts = useMemo(() => {
    let filtered = [...filteredProducts];
  
    // Filter by price range
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );
  
    // Filter by brand
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) =>
        selectedBrands.includes(product.brand)
      );
    }
  
    // Apply sorting
    switch (sortBy) {
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        break;
    }
  
    return filtered;
  }, [filteredProducts, priceRange, selectedBrands, sortBy]);
  

  // Handle brand selection
  const handleBrandChange = (brand: string) => {
    setTempSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Handle apply filters
  const handleApplyFilters = () => {
    setPriceRange(tempPriceRange);
    setSelectedBrands(tempSelectedBrands);
    setOpenFilter(false);
  };

  // Handle page change
  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);

      // Create a new query object with existing search params
      const query = new URLSearchParams(searchParams.toString());
      query.set("page", String(newPage)); // Update the "page" parameter

      // Construct the new URL
      const url = `${pathname}?${query.toString()}`;

      // Push the new URL to the router
      router.push(url, { scroll: false }); // Disable automatic scrolling
      window.scrollTo(0, 0); // Manually scroll to the top
    },
    [pathname, router, searchParams]
  );

  // Paginate products
  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * itemPerPage;
    const endIndex = startIndex + itemPerPage;
    return finalFilteredProducts.slice(startIndex, endIndex);
  }, [page, finalFilteredProducts]);

  const handleResetFilters = () => {
    setTempPriceRange([50000, 5000000]); // Reset price range
    setPriceRange([50000, 5000000]); // Reset applied price range
    setSelectedBrands([]); // Reset selected brands
    setTempSelectedBrands([]);
    setOpenFilter(false);
    setPage(1)
  };

  // Skeleton loading for products
  const renderSkeletons = (count: number) => {
    return Array.from({ length: count }).map((_, index) => (
      <div key={index} className="space-y-3">
        <Skeleton className="h-40 rounded-lg" />
        <Skeleton className="h-4 w-3/4 rounded-lg" />
        <Skeleton className="h-4 w-1/2 rounded-lg" />
      </div>
    ));
  };

  // Loading state
  if (productsLoading || categoriesLoading) {
    return (
      <div className="grid lg:grid-cols-9 grid-cols-1 gap-8">
        {/* Sidebar Skeletons */}
        <div className="col-span-2 bg-white dark:bg-[#222327] hidden lg:block">
          <div className="mb-1 px-3">
            <Skeleton className="h-6 w-1/2 rounded-lg mb-3" />
            <ul className="space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-8 rounded-lg" />
              ))}
            </ul>
          </div>
          <hr className="my-2" />
          <div className="mb-1 px-3">
            <Skeleton className="h-6 w-1/2 rounded-lg mb-3" />
            <Skeleton className="h-10 rounded-lg" />
          </div>
          <hr className="my-2" />
          <div className="px-3">
            <Skeleton className="h-6 w-1/2 rounded-lg mb-3" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-6 rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Skeletons */}
        <div className="lg:col-span-7 col-span-1">
          <div className="flex flex-col border mb-4 shadow text-sm">
            <div className="px-4 py-2 flex items-center justify-between border-b">
              <Skeleton className="h-6 w-1/4 rounded-lg" />
              <Skeleton className="h-6 w-1/4 rounded-lg" />
            </div>
            <div className="px-4 py-2 flex items-center justify-between">
              <Skeleton className="h-6 w-1/4 rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {renderSkeletons(8)}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (productsError || categoriesError) {
    return <div>Error loading products. Please try again later.</div>;
  }

  return (
    <div className="grid lg:grid-cols-9 grid-cols-1 gap-8">
      <div className="col-span-2 hidden lg:block">
        {/* Sidebar */}
        <FilterComp
          categories={allCategories}
          priceRange={priceRange}
          tempPriceRange={tempPriceRange}
          setTempPriceRange={setTempPriceRange}
          selectedBrands={tempSelectedBrands}
          handleBrandChange={handleBrandChange}
          brands={brands}
          handleApplyFilters={handleApplyFilters}
          handleResetFilters={handleResetFilters}
        />
      </div>

      {/* Main Content */}
      <div className="lg:col-span-7 col-span-1">
        <div className="flex flex-col border rounded-lg dark:border-gray-500 mb-4 shadow text-sm">
          <div className="px-4 py-2 flex items-center justify-between border-b dark:border-gray-500">
            <p className="font-bold text-lg">
              {query
                ? `Search Results for "${query}"`
                : category
                ? category.name
                : "Shop Online"}
            </p>
            <div className="flex items-center gap-4">
              {/* Sort By Dropdown */}
              <span className="hidden md:block">Sort By</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="ml-2 border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:border-primary"
              >
                <option value="name-asc">A-Z</option>
                <option value="name-desc">Z-A</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
          <div className="px-4 py-2 flex items-center justify-between">
            <p>
              Showing{" "}
              <span className="text-primary font-semibold">
                {Math.min(
                  (page - 1) * itemPerPage + 1,
                  filteredProducts.length
                )}{" "}
                - {Math.min(page * itemPerPage, filteredProducts.length)}
              </span>{" "}
              of {filteredProducts.length} products
            </p>

            {/* Filter Button (visible on small screens) */}
            <button
              className="lg:hidden flex items-center gap-2 text-sm bg-primary text-white px-3 py-1 rounded-md"
              onClick={() => setOpenFilter(!openFilter)}
            >
              <FilterIcon size={16} />
              Filters
            </button>
          </div>
        </div>
        {paginatedProducts.length < 1 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
                No Products Found
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {query
                  ? `We couldn't find any products matching "${query}". Try adjusting your search or browse other categories.`
                  : "We couldn't find any products matching your filters. Try adjusting your search or browse other categories."}
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-6 px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark transition-colors duration-300"
              >
                Reset Filters
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginatedProducts?.map((product) => (
                <ProductCard key={product?._id} item={product} />
              ))}
            </div>
            <div className="flex justify-center mt-8">
              {totalPages > 1 && (
                <Pagination
                  showControls
                  total={totalPages}
                  page={page}
                  onChange={handlePageChange}
                />
              )}
            </div>
          </>
        )}
      </div>

      {/* filter on mobile */}
      {openFilter && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setOpenFilter(false)}
        ></div>
      )}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-full max-w-[300px] bg-white dark:bg-[#222327] shadow-lg z-50 transition-transform duration-300 ease-in-out overflow-y-auto scrollbar-hide ${
          openFilter ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="pt-4 px-3">
          <button
            className="flex items-center ml-auto cursor-pointer text-primary"
            onClick={() => setOpenFilter(false)}
          >
            <ArrowLeftCircleIcon size={16} />
            <span className="ml-1">Back</span>
          </button>
        </div>
        <div className="w-full pb-4">
          <FilterComp
            categories={allCategories}
            priceRange={priceRange}
            tempPriceRange={tempPriceRange}
            setTempPriceRange={setTempPriceRange}
            selectedBrands={selectedBrands}
            handleBrandChange={handleBrandChange}
            brands={brands}
            handleApplyFilters={handleApplyFilters}
            handleResetFilters={handleResetFilters}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsList;
