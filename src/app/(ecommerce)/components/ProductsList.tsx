"use client";
import { Category, Product } from "@/interfaces/product.interface";
import { Slider } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Link from "next/link";

const ProductsList: React.FC<{
  categories: Category[];
  products: Product[];
}> = ({ products, categories }) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [priceRange, setPriceRange] = useState<number | number[]>([
    250, 5000000,
  ]);
  const [tempPriceRange, setTempPriceRange] = useState<number[]>([
    100, 5000000,
  ]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");

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
  }, [products, priceRange, selectedBrands, sortBy]);

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handlePriceApply = () => {
    setPriceRange(tempPriceRange);
  };

  return (
    <div className="grid grid-cols-9 gap-8">
      <div className="col-span-2 bg-white dark:bg-[#222327]">
        <div className="mb-1">
          <h4 className="font-bold text-sm mb-3 uppercase">Categories</h4>
          <ul className="text-sm">
            {categories.map((category) => (
              <li key={category._id}>
                <Link
                  href={`/${category.slug}/products`}
                  className="flex items-center px-4 py-2 gap-1 hover:bg-gray-300"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <hr className="my-2" />
        <div className="mb-1">
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
        <div>
          <h4 className="font-bold text-sm mb-3 uppercase">Brand</h4>
          <ul className="space-y-2 text-sm h-[200px] overflow-y-auto">
            {brands.map((brand) => (
              <li key={brand}>
                <label className="flex items-center">
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
      </div>

      <div className="col-span-7">
        <div className="flex px-4 py-2 items-center justify-between border mb-4 shadow text-sm">
          <p>{filteredProducts?.length} products found</p>

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
        {filteredProducts.length < 1 ? (
          <div>No product found</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts?.map((product) => (
              <ProductCard key={product?._id} item={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsList;
