"use client";
import React, { useCallback, useMemo, useState } from "react";
import AppModal from "@/components/AppModal";
import { Category } from "@/interfaces/product.interface";
import { formatDate } from "@/utils/helpers";
import { useCategoriesQuery } from "@/hooks/queries/useCategoriesQuery";
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

const columns = [
  { name: "Name", uid: "name" },
  { name: "Description", uid: "description" },
  { name: "Date added", uid: "dateAdded" },
  { name: "Actions", uid: "actions" },
];

const CategoryTable = () => {
  const { data: categories = [], isLoading, refetch } = useCategoriesQuery();
  const deleteCategoryMutation = useDeleteCategoryMutation({
    onSuccess: () => {
      setIsDeleteOpen(false);
      setSelectedCat(null);
    },
  });

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

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    return columns.filter((column) => visibleColumns.has(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredCat = [...categories];
    if (hasSearchFilter) {
      filteredCat = filteredCat.filter((cat) =>
        cat?.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filteredCat;
  }, [categories, filterValue]);

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

  const handleDelete = () => {
    if (selectedCat) {
      deleteCategoryMutation.mutate(selectedCat._id);
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

  const onResetFilters = () => {
    setFilterValue("");
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
      {/* Delete Confirmation Modal */}
      <AppModal
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Category"
        isDismissable={false}
        hideCloseButton
      >
        <div className="flex flex-col pt-2">
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Are you sure you want to delete category <b>{selectedCat?.name}</b>?
          </p>
          <div className="flex items-center gap-2 mt-8 mb-4 ms-auto">
            <Button variant="ghost" onClick={() => setIsDeleteOpen(false)} className="dark:text-zinc-300">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            Category Manager
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Organize products into browseable categories, configure taxonomies, and manage collections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-2 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 h-9 rounded-lg text-xs"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>

          <CreateCategoryButton />
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 bg-white dark:bg-[#1a1b1e] p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search categories..."
              value={filterValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 bg-zinc-50/50 dark:bg-zinc-900/20 border-zinc-200 dark:border-zinc-800"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {hasSearchFilter && (
              <Button variant="ghost" onClick={onResetFilters} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Counter and row switcher */}
        <div className="flex justify-between items-center text-xs text-zinc-400 dark:text-zinc-500 border-t border-zinc-100 dark:border-zinc-800/80 pt-3">
          <span>Total {categories.length} categories</span>
          <div className="flex items-center gap-1">
            <span>Rows per page:</span>
            <select
              className="bg-transparent text-zinc-500 dark:text-zinc-400 outline-none cursor-pointer font-medium"
              value={rowsPerPage}
              onChange={onRowsPerPageChange}
            >
              <option value="5" className="dark:bg-[#1a1b1e]">5</option>
              <option value="10" className="dark:bg-[#1a1b1e]">10</option>
              <option value="15" className="dark:bg-[#1a1b1e]">15</option>
              <option value="20" className="dark:bg-[#1a1b1e]">20</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-[#1a1b1e] rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50/50 dark:bg-zinc-900/20 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 border-b border-zinc-100 dark:border-zinc-800">
              {headerColumns.map((col) => (
                <TableHead
                  key={col.uid}
                  className={`font-semibold text-zinc-500 dark:text-zinc-400 h-11 text-xs select-none ${col.uid === "actions" ? "text-right" : ""}`}
                >
                  {col.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={headerColumns.length} className="h-32">
                  <div className="space-y-2 flex flex-col justify-center items-center py-8">
                    <Skeleton className="h-5 w-4/5" />
                    <Skeleton className="h-5 w-3/5" />
                  </div>
                </TableCell>
              </TableRow>
            ) : sortedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headerColumns.length} className="h-24 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              sortedItems.map((cat) => (
                <TableRow key={cat?._id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/30 dark:hover:bg-zinc-800/10">
                  {headerColumns.map((col) => {
                    const columnKey = col.uid;
                    return (
                      <TableCell key={columnKey} className="py-3.5 text-sm text-zinc-800 dark:text-zinc-200">
                        {columnKey === "name" && (
                          <span className="font-semibold text-zinc-900 dark:text-white">{cat?.name}</span>
                        )}
                        {columnKey === "description" && (
                          <span className="text-zinc-500 dark:text-zinc-400 line-clamp-2 max-w-lg">{cat?.description || "-"}</span>
                        )}
                        {columnKey === "dateAdded" && (
                          <span>{formatDate(cat?.createdAt)}</span>
                        )}
                        {columnKey === "actions" && (
                          <div className="flex justify-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-36">
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/categories/${cat?.slug}`)} className="cursor-pointer">
                                  <Eye className="mr-2 h-4 w-4" />
                                  <span>Products</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedCat(cat);
                                    setIsUpdateOpen(true);
                                  }}
                                  className="cursor-pointer"
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  <span>Update</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedCat(cat);
                                    setIsDeleteOpen(true);
                                  }}
                                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
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

export default CategoryTable;
