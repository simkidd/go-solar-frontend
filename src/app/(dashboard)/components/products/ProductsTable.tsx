"use client";

import useCategories from "@/hooks/useCategories";
import { Product } from "@/interfaces/product.interface";
import { formatCurrency, formatDate } from "@/utils/helpers";
import { useDeleteProductMutation } from "@/hooks/mutations/useProductMutations";
import { useAllOffersQuery } from "@/hooks/queries/useOffersQuery";
import { useAllProductsQuery } from "@/hooks/queries/useProductsQuery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Eye,
  EyeOff,
  RefreshCw,
  Search,
  Trash,
  Package,
  AlertTriangle,
  ImageOff,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useDebounce } from "@/hooks";
import CreateProductButton from "./CreateProductButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "@/lib/api/products.api";
import { toast } from "sonner";
import { PRODUCT_KEYS } from "@/hooks/queries/useProductsQuery";

const columns = [
  { name: "Product Info", uid: "name" },
  { name: "Unit Price", uid: "price" },
  { name: "Quantity", uid: "quantity" },
  { name: "Campaign Discount", uid: "discount" },
  { name: "Category", uid: "category" },
  { name: "Publishing Status", uid: "status" },
  { name: "Date Added", uid: "dateAdded" },
  { name: "Actions", uid: "actions" },
];

