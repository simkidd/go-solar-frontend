"use client";
import { useAllOrdersQuery } from "@/hooks/queries/useOrdersQuery";
import { Order, TrackingStatus } from "@/interfaces/order.interface";
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
  ShoppingBag,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";

const columns = [
  { name: "Order ID", uid: "orderId" },
  { name: "Billing Name", uid: "billingName" },
  { name: "Date", uid: "dateOrdered" },
  { name: "Total", uid: "total" },
  { name: "Tracking Status", uid: "trackingStatus" },
  { name: "Actions", uid: "actions" },
];

export const getChipStyles = (status: TrackingStatus) => {
  switch (status) {
    case TrackingStatus.Processing:
      return "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50";
    case TrackingStatus.Delivered:
      return "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50";
    case TrackingStatus.Received:
      return "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50";
    default:
      return "bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700";
  }
};

export const getChipColor = (status: TrackingStatus) => {
  switch (status) {
    case TrackingStatus.Processing:
      return "warning";
    case TrackingStatus.Delivered:
      return "success";
    case TrackingStatus.Received:
      return "primary";
    default:
      return "default";
  }
};

const OrdersTable = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [filterValue, setFilterValue] = useState(searchParams.get("q") || "");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading, refetch } = useAllOrdersQuery({
    page,
    limit: rowsPerPage,
  });
  const orders = data?.orders || [];
  const pagination = data?.pagination || { total: 0, pages: 1 };

  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.map((col) => col.uid))
  );
  const [sortColumn, setSortColumn] = useState<string>("billingName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "All"
  );

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    return columns.filter((column) => visibleColumns.has(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredOrders = [...orders];

    if (hasSearchFilter) {
      filteredOrders = filteredOrders.filter(
        (order) =>
          order?.user?.firstname.toLowerCase().includes(filterValue.toLowerCase()) ||
          order?.user?.lastname.toLowerCase().includes(filterValue.toLowerCase()) ||
          order?.trackingId?.tracking_id.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      filteredOrders = filteredOrders.filter(
        (order) => order?.trackingStatus === statusFilter
      );
    }

    return filteredOrders;
  }, [orders, filterValue, statusFilter]);

  const pages = pagination.pages;

  const items = filteredItems;

  const sortedItems = useMemo(() => {
    const sorted = [...items].sort((a, b) => {
      let first = a[sortColumn as keyof typeof a];
      let second = b[sortColumn as keyof typeof b];

      // Handle nested properties
      if (sortColumn === "billingName") {
        first = `${a?.user?.firstname} ${a?.user?.lastname}`;
        second = `${b?.user?.firstname} ${b?.user?.lastname}`;
      }

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

  const onStatusFilterChange = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status && status !== "All") {
      params.set("status", status);
      setStatusFilter(status);
    } else {
      params.delete("status");
      setStatusFilter("All");
    }
    setPage(1);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const onResetFilters = () => {
    setFilterValue("");
    setStatusFilter("All");
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
    <div className="space-y-6 font-inter">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Customer Order Management
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Track customer system purchases, fulfillment status, and transaction histories.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="gap-2 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 h-9 rounded-lg text-xs"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 bg-white dark:bg-[#1a1b1e] p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search by name or tracking ID..."
              value={filterValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 bg-zinc-50/50 dark:bg-zinc-900/20 border-zinc-200 dark:border-zinc-800"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {(hasSearchFilter || statusFilter !== "All") && (
              <Button variant="ghost" onClick={onResetFilters} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
                Reset
              </Button>
            )}

            {/* Status filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-zinc-200 dark:border-zinc-800">
                  {statusFilter === "All" ? "All Status" : statusFilter}
                  <ChevronDown className="ml-2 h-4 w-4 text-zinc-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40">
                <DropdownMenuItem onClick={() => onStatusFilterChange("All")}>All Status</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusFilterChange("Processing")}>Processing</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusFilterChange("Delivered")}>Delivered</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusFilterChange("Received")}>Received</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Counter and row switcher */}
        <div className="flex justify-between items-center text-xs text-zinc-400 dark:text-zinc-500 border-t border-zinc-100 dark:border-zinc-800/80 pt-3">
          <span>Total {orders.length} orders</span>
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
                    <Skeleton className="h-5 w-4/5" />
                  </div>
                </TableCell>
              </TableRow>
            ) : sortedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headerColumns.length} className="h-24 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              sortedItems.map((order) => (
                <TableRow key={order?._id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/30 dark:hover:bg-zinc-800/10">
                  {headerColumns.map((col) => {
                    const columnKey = col.uid;
                    return (
                      <TableCell key={columnKey} className="py-3.5 text-sm text-zinc-800 dark:text-zinc-200">
                        {columnKey === "orderId" && (
                          <span className="font-semibold text-zinc-900 dark:text-white">{order?.trackingId?.tracking_id}</span>
                        )}
                        {columnKey === "billingName" && (
                          <span className="font-medium">{order?.user?.firstname + " " + order?.user?.lastname}</span>
                        )}
                        {columnKey === "dateOrdered" && (
                          <span>{formatDate(order?.createdAt)}</span>
                        )}
                        {columnKey === "total" && (
                          <span className="font-bold">{formatCurrency(order?.totalPricePaid, "NGN")}</span>
                        )}
                        {columnKey === "trackingStatus" && (
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getChipStyles(order?.trackingStatus)}`}>
                            {order?.trackingStatus}
                          </span>
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
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/orders/${order?._id}`)} className="cursor-pointer">
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

export default OrdersTable;
