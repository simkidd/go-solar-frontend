"use client";
import React from "react";
import { Category } from "@/interfaces/product.interface";
import { Button } from "@/components/ui/button";
import { CustomSlider } from "@/components/custom/CustomSlider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 shadow-xs font-inter space-y-6">
      
      {/* Categories */}
      <div className="space-y-3">
        <h4 className="font-bold text-xs text-zinc-400 uppercase tracking-widest">Categories</h4>
        <ScrollArea className="max-h-[180px]">
          <ul className="text-xs font-semibold space-y-1">
            {categories.map((category) => (
              <li key={category._id}>
                <Link
                  href={`/${category.slug}/products`}
                  className={`flex items-center px-3 py-2 rounded-xl transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 ${
                    isActive(`/${category.slug}/products`)
                      ? "text-[#08AA08] bg-[#08AA08]/5 font-extrabold"
                      : "text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>

      <hr className="border-zinc-100 dark:border-zinc-800" />

      {/* Price filter slider */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-xs text-zinc-400 uppercase tracking-widest">Price Filter</h4>
          <span className="text-[10px] font-extrabold text-[#08AA08] bg-[#08AA08]/5 px-2 py-0.5 rounded-md">
            Max: ₦{tempPriceRange[0]?.toLocaleString()}
          </span>
        </div>

        <CustomSlider
          min={50000}
          max={5000000}
          value={tempPriceRange}
          onValueChange={(val) => setTempPriceRange([val[0]])}
        />
        <div className="flex justify-between text-[10px] text-zinc-400 font-bold">
          <span>₦50k</span>
          <span>₦5M</span>
        </div>
      </div>

      <hr className="border-zinc-100 dark:border-zinc-800" />

      {/* Brands check */}
      {brands.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-bold text-xs text-zinc-400 uppercase tracking-widest">Brand</h4>
          <ScrollArea className="max-h-[140px]">
            <ul className="space-y-2 text-xs font-semibold pr-1">
              {brands.map((brand) => (
                <li key={brand}>
                  <label className="flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="accent-primary h-3.5 w-3.5 rounded border-zinc-300 text-primary focus:ring-primary"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                    />
                    <span className="ml-2.5 text-zinc-700 dark:text-zinc-300">{brand}</span>
                  </label>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      )}

      {/* Apply and Reset Buttons */}
      <div className="flex gap-2.5 pt-2">
        <Button 
          className="w-full bg-[#08AA08] hover:bg-[#079907] text-white font-bold text-xs uppercase tracking-wider rounded-xl h-10" 
          onClick={handleApplyFilters}
        >
          Apply
        </Button>
        <Button 
          variant="outline"
          className="w-full border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs uppercase tracking-wider rounded-xl h-10" 
          onClick={handleResetFilters}
        >
          Reset
        </Button>
      </div>

    </div>
  );
};

export default FilterComp;
