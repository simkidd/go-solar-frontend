"use client";
import { Button } from "@/components/ui/button";
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
        searchRoute = "/products/search";
      } else if (pathname === "/blog") {
        searchRoute = "/blog/search";
      } else if (pathname.includes("search")) {
        // If already on a search page, use the current pathname
        searchRoute = pathname;
      } else if (pathname.match(/\/products\/[^\/]+/)) {
        // If on a '/products/[slug]' route, go to '/products/search'
        searchRoute = "/products/search";
      } else if (
        pathname.includes("products") &&
        !pathname.includes("search")
      ) {
        // If on a '/[slug]/products' route, append '/search'
        searchRoute = "/products/search";
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
      className="w-full flex items-center border border-primary rounded-[12px] bg-white dark:bg-zinc-900 overflow-hidden"
    >
      {/* Category Dropdown (Conditional) */}
      {showCategoryDropdown && categories && (
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="lg:w-[160px] w-max h-9 lg:h-10 px-3 bg-transparent text-xs font-bold focus:outline-none border-r border-zinc-150 dark:border-zinc-800 text-zinc-700 dark:text-zinc-350 cursor-pointer"
        >
          {categoriesWithAll.map((cat) => (
            <option key={cat.slug} value={cat.slug} className="dark:bg-zinc-900 text-zinc-800 dark:text-white">
              {cat.name}
            </option>
          ))}
        </select>
      )}

      {/* Search Input */}
      <input
        type="text"
        placeholder={placeholder}
        value={term || ""}
        onChange={(e) => setTerm(e.target.value)}
        className="flex-1 focus:outline-none h-9 lg:h-10 py-2 px-3 bg-transparent text-xs text-zinc-800 dark:text-white"
      />

      {/* Search Button */}
      <Button type="submit" className="rounded-none h-9 lg:h-10 bg-primary hover:bg-primary/90 text-white shrink-0 px-4">
        <SearchIcon className="h-4.5 w-4.5" />
      </Button>
    </form>
  );
};

export default Search;
