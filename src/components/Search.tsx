"use client";
import { Button, Select, SelectItem } from "@heroui/react";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

interface SearchProps {
  placeholder: string;
  categories?: { _id: string; name: string; slug: string }[];
}

const Search = ({ placeholder, categories }: SearchProps) => {
  const router = useRouter();
  const search = useSearchParams();
  const pathname = usePathname();
  const [term, setTerm] = useState(search.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (typeof term !== "string") {
      return;
    }

    if (term.trim()) {
      const params = new URLSearchParams();
      params.set("q", term.trim());

      // Add category to search params if selected and on a shop/product page
      if (selectedCategory !== "all" && !pathname.includes("/blog")) {
        params.set("category", selectedCategory);
      }

      let searchRoute: string;
      if (pathname === "/shop") {
        searchRoute = "/product/search";
      } else if (pathname === "/blog") {
        searchRoute = "/blog/search";
      } else if (pathname.includes("search")) {
        // If already on a search page, use the current pathname
        searchRoute = pathname;
      } else if (pathname.match(/\/product\/[^\/]+/)) {
        // If on a '/product/[slug]' route, go to '/product/search'
        searchRoute = "/product/search";
      } else if (
        pathname.includes("products") &&
        !pathname.includes("search")
      ) {
        // If on a '/[slug]/products' route, append '/search'
        searchRoute = "/product/search";
      } else {
        searchRoute = `${pathname}/search`;
      }

      router.push(`${searchRoute}?${params.toString()}`);
      setTerm("");
      setSelectedCategory("all");

      router.refresh();
    }
  };

  // Determine if the category dropdown should be shown
  const showCategoryDropdown = !pathname.includes("/blog");

  // Add "All" option to the categories list
  const categoriesWithAll = [
    { _id: "all", name: "All Categories", slug: "all" },
    ...(categories || []),
  ];

  return (
    <form
      onSubmit={handleSearch}
      className="w-full flex items-center border border-primary rounded-[12px]"
    >
      {/* Category Dropdown (Conditional) */}
      {showCategoryDropdown && categories && (
        <Select
          items={categoriesWithAll}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          defaultSelectedKeys={"all"}
          classNames={{
            popoverContent: "w-max",
            base: "lg:w-[180px] w-max",
            mainWrapper: "",
            value: "",
          }}
        >
          {(cat) => (
            <SelectItem key={cat?.slug} textValue={cat?.name}>
              {cat?.name}
            </SelectItem>
          )}
        </Select>
      )}

      {/* Search Input */}
      <input
        type="text"
        placeholder={placeholder}
        value={term || ""}
        onChange={(e) => setTerm(e.target.value)}
        className="flex-1 focus:outline-none h-9 lg:h-10 py-2 px-3 bg-transparent text-sm"
      />

      {/* Search Button */}
      <Button type="submit" color="primary">
        <SearchIcon size={18} />
      </Button>
    </form>
  );
};

export default Search;
