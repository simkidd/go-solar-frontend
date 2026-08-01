"use client";
import React, { useMemo, useState } from "react";
import { Product } from "@/interfaces/product.interface";
import { formatCurrency, formatDate } from "@/utils/helpers";
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
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const columns = [
  { name: "Product", uid: "name", sortable: true },
  { name: "Price", uid: "price", sortable: true },
  { name: "Discount", uid: "discount", sortable: true },
  { name: "Quantity", uid: "quantity" },
  { name: "Offer", uid: "offer" },
  { name: "Brand", uid: "brand" },
  { name: "Status", uid: "status", sortable: true },
  { name: "Date added", uid: "dateAdded", sortable: true },
  { name: "Actions", uid: "actions" },
];

const CategoryProductsTable: React.FC<{ products: Product[] }> = ({
  products,
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [filterValue, setFilterValue] = useState(searchParams.get("q") || "");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.map((col) => col.uid))
  );
  const [sortColumn, setSortColumn] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [publishFilter, setPublishFilter] = useState(
    searchParams.get("published") || "All"
  );

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    return columns.filter((column) => visibleColumns.has(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredProducts = [...products];

    if (hasSearchFilter) {
      filteredProducts = filteredProducts.filter((product) =>
        product?.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (publishFilter !== "All") {
      filteredProducts = filteredProducts.filter((product) =>
        publishFilter === "published"
          ? product.isPublished
          : !product.isPublished
      );
    }

    return filteredProducts;
  }, [products, filterValue, publishFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    const sorted = [...items].sort((a, b) => {
      const first = a[sortColumn as keyof typeof a];
      const second = b[sortColumn as keyof typeof b];
      const cmp = (first ?? "") < (second ?? "") ? -1 : (first ?? "") > (second ?? "") ? 1 : 0;
      return sortDirection === "desc" ? -cmp : cmp;
    });
    return sorted;
  }, [sortColumn, sortDirection, items]);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const onRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

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

  const toggleColumnVisibility = (columnUid: string) => {
    const newVisible = new Set(visibleColumns);
    if (newVisible.has(columnUid)) {
      if (newVisible.size > 1) {
        newVisible.delete(columnUid);
      }
    } else {
      newVisible.add(columnUid);
    }
    setVisibleColumns(newVisible);
  };

  return (
    <div className="w-full space-y-4">
      {/* Search & Filters */}
      <div className="flex flex-col gap-4 bg-white dark:bg-[#222327] p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search products..."
              value={filterValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 bg-zinc-50/50 dark:bg-zinc-900/20 border-zinc-200 dark:border-zinc-800"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {(hasSearchFilter || publishFilter !== "All") && (
              <Button variant="ghost" onClick={onResetFilters} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
                Reset
              </Button>
            )}

            {/* Status filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-zinc-200 dark:border-zinc-800">
                  {publishFilter === "All" ? "All Status" : publishFilter === "published" ? "Published" : "Draft"}
                  <ChevronDown className="ml-2 h-4 w-4 text-zinc-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-36">
                <DropdownMenuItem onClick={() => onPublishFilterChange("All")}>All Status</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onPublishFilterChange("published")}>Published</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onPublishFilterChange("draft")}>Draft</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Columns visibility toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 border-zinc-200 dark:border-zinc-800">
                  <Settings2 className="h-4 w-4 text-zinc-400" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {columns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.uid}
                    checked={visibleColumns.has(column.uid)}
                    onCheckedChange={() => toggleColumnVisibility(column.uid)}
                  >
                    {column.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Counter and row switcher */}
        <div className="flex justify-between items-center text-xs text-zinc-400 dark:text-zinc-500 border-t border-zinc-100 dark:border-zinc-800/80 pt-3">
          <span>Total {products.length} products</span>
          <div className="flex items-center gap-1">
            <span>Rows per page:</span>
            <select
              className="bg-transparent text-zinc-500 dark:text-zinc-400 outline-none cursor-pointer font-medium"
              value={rowsPerPage}
              onChange={onRowsPerPageChange}
            >
              <option value="5" className="dark:bg-[#222327]">5</option>
              <option value="10" className="dark:bg-[#222327]">10</option>
              <option value="15" className="dark:bg-[#222327]">15</option>
              <option value="20" className="dark:bg-[#222327]">20</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-[#222327] rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50/50 dark:bg-zinc-900/20 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 border-b border-zinc-100 dark:border-zinc-800">
              {headerColumns.map((col) => (
                <TableHead
                  key={col.uid}
                  onClick={() => col.sortable && handleSort(col.uid)}
                  className={`font-semibold text-zinc-500 dark:text-zinc-400 h-11 text-xs select-none ${
                    col.sortable ? "cursor-pointer hover:text-zinc-800 dark:hover:text-white" : ""
                  } ${col.uid === "actions" ? "text-right" : ""}`}
                >
                  <div className="flex items-center gap-1">
                    {col.name}
                    {col.sortable && sortColumn === col.uid && (
                      <span className="text-[10px] text-zinc-400">{sortDirection === "asc" ? "▲" : "▼"}</span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headerColumns.length} className="h-24 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              sortedItems.map((product) => (
                <TableRow key={product?._id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/30 dark:hover:bg-zinc-800/10">
                  {headerColumns.map((col) => {
                    const columnKey = col.uid;
                    return (
                      <TableCell key={columnKey} className="py-3 text-sm text-zinc-800 dark:text-zinc-200">
                        {columnKey === "name" && (
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 min-w-10 rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-800 relative bg-zinc-50 dark:bg-zinc-900">
                              <Image
                                src={product?.images?.[0]?.url || "/placeholder-product.jpg"}
                                alt={product?.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="font-medium text-zinc-900 dark:text-white line-clamp-2">{product?.name}</span>
                          </div>
                        )}
                        {columnKey === "price" && (
                          <span>{formatCurrency(product?.price, "NGN")}</span>
                        )}
                        {columnKey === "discount" && (
                          <div>
                            {product?.currentOffer?.isActive && product?.currentOffer?.percentageOff ? (
                              <span className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 rounded-full px-2 py-0.5 text-xs font-medium">
                                {product.currentOffer.percentageOff}% Off
                              </span>
                            ) : (
                              <span className="text-zinc-400">-</span>
                            )}
                          </div>
                        )}
                        {columnKey === "quantity" && (
                          <span>{product?.quantityInStock}</span>
                        )}
                        {columnKey === "offer" && (
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">{product?.currentOffer?.name || "-"}</span>
                        )}
                        {columnKey === "brand" && (
                          <span>{product?.brand || "-"}</span>
                        )}
                        {columnKey === "status" && (
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            product.isPublished 
                              ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50"
                              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
                          }`}>
                            {product.isPublished ? "Published" : "Draft"}
                          </span>
                        )}
                        {columnKey === "dateAdded" && (
                          <span>{formatDate(product?.createdAt)}</span>
                        )}
                        {columnKey === "actions" && (
                          <div className="flex justify-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-32">
                                <DropdownMenuItem onClick={() => router.push(`/admin/products/${product?._id}`)} className="cursor-pointer">
                                  <Eye className="mr-2 h-4 w-4" />
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {pages > 1 && (
        <div className="flex items-center justify-between py-2 border-t border-zinc-100 dark:border-zinc-800">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Page {page} of {pages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="border-zinc-200 dark:border-zinc-800"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === pages}
              onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
              className="border-zinc-200 dark:border-zinc-800"
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
