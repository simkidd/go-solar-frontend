"use client";
import { Category, Product } from "@/interfaces/product.interface";
import { Pagination, Slider } from "@nextui-org/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ProductCard from "./ProductCard";

const ProductsList: React.FC<{
  categories: Category[];
  products: Product[];
  category?: Category;
}> = ({ products, categories, category }) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [priceRange, setPriceRange] = useState<number | number[]>([
    250, 5000000,
  ]);
  const [tempPriceRange, setTempPriceRange] = useState<number[]>([
    100, 5000000,
  ]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const [page, setPage] = useState<number>(initialPage);

  const postsPerPage = 4;

  const totalPages = Math.ceil(filteredProducts.length / postsPerPage);

  const brands = Array.from(new Set(products.map((product) => product.brand)));

  useEffect(() => {
    let filtered = [...products];

    // filtered by price range
    if (Array.isArray(priceRange)) {
      filtered = filtered.filter(
        (product) =>
          product.price >= priceRange[0] && product.price <= priceRange[1]
      );
    }

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
    setFilteredProducts(filtered);
    setPage(1);
  }, [products, priceRange, selectedBrands, sortBy]);

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  useEffect(() => {
    setPage(initialPage);
  }, [initialPage]);

  const handlePriceApply = () => {
    setPriceRange(tempPriceRange);
  };

  const isActive = (href: string) => {
    return (
      href === pathname ||
      href === pathname.replace(/\/$/, "") ||
      pathname.startsWith(href + "/")
    );
  };

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      const query = {
        ...Object.fromEntries(searchParams.entries()),
        page: String(newPage),
      };
      const url = `${pathname}?${new URLSearchParams(query).toString()}`;
      router.push(url);
      scrollTo(0, 0);
    },
    [pathname, router, searchParams]
  );

  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [page, filteredProducts]);

  return (
    <div className="grid lg:grid-cols-9 grid-cols-1 gap-8">
      <div className="col-span-2 bg-white dark:bg-[#222327] hidden lg:block">
        <div className="mb-1 px-3">
          <h4 className="font-bold text-sm mb-3 uppercase">Categories</h4>
          <ul className="text-sm">
            {categories.map((category) => (
              <li key={category?._id}>
                <Link
                  href={`/${category?.slug}/products`}
                  className={`flex items-center px-4 py-2 gap-1 hover:bg-gray-300 ${
                    isActive(`/${category?.slug}/products`) &&
                    "text-primary bg-primary bg-opacity-10"
                  }`}
                >
                  {category?.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <hr className="my-2" />
        <div className="mb-1 px-3">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-sm uppercase">Price (₦)</h4>
            <button
              className="text-primary text-sm uppercase"
              onClick={handlePriceApply}
            >
              Apply
            </button>
          </div>
          <Slider
            label="Price"
            size="sm"
            step={50}
            minValue={250}
            maxValue={10000000}
            defaultValue={priceRange}
            // formatOptions={{ style: "currency", currency: "NGN" }}
            className="max-w-md"
            value={tempPriceRange}
            onChange={(value) => setTempPriceRange(value as [number, number])}
          />
        </div>
        <hr className="my-2" />

        {brands.length > 0 && (
          <div className=" px-3">
            <h4 className="font-bold text-sm mb-3 uppercase">Brand</h4>
            <ul className="space-y-2 text-sm h-[200px] overflow-y-auto">
              {brands.map((brand) => (
                <li key={brand}>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="accent-primary h-3 w-3"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                    />
                    <span className="ml-2">{brand}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="lg:col-span-7 col-span-1">
        <div className="flex flex-col border mb-4 shadow text-sm">
          <div className="px-4 py-2 flex items-center justify-between border-b">
            <p className="font-bold text-lg">
              {!category ? (
                <span>Shop Online</span>
              ) : (
                <span>{category?.name}</span>
              )}
            </p>

            <div>
              <span>Sort By</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="ml-2 border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:border-blue-500"
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
            <p>{filteredProducts?.length} products found</p>
          </div>
        </div>
        {paginatedProducts.length < 1 ? (
          <div>No product found</div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginatedProducts?.map((product) => (
                <ProductCard key={product?._id} item={product} />
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <Pagination
                showControls
                total={totalPages}
                page={page}
                onChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsList;
