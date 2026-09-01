"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  X,
  ArrowRight,
  TrendingUp,
  History,
  Sparkles,
  Zap,
  ShoppingBag,
  Clock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePublishedProductsQuery } from "@/hooks/queries/useProductsQuery";
import { useCategoryTreeQuery } from "@/hooks/queries/useCategoriesQuery";
import { formatCurrency } from "@/utils/helpers";

const POPULAR_SEARCHES = [
  "Inverter 5kVA",
  "Lithium Battery 200Ah",
  "Solar Panel 550W",
  "Solar Generator",
  "Hybrid Inverter",
  "Solar Flood Lights",
  "Tubular Battery",
];

const RECENT_SEARCHES_KEY = "_goSolar_recent_searches";

interface SearchModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { data: productsRes } = usePublishedProductsQuery({
    page: 1,
    limit: 1000,
  });
  const products = productsRes?.products || [];
  const { data: categoryTree = [] } = useCategoryTreeQuery();

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save query to recent searches
  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const cleanTerm = term.trim();
    const updated = [
      cleanTerm,
      ...recentSearches.filter(
        (item) => item.toLowerCase() !== cleanTerm.toLowerCase(),
      ),
    ].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const removeRecentSearch = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter((item) => item !== term);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const clearAllRecent = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // ignore
    }
  };

  // Filter matching products
  const matchingProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return products
      .filter((product) => {
        const nameMatch = product.name?.toLowerCase().includes(q);
        const descMatch = product.description?.toLowerCase().includes(q);
        const catMatch = product.category?.name?.toLowerCase().includes(q);
        const brandMatch = product.brand?.toLowerCase().includes(q);
        return nameMatch || descMatch || catMatch || brandMatch;
      })
      .slice(0, 6);
  }, [products, query]);

  const handleNavigate = (href: string) => {
    onOpenChange(false);
    setTimeout(() => {
      router.push(href);
    }, 80);
  };

  // Handle Search Submission
  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    saveRecentSearch(searchTerm);
    setQuery("");
    handleNavigate(
      `/products/search?q=${encodeURIComponent(searchTerm.trim())}`,
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(query);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-2xl p-0 gap-0 overflow-hidden bg-card text-card-foreground border border-border/80 rounded-2xl shadow-2xl fixed left-1/2 -translate-x-1/2 top-[5%] sm:top-[8%] translate-y-0"
        hideCloseButton
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Search Products</DialogTitle>
        </DialogHeader>

        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-border/60 gap-3">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search solar panels, inverters, batteries, kits..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-0 text-sm font-medium placeholder:text-muted-foreground focus:outline-none text-foreground"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Body content */}
        <div className="max-h-[60vh] overflow-y-auto p-5 space-y-6 scrollbar-thin">
          {/* If there is a search query and results */}
          {query.trim() && matchingProducts.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  Products ({matchingProducts.length})
                </span>
                <button
                  type="button"
                  onClick={() => handleSearch(query)}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  View all results <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {matchingProducts.map((product) => {
                  const effectivePrice =
                    product.discountPrice && product.discountPrice > 0
                      ? product.discountPrice
                      : product.price;

                  return (
                    <Link
                      key={product._id}
                      href={`/shop/${product.slug || product._id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        saveRecentSearch(product.name);
                        handleNavigate(`/shop/${product.slug || product._id}`);
                      }}
                      className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-muted/40 border border-transparent hover:border-border/60 transition-all group"
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0 relative border border-border/80">
                        {product.images?.[0]?.url ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <Zap className="h-5 w-5" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          {product.category?.name && (
                            <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                              {product.category.name}
                            </span>
                          )}
                          {product.brand && (
                            <span className="text-[10px] font-bold text-muted-foreground">
                              {product.brand}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                          {product.name}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-xs font-black text-primary">
                          {formatCurrency(effectivePrice, "NGN")}
                        </p>
                        {product.discountPrice && product.discountPrice > 0 && (
                          <p className="text-[10px] text-muted-foreground line-through">
                            {formatCurrency(product.price, "NGN")}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* If there is a search query but NO results */}
          {query.trim() && matchingProducts.length === 0 && (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground ">
                <Search className="h-5 w-5" />
              </div>
              <p className="text-xs font-black uppercase tracking-wider text-foreground">
                No products found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-[10px] text-muted-foreground max-w-xs mx-auto">
                Try checking for typos or searching for general terms like
                &ldquo;inverter&rdquo;, &ldquo;battery&rdquo;, or
                &ldquo;panel&rdquo;.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSearch(query)}
                className="mt-2 text-[10px] font-bold uppercase tracking-wider h-8 rounded-lg cursor-pointer border-primary text-primary hover:bg-primary/5"
              >
                Search full catalog
              </Button>
            </div>
          )}

          {/* When query is empty: show Recent Searches, Trending Searches & Categories */}
          {!query.trim() && (
            <div className="space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between ">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" /> Recent Searches
                    </span>
                    <button
                      type="button"
                      onClick={clearAllRecent}
                      className="text-[10px] font-black uppercase tracking-wider text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <span
                        key={term}
                        onClick={() => handleSearch(term)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-xs font-semibold text-foreground cursor-pointer transition-colors group"
                      >
                        <History className="h-3.5 w-3.5 text-muted-foreground" />
                        {term}
                        <button
                          type="button"
                          onClick={(e) => removeRecentSearch(e, term)}
                          className="text-muted-foreground hover:text-rose-500 ml-0.5 cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 ">
                  <TrendingUp className="h-3.5 w-3.5 text-primary" /> Popular
                  Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleSearch(term)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-50 hover:bg-emerald-50 dark:bg-zinc-900/60 dark:hover:bg-emerald-950/30 border border-border/80 hover:border-emerald-300 dark:hover:border-emerald-800 text-xs font-semibold text-foreground hover:text-emerald-700 dark:hover:text-emerald-400 transition-all cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-primary animate-none" />
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Explore Categories */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 ">
                  <ShoppingBag className="h-3.5 w-3.5" /> Explore Categories
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categoryTree.slice(0, 6).map((cat) => (
                    <Link
                      key={cat._id}
                      href={`/${cat.slug}/products`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigate(`/${cat.slug}/products`);
                      }}
                      className="p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900/40 dark:hover:bg-zinc-850 border border-border/60 flex items-center justify-between text-xs font-bold text-foreground transition-all group"
                    >
                      <span>{cat.name}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-muted/40 border-t border-border/85 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-muted-foreground ">
          <span>Quick Shop Search</span>
          <span>GoSolar Ng Clean Energy</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
