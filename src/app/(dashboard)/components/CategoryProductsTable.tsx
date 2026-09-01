"use client";
import React, { useMemo, useState } from "react";
import { Product } from "@/interfaces/product.interface";
import { formatCurrency, formatDate } from "@/utils/helpers";
import { useCategoryProductsQuery } from "@/hooks/queries/useProductsQuery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronDown,
  MoreVertical,
  Eye,
  RefreshCw,
  Search,
  Settings2,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const columns = [
  { name: "Product", uid: "name" },
  { name: "Price", uid: "price" },
  { name: "Discount", uid: "discount" },
  { name: "Quantity", uid: "quantity" },
  { name: "Offer", uid: "offer" },
  { name: "Brand", uid: "brand" },
  { name: "Status", uid: "status" },
  { name: "Date added", uid: "dateAdded" },
  { name: "Actions", uid: "actions" },
];

const CategoryProductsTable: React.FC<{ categoryId: string }> = ({
  categoryId,
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [filterValue, setFilterValue] = useState(searchParams.get("q") || "");
  const [page, setPage] = useState(1);
  const [publishFilter, setPublishFilter] = useState(
    searchParams.get("published") || "All",
  );

  const { data, isLoading, refetch } = useCategoryProductsQuery({
    categoryId,
    page,
    limit: 10,
    q: filterValue,
    status: publishFilter,
  });

  const products = data?.products || [];
  const pagination = data?.pagination || { total: 0, pages: 1 };

  const hasSearchFilter = Boolean(filterValue);

  const pages = pagination.pages;

  const onSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("q", value);
      setFilterValue(value);
      setPage(1);
    } else {
      params.delete("q");
      setFilterValue("");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const onPublishFilterChange = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status && status !== "All") {
      params.set("status", status);
      setPublishFilter(status);
    } else {
      params.delete("status");
      setPublishFilter("All");
    }
    setPage(1);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const onResetFilters = () => {
    setFilterValue("");
    setPublishFilter("All");
    setPage(1);
    router.replace(pathname);
  };

  return (
    <div className="w-full space-y-5 font-inter">
      {/* Search & Filters */}
      <div className="flex flex-col gap-4 bg-card text-card-foreground p-5 rounded-2xl border border-border/80 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              placeholder="Search products..."
              value={filterValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap ">
            {(hasSearchFilter || publishFilter !== "All") && (
              <Button
                variant="ghost"
                onClick={onResetFilters}
                className="text-red-500 hover:text-red-650 hover:bg-red-50/50 dark:hover:bg-red-955/10 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Reset
              </Button>
            )}

            {/* Status filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-border text-xs font-semibold rounded-xl h-10 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted/30"
                >
                  {publishFilter === "All"
                    ? "All Status"
                    : publishFilter === "published"
                      ? "Published"
                      : "Draft"}
                  <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-36 rounded-xl bg-card border border-border/80">
                <DropdownMenuItem
                  onClick={() => onPublishFilterChange("All")}
                  className="cursor-pointer text-xs font-bold"
                >
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onPublishFilterChange("published")}
                  className="cursor-pointer text-xs font-bold"
                >
                  Published
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onPublishFilterChange("draft")}
                  className="cursor-pointer text-xs font-bold"
                >
                  Draft
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Counter and row switcher */}
        <div className="flex justify-between items-center text-[10px] text-muted-foreground border-t border-border/60 pt-3  font-bold uppercase tracking-wider">
          <span>Total {products.length} products listed</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-card text-card-foreground rounded-2xl border border-border/80 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/80">
              {columns.map((col) => (
                <TableHead
                  key={col.uid}
                  className={`font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12  ${
                    col.uid === "actions" ? "text-right" : ""
                  }`}
                >
                  {col.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32">
                  <div className="space-y-2 flex flex-col justify-center items-center py-8">
                    <Skeleton className="h-5 w-4/5" />
                    <Skeleton className="h-5 w-3/5" />
                    <Skeleton className="h-5 w-4/5" />
                  </div>
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-xs text-muted-foreground font-semibold"
                >
                  No products found in system inventory.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const qty = product?.quantityInStock;
                const isOutOfStock = qty <= 0;
                const isLowStock = qty > 0 && qty <= 10;

                return (
                  <TableRow
                    key={product?._id}
                    className="border-b border-border/60 hover:bg-muted/15 transition-colors"
                  >
                    {columns.map((col) => {
                      const columnKey = col.uid;
                      return (
                        <TableCell
                          key={columnKey}
                          className="py-3.5 text-xs text-foreground"
                        >
                          {columnKey === "name" && (
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 min-w-[40px] rounded-xl overflow-hidden border border-border/80 relative bg-muted ">
                                <Image
                                  src={
                                    product?.images?.[0]?.url ||
                                    "/placeholder-product.jpg"
                                  }
                                  alt={product?.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <span className="font-extrabold text-foreground line-clamp-1 select-all">
                                {product?.name}
                              </span>
                            </div>
                          )}
                          {columnKey === "price" && (
                            <span className="font-bold text-foreground monospace select-all">
                              {formatCurrency(product?.price, "NGN")}
                            </span>
                          )}
                          {columnKey === "discount" && (
                            <div className="">
                              {product?.currentOffer?.isActive &&
                              product?.currentOffer?.percentageOff ? (
                                <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest">
                                  {product.currentOffer.percentageOff}% Off
                                </span>
                              ) : (
                                <span className="text-muted-foreground/40">
                                  -
                                </span>
                              )}
                            </div>
                          )}
                          {columnKey === "quantity" && (
                            <div className="">
                              {isOutOfStock ? (
                                <span className="text-rose-500 font-black uppercase text-[10px] tracking-widest flex items-center gap-1">
                                  <AlertTriangle className="h-3.5 w-3.5 fill-rose-500/10" />
                                  Out of Stock
                                </span>
                              ) : isLowStock ? (
                                <span className="text-amber-500 font-extrabold uppercase text-[10px] tracking-wider flex items-center gap-1">
                                  {qty} Left (Low)
                                </span>
                              ) : (
                                <span className="font-semibold text-foreground">
                                  {qty}
                                </span>
                              )}
                            </div>
                          )}
                          {columnKey === "offer" && (
                            <span className="text-xs text-muted-foreground font-semibold ">
                              {product?.currentOffer?.name || "-"}
                            </span>
                          )}
                          {columnKey === "brand" && (
                            <span className="font-semibold ">
                              {product?.brand || "-"}
                            </span>
                          )}
                          {columnKey === "status" && (
                            <div className="">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest border ${
                                  product.isPublished
                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                    : "bg-muted text-muted-foreground border-border/80"
                                }`}
                              >
                                {product.isPublished ? "Published" : "Draft"}
                              </span>
                            </div>
                          )}
                          {columnKey === "dateAdded" && (
                            <span className="font-semibold text-muted-foreground ">
                              {formatDate(product?.createdAt)}
                            </span>
                          )}
                          {columnKey === "actions" && (
                            <div className="flex justify-end ">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-32 rounded-xl bg-card border border-border/80"
                                >
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/dashboard/products/${product?._id}`,
                                      )
                                    }
                                    className="cursor-pointer text-xs font-bold"
                                  >
                                    <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <span>Details</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {pages > 1 && (
        <div className="flex items-center justify-between py-3 border-t border-border/60 ">
          <div className="text-xs text-muted-foreground font-bold">
            Page {page} of {pages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="border-border text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === pages}
              onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
              className="border-border text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryProductsTable;
