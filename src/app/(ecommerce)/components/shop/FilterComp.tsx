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

  const categoryTree = React.useMemo(() => {
    const topLevel = categories.filter((c) => !c.parent);
    return topLevel.map((parent) => ({
      ...parent,
      subcategories: categories.filter((c) => {
        const parentId =
          typeof c.parent === "object" ? c.parent?._id : c.parent;
        return parentId === parent._id;
      }),
    }));
  }, [categories]);

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 shadow-xs font-inter space-y-6">
      {/* Categories Tree */}
      <div className="space-y-3">
        <h4 className="font-bold text-xs text-zinc-400 uppercase tracking-widest">
          Categories
        </h4>
        <ScrollArea className="max-h-[300px]">
          <div className="text-xs font-semibold space-y-2 pr-2">
            {categoryTree.map((parent) => {
              const isParentActive = isActive(`/${parent.slug}/products`);
              const hasActiveSubcategory = parent.subcategories.some((sub) =>
                isActive(`/${sub.slug}/products`),
              );
              const shouldExpand = isParentActive || hasActiveSubcategory;

              return (
                <div key={parent._id} className="space-y-1">
                  <Link
                    href={`/${parent.slug}/products`}
                    className={`flex items-center px-3 py-2 rounded-xl transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 ${
                      isParentActive
                        ? "text-[#08AA08] bg-[#08AA08]/5 font-extrabold"
                        : "text-zinc-700 dark:text-zinc-300 font-bold"
                    }`}
                  >
                    {parent.name}
                  </Link>
                  {shouldExpand && parent.subcategories.length > 0 && (
                    <ul className="pl-4 space-y-1 border-l border-zinc-100 dark:border-zinc-800 ml-3.5">
                      {parent.subcategories.map((sub) => (
                        <li key={sub._id}>
                          <Link
                            href={`/${sub.slug}/products`}
                            className={`flex items-center px-3 py-1.5 rounded-lg transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 text-[11px] ${
                              isActive(`/${sub.slug}/products`)
                                ? "text-[#08AA08] font-extrabold"
                                : "text-zinc-550 dark:text-zinc-400 font-medium"
                            }`}
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      <hr className="border-zinc-100 dark:border-zinc-800" />

      {/* Price filter section */}
      <div className="space-y-4">
        <h4 className="font-bold text-xs text-zinc-400 uppercase tracking-widest">
          Price Filter
        </h4>

        {/* Min/Max Inputs */}
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-2.5 top-2 text-zinc-450 dark:text-zinc-500 text-xs font-bold select-none">
              ₦
            </span>
            <input
              type="text"
              value={
                tempPriceRange[0] !== undefined
                  ? tempPriceRange[0].toLocaleString()
                  : ""
              }
              onChange={(e) => {
                const rawVal = e.target.value.replace(/,/g, "");
                const val = rawVal === "" ? 0 : Number(rawVal);
                if (!isNaN(val)) {
                  setTempPriceRange([val, tempPriceRange[1]]);
                }
              }}
              placeholder="Min"
              className="w-full pl-6 pr-2 py-1.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-800 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <span className="text-zinc-350 dark:text-zinc-700 text-xs font-black select-none">
            —
          </span>
          <div className="flex-1 relative">
            <span className="absolute left-2.5 top-2 text-zinc-450 dark:text-zinc-500 text-xs font-bold select-none">
              ₦
            </span>
            <input
              type="text"
              value={
                tempPriceRange[1] !== undefined
                  ? tempPriceRange[1].toLocaleString()
                  : ""
              }
              onChange={(e) => {
                const rawVal = e.target.value.replace(/,/g, "");
                const val = rawVal === "" ? 0 : Number(rawVal);
                if (!isNaN(val)) {
                  setTempPriceRange([tempPriceRange[0], val]);
                }
              }}
              placeholder="Max"
              className="w-full pl-6 pr-2 py-1.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-800 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Range Slider */}
        <CustomSlider
          min={50000}
          max={10000000}
          value={tempPriceRange}
          onValueChange={(val) => setTempPriceRange(val)}
        />
        <div className="flex justify-between text-[10px] text-zinc-400 font-bold select-none px-0.5">
          <span>₦50k</span>
          <span>₦10M</span>
        </div>
      </div>

      <hr className="border-zinc-100 dark:border-zinc-800" />

      {/* Brands check */}
      {brands.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-bold text-xs text-zinc-400 uppercase tracking-widest">
            Brand
          </h4>
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
                    <span className="ml-2.5 text-zinc-700 dark:text-zinc-300">
                      {brand}
                    </span>
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
