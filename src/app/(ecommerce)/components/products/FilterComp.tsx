"use client";
import { Category } from "@/interfaces/product.interface";
import { Button, Slider } from "@heroui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface FilterCompProps {
  categories: Category[];
  priceRange: number[];
  tempPriceRange: number[];
  setTempPriceRange: (value: number[]) => void;
  selectedBrands: string[];
  handleBrandChange: (brand: string) => void;
  handleApplyFilters: () => void;
  handleResetFilters: () => void;
  brands: string[];
}

const FilterComp: React.FC<FilterCompProps> = ({
  categories,
  priceRange,
  tempPriceRange,
  setTempPriceRange,
  selectedBrands,
  handleBrandChange,
  handleApplyFilters,
  brands,
  handleResetFilters,
}) => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return (
      href === pathname ||
      href === pathname.replace(/\/$/, "") ||
      pathname.startsWith(href + "/")
    );
  };

  return (
    <div className="w-full bg-white dark:bg-[#222327]">
      <div className="mb-1 px-3">
        <h4 className="font-bold text-sm mb-3 uppercase">Categories</h4>
        <ul className="text-sm max-h-[200px] overflow-y-auto">
          {categories.map((category) => (
            <li key={category._id}>
              <Link
                href={`/${category.slug}/products`}
                className={`flex items-center px-4 py-2 gap-1 hover:bg-gray-300 dark:hover:bg-gray-300/10 ${
                  isActive(`/${category.slug}/products`) &&
                  "text-primary bg-primary bg-opacity-10"
                }`}
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <hr className="my-2" />
      <div className="mb-1 px-3">
        <h4 className="font-bold text-sm uppercase mb-3">Price (₦)</h4>

        <Slider
          label="Price"
          size="sm"
          step={50}
          minValue={50000}
          maxValue={5000000}
          defaultValue={priceRange}
          className="max-w-md"
          value={tempPriceRange}
          onChange={(value) => setTempPriceRange(value as [number, number])}
        />
      </div>
      <hr className="my-2" />
      {brands.length > 0 && (
        <div className="px-3">
          <h4 className="font-bold text-sm mb-3 uppercase">Brand</h4>
          <ul className="space-y-2 text-sm max-h-[100px] overflow-y-auto">
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

      {/* Apply and Reset Buttons */}
      <div className="flex gap-2 px-3 mt-4">
        <Button color="primary" className="w-full" onClick={handleApplyFilters}>
          Apply
        </Button>
        <Button className="w-full" onClick={handleResetFilters}>
          Reset
        </Button>
      </div>
    </div>
  );
};

export default FilterComp;
