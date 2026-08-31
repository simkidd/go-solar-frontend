"use client";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import AppModal from "@/components/AppModal";
import { Category } from "@/interfaces/product.interface";
import { formatDate } from "@/utils/helpers";
import { useCategoriesQuery } from "@/hooks/queries/useCategoriesQuery";
import { useDebounce } from "@/hooks";
import { useDeleteCategoryMutation } from "@/hooks/mutations/useCategoryMutations";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Trash,
  Pencil,
  FolderOpen,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import UpdateCategoryForm from "./UpdateCategoryForm";
import useCategories from "@/hooks/useCategories";
import CreateCategoryButton from "./CreateCategoryButton";

const CategoryTable = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [filterValue, setFilterValue] = useState(searchParams.get("q") || "");
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"topLevel" | "subcategories">(
    "topLevel",
  );
  const [parentFilter, setParentFilter] = useState<string>("all");
  const debouncedFilterValue = useDebounce(filterValue, 500);

  // Sync URL and page with debounced search query
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

  const tableColumns = useMemo(() => {
    if (activeTab === "topLevel") {
      return [
        { name: "Name", uid: "name" },
        { name: "Description", uid: "description" },
        { name: "Date added", uid: "dateAdded" },
        { name: "Actions", uid: "actions" },
      ];
    }
    return [
      { name: "Name", uid: "name" },
      { name: "Parent Category", uid: "parent" },
      { name: "Description", uid: "description" },
      { name: "Date added", uid: "dateAdded" },
      { name: "Actions", uid: "actions" },
    ];
  }, [activeTab]);

  // Load all top-level categories for the select dropdown filter in subcategories tab
  const { data: parentRes } = useCategoriesQuery({
    page: 1,
    limit: 1000,
    parent: null,
  });
  const parentCategories = parentRes?.categories || [];

  const parentQueryParam = useMemo(() => {
    if (activeTab === "topLevel") {
      return null;
    }
    return parentFilter === "all" ? "any" : parentFilter;
  }, [activeTab, parentFilter]);

  const {
    data: catRes,
    isLoading,
    refetch,
  } = useCategoriesQuery({
    page,
    limit: 10,
    q: debouncedFilterValue,
    parent: parentQueryParam,
  });

  const categories = catRes?.categories || [];
  const pagination = catRes?.pagination || { total: 0, pages: 1 };

  const deleteCategoryMutation = useDeleteCategoryMutation({
    onSuccess: () => {
      setIsDeleteOpen(false);
      setSelectedCat(null);
      refetch();
    },
  });

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);

  const hasSearchFilter = Boolean(filterValue);

  const pages = pagination.pages;

  const handleDelete = () => {
    if (selectedCat) {
      deleteCategoryMutation.mutate(selectedCat._id);
    }
  };

  const onSearchChange = (value: string) => {
    setFilterValue(value);
  };

  const onResetFilters = () => {
    setFilterValue("");
    setParentFilter("all");
    setPage(1);
    router.replace(pathname);
  };

  return (
    <div className="w-full space-y-5 font-inter">
      {/* Delete Confirmation Modal */}
      <AppModal
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Category"
        isDismissable={false}
        hideCloseButton
      >
        <div className="flex flex-col pt-2">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete category{" "}
            <b className="text-foreground">{selectedCat?.name}</b>? This action
            is permanent.
          </p>
          <div className="flex items-center gap-2 mt-8 mb-4 ms-auto">
            <Button
              variant="ghost"
              onClick={() => setIsDeleteOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteCategoryMutation.isPending}
            >
              {deleteCategoryMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </AppModal>

      {/* Update Category Modal */}
      <AppModal
        isOpen={isUpdateOpen}
        onOpenChange={setIsUpdateOpen}
        title="Update Category"
        isDismissable={false}
        hideCloseButton
        size="md"
        scrollBehavior="inside"
      >
        {selectedCat && (
          <UpdateCategoryForm
            onClose={() => setIsUpdateOpen(false)}
            category={selectedCat}
          />
        )}
      </AppModal>

      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 ">
        <div>
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2 tracking-tight">
            <FolderOpen className="h-5 w-5 text-primary" />
            Category Manager
          </h2>
          <p className="text-xs text-muted-foreground font-semibold mt-0.5">
            Organize products into browseable categories, configure taxonomies,
            and manage collections.
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

          <CreateCategoryButton />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-border/60 mb-1">
        <button
          onClick={() => {
            setActiveTab("topLevel");
            setPage(1);
            setParentFilter("all");
          }}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "topLevel"
              ? "border-primary text-primary font-extrabold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Top-Level Categories
        </button>
        <button
          onClick={() => {
            setActiveTab("subcategories");
            setPage(1);
          }}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "subcategories"
              ? "border-primary text-primary font-extrabold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Subcategories
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 bg-card text-card-foreground p-5 rounded-2xl border border-border/80 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              placeholder="Search categories..."
              value={filterValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {activeTab === "subcategories" && (
              <Select
                value={parentFilter}
                onValueChange={(val) => {
                  setParentFilter(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[200px] bg-muted/30 border-border text-xs rounded-xl h-10 cursor-pointer">
                  <SelectValue placeholder="Filter by parent" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-border bg-card">
                  <SelectItem value="all" className="text-xs cursor-pointer">
                    All Parent Categories
                  </SelectItem>
                  {parentCategories.map((p) => (
                    <SelectItem
                      key={p._id}
                      value={p._id}
                      className="text-xs cursor-pointer"
                    >
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {(hasSearchFilter || parentFilter !== "all") && (
              <Button
                variant="ghost"
                onClick={onResetFilters}
                className="text-red-500 hover:text-red-600 hover:bg-red-50/50 dark:hover:bg-red-955/10 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Counter and row switcher */}
        <div className="flex justify-between items-center text-[10px] text-muted-foreground border-t border-border/60 pt-3  font-bold uppercase tracking-wider">
          <span>Total {categories.length} categories listed</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-card text-card-foreground rounded-2xl border border-border/80 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/80">
              {tableColumns.map((col) => (
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
                <TableCell colSpan={tableColumns.length} className="h-32">
                  <div className="space-y-2 flex flex-col justify-center items-center py-8">
                    <Skeleton className="h-5 w-4/5" />
                    <Skeleton className="h-5 w-3/5" />
                  </div>
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="h-24 text-center text-xs text-muted-foreground font-semibold"
                >
                  No categories found in system inventory.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow
                  key={cat?._id}
                  className="border-b border-border/60 hover:bg-muted/15 transition-colors"
                >
                  {tableColumns.map((col) => {
                    const columnKey = col.uid;
                    return (
                      <TableCell
                        key={columnKey}
                        className="py-3.5 text-xs text-foreground"
                      >
                        {columnKey === "name" && (
                          <span className="font-extrabold text-foreground select-all">
                            {cat?.name}
                          </span>
                        )}
                        {columnKey === "parent" && (
                          <div className="">
                            {cat?.parent ? (
                              <span className="bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest">
                                {cat.parent.name}
                              </span>
                            ) : (
                              <span className="bg-muted text-muted-foreground border border-border rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest">
                                Top-Level
                              </span>
                            )}
                          </div>
                        )}
                        {columnKey === "description" && (
                          <span className="text-muted-foreground line-clamp-2 max-w-[280px] font-medium">
                            {cat?.description || "-"}
                          </span>
                        )}
                        {columnKey === "dateAdded" && (
                          <span className="font-semibold text-muted-foreground ">
                            {formatDate(cat?.createdAt)}
                          </span>
                        )}
                        {columnKey === "actions" && (
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
                                className="w-40 rounded-xl bg-card border border-border/80"
                              >
                                {activeTab === "topLevel" && (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setActiveTab("subcategories");
                                      setParentFilter(cat._id);
                                      setPage(1);
                                    }}
                                    className="cursor-pointer text-xs font-bold"
                                  >
                                    <FolderOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <span>Subcategories</span>
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(
                                      `/dashboard/categories/${cat?.slug}`,
                                    )
                                  }
                                  className="cursor-pointer text-xs font-bold"
                                >
                                  <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                                  <span>Products</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedCat(cat);
                                    setIsUpdateOpen(true);
                                  }}
                                  className="cursor-pointer text-xs font-bold"
                                >
                                  <Pencil className="mr-2 h-4 w-4 text-muted-foreground" />
                                  <span>Update</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedCat(cat);
                                    setIsDeleteOpen(true);
                                  }}
                                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50/50 dark:focus:bg-red-950/10 text-xs font-bold"
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  <span>Delete</span>
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

export default CategoryTable;