const ProductsTable = () => {
  const { data: offers = [] } = useAllOffersQuery();
  const deleteProductMutation = useDeleteProductMutation({
    onSuccess: () => {
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
    },
  });

  const queryClient = useQueryClient();
  const togglePublishMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: (data) => {
      toast.success(
        data?.product?.isPublished
          ? "Product published successfully"
          : "Product set to draft successfully",
      );
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      setIsPublishDialogOpen(false);
      setSelectedProduct(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update status");
    },
  });

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [filterValue, setFilterValue] = useState(searchParams.get("q") || "");
  const [page, setPage] = useState(1);
  const debouncedFilterValue = useDebounce(filterValue, 500);

  // Sync URL search params and page with debounced query value
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const currentQ = searchParams.get("q") || "";
    if (debouncedFilterValue !== currentQ) {
      if (debouncedFilterValue) {
        params.set("q", debouncedFilterValue);
      } else {
        params.delete("q");
      }
      setPage(1);
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [debouncedFilterValue, pathname, router, searchParams]);

  const [publishFilter, setPublishFilter] = useState(
    searchParams.get("published") || "All",
  );
  const [categoryFilter, setCategoryFilter] = useState(
    searchParams.get("category") || "All",
  );

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const hasSearchFilter = Boolean(filterValue);

  const { categories } = useCategories();
  const selectedCategoryObj = categories.find((c) => c.name === categoryFilter);

  const {
    data: productsRes,
    isLoading,
    refetch,
  } = useAllProductsQuery({
    page,
    limit: 10,
    q: debouncedFilterValue,
    status: publishFilter,
    category: selectedCategoryObj ? selectedCategoryObj._id : "All",
  });

  const products = productsRes?.products || [];
  const pagination = productsRes?.pagination || { total: 0, pages: 1 };

  const pages = pagination.pages;

  const handleDelete = () => {
    if (selectedProduct) {
      deleteProductMutation.mutate(selectedProduct._id);
    }
  };

  const onSearchChange = (value: string) => {
    setFilterValue(value);
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

  const onCatFilterChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category && category !== "All") {
      params.set("category", category);
      setCategoryFilter(category);
    } else {
      params.delete("category");
      setCategoryFilter("All");
    }
    setPage(1);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const onResetFilters = () => {
    setFilterValue("");
    setPublishFilter("All");
    setCategoryFilter("All");
    setPage(1);
    router.replace(pathname);
  };

  return (
    <div className="w-full space-y-5 font-inter">
      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[420px] bg-card border border-border/80 rounded-2xl select-none">
          <DialogHeader>
            <DialogTitle className="text-foreground font-extrabold text-base">
              Delete Product
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-2 leading-relaxed font-semibold">
              Are you sure you want to delete <b>{selectedProduct?.name}</b>?
              This action cannot be undone and will remove it from the online
              store.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2">
            <Button
              variant="ghost"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="text-xs font-semibold rounded-xl cursor-pointer text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteProductMutation.isPending}
              className="text-xs font-semibold rounded-xl cursor-pointer"
            >
              {deleteProductMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Publish confirmation dialog */}
      <Dialog open={isPublishDialogOpen} onOpenChange={setIsPublishDialogOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="text-foreground font-extrabold text-base">
              {selectedProduct?.isPublished
                ? "Draft Product"
                : "Publish Product"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-2 leading-relaxed font-semibold">
              Are you sure you want to change the status of{" "}
              <b>{selectedProduct?.name}</b> to{" "}
              <b>{selectedProduct?.isPublished ? "Draft" : "Published"}</b>?
              This will affect its visibility on the public storefront.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2">
            <Button
              variant="ghost"
              onClick={() => setIsPublishDialogOpen(false)}
              className="text-xs font-semibold rounded-xl cursor-pointer text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedProduct) {
                  togglePublishMutation.mutate({
                    productId: selectedProduct._id,
                    isPublished: !selectedProduct.isPublished,
                  });
                }
              }}
              disabled={togglePublishMutation.isPending}
              className="text-xs font-semibold rounded-xl cursor-pointer bg-primary hover:bg-primary/90 text-white"
            >
              {togglePublishMutation.isPending
                ? "Processing..."
                : selectedProduct?.isPublished
                  ? "Set as Draft"
                  : "Publish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
        <div>
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2 tracking-tight">
            <Package className="h-5 w-5 text-primary" />
            Product Inventory
          </h2>
          <p className="text-xs text-muted-foreground font-semibold mt-0.5">
            Manage storefront products, brand listings, pricing levels, and
            quantity stock levels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-2 border-border text-muted-foreground hover:text-foreground h-9 rounded-xl text-xs font-semibold cursor-pointer hover:bg-muted/30"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>

          <CreateProductButton />
        </div>
      </div>

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

          <div className="flex flex-wrap items-center gap-2">
            {(hasSearchFilter ||
              publishFilter !== "All" ||
              categoryFilter !== "All") && (
              <Button
                variant="ghost"
                onClick={onResetFilters}
                className="text-red-500 hover:text-red-600 hover:bg-red-50/50 dark:hover:bg-red-950/10 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Reset
              </Button>
            )}

            {/* Categories filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-border text-xs font-semibold rounded-xl h-10 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted/30"
                >
                  {categoryFilter === "All" ? "All Categories" : categoryFilter}
                  <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-h-60 overflow-y-auto w-48 rounded-xl bg-card border border-border/80">
                <DropdownMenuItem
                  onClick={() => onCatFilterChange("All")}
                  className="cursor-pointer text-xs font-bold"
                >
                  All Categories
                </DropdownMenuItem>
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category?._id}
                    onClick={() => onCatFilterChange(category?.name)}
                    className="cursor-pointer text-xs font-bold"
                  >
                    {category?.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

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
        <div className="flex justify-between items-center text-[10px] text-muted-foreground border-t border-border/60 pt-3 select-none font-bold uppercase tracking-wider">
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
                  className={`font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12 select-none ${
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
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="space-y-3 flex flex-col justify-center items-center py-8">
                    <Skeleton className="h-5 w-4/5 rounded-md" />
                    <Skeleton className="h-5 w-3/5 rounded-md" />
                    <Skeleton className="h-5 w-4/5 rounded-md" />
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
                    {/* 1. Name & Image Details Info */}
                    <TableCell className="py-3.5 text-xs text-foreground max-w-sm">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 min-w-[40px] rounded-xl overflow-hidden border border-border/80 relative bg-muted select-none">
                          {product?.images?.[0]?.url ? (
                            <Image
                              src={product.images[0].url}
                              alt={product?.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageOff className="w-4 h-4 text-muted-foreground/30" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <span className="font-extrabold text-foreground line-clamp-1 select-all">
                            {product?.name}
                          </span>
                          <div className="flex items-center gap-2 text-[9px] uppercase tracking-wider font-extrabold text-muted-foreground select-none">
                            <span>{product?.brand || "GoSolar"}</span>
                            {product?.category?.name && (
                              <>
                                <span className="text-border/80">•</span>
                                <span className="text-primary">
                                  {product.category.name}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* 2. Unit Price */}
                    <TableCell className="py-3.5 text-xs font-bold text-foreground monospace select-all">
                      {formatCurrency(product?.price, "NGN")}
                    </TableCell>

                    {/* 3. Quantity Stock Alerts */}
                    <TableCell className="py-3.5 text-xs select-none">
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
                    </TableCell>

                    {/* 4. Discount */}
                    <TableCell className="py-3.5 text-xs select-none">
                      {product?.currentOffer?.isActive &&
                      product?.currentOffer?.percentageOff ? (
                        <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest">
                          {product.currentOffer.percentageOff}% Off
                        </span>
                      ) : (
                        <span className="text-muted-foreground/40">-</span>
                      )}
                    </TableCell>

                    {/* 5. Category */}
                    <TableCell className="py-3.5 text-xs text-muted-foreground font-semibold select-none">
                      {product?.category?.name || "-"}
                    </TableCell>

                    {/* 6. Publishing Status */}
                    <TableCell className="py-3.5 text-xs select-none">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest border ${
                          product.isPublished
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-muted text-muted-foreground border-border/80"
                        }`}
                      >
                        {product.isPublished ? "Published" : "Draft"}
                      </span>
                    </TableCell>

                    {/* 7. Date Added */}
                    <TableCell className="py-3.5 text-xs text-muted-foreground font-semibold select-none">
                      {formatDate(product?.createdAt)}
                    </TableCell>

                    {/* 8. Actions Dropdown */}
                    <TableCell className="py-3.5 text-xs select-none">
                      <div className="flex justify-end">
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
                            className="w-36 rounded-xl bg-card border border-border/80"
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
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsPublishDialogOpen(true);
                              }}
                              className="cursor-pointer text-xs font-bold"
                            >
                              {product.isPublished ? (
                                <>
                                  <EyeOff className="mr-2 h-4 w-4 text-muted-foreground" />
                                  <span>Set as Draft</span>
                                </>
                              ) : (
                                <>
                                  <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                                  <span>Publish</span>
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50/50 dark:focus:bg-red-950/10 text-xs font-bold"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {pages > 1 && (
        <div className="flex items-center justify-between py-2 border-t border-border/80 select-none">
          <div className="text-xs text-muted-foreground font-semibold">
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

export default ProductsTable;
