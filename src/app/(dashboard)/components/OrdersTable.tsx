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

export const getChipStyles = (status: any) => {
  switch (status) {
    case TrackingStatus.Processing:
      return "bg-amber-55 text-amber-600 dark:text-amber-400 border border-amber-500/20";
    case TrackingStatus.Delivered:
      return "bg-emerald-55 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20";
    case TrackingStatus.Received:
    case "Recieved":
      return "bg-blue-55 text-blue-600 dark:text-blue-400 border border-blue-500/20";
    default:
      return "bg-muted text-muted-foreground border border-border";
  }
};

export const getChipColor = (status: any) => {
  switch (status) {
    case TrackingStatus.Processing:
      return "warning";
    case TrackingStatus.Delivered:
      return "success";
    case TrackingStatus.Received:
    case "Recieved":
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
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "All",
  );

  const { data, isLoading, refetch } = useAllOrdersQuery({
    page,
    limit: 10,
    q: filterValue,
    status: statusFilter,
  });
  const orders = data?.orders || [];
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

  return (
    <div className="space-y-5 font-inter">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
        <div>
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2 tracking-tight">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Customer Order Management
          </h2>
          <p className="text-xs text-muted-foreground font-semibold mt-0.5">
            Track customer system purchases, fulfillment status, and transaction
            histories.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="gap-2 border-border text-muted-foreground hover:text-foreground h-9 rounded-xl text-xs font-semibold cursor-pointer hover:bg-muted/30"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 bg-card text-card-foreground p-5 rounded-2xl border border-border/80 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              placeholder="Search by name or tracking ID..."
              value={filterValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap select-none">
            {(hasSearchFilter || statusFilter !== "All") && (
              <Button
                variant="ghost"
                onClick={onResetFilters}
                className="text-red-500 hover:text-red-650 hover:bg-red-50/50 dark:hover:bg-red-955/10 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Reset
              </Button>
            )}

            {/* Status Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-border text-xs font-semibold rounded-xl h-10 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted/30"
                >
                  {statusFilter === "All"
                    ? "All Statuses"
                    : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                  <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40 rounded-xl bg-card border border-border/80">
                <DropdownMenuItem onClick={() => onStatusFilterChange("All")} className="cursor-pointer text-xs font-bold">
                  All Statuses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusFilterChange("processing")} className="cursor-pointer text-xs font-bold">
                  Processing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusFilterChange("delivered")} className="cursor-pointer text-xs font-bold">
                  Delivered
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusFilterChange("received")} className="cursor-pointer text-xs font-bold">
                  Received
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Counter and row switcher */}
        <div className="flex justify-between items-center text-[10px] text-muted-foreground border-t border-border/60 pt-3 select-none font-bold uppercase tracking-wider">
          <span>Total {orders.length} orders listed</span>
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
                <TableCell colSpan={columns.length} className="h-32">
                  <div className="space-y-2 flex flex-col justify-center items-center py-8">
                    <Skeleton className="h-5 w-4/5" />
                    <Skeleton className="h-5 w-3/5" />
                    <Skeleton className="h-5 w-4/5" />
                  </div>
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-xs text-muted-foreground font-semibold"
                >
                  No orders found in system inventory.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow
                  key={order?._id}
                  className="border-b border-border/60 hover:bg-muted/15 transition-colors"
                >
                  {columns.map((col) => {
                    const columnKey = col.uid;
                    return (
                      <TableCell
                        key={columnKey}
                        className="py-3.5 text-xs text-foreground"
                      >
                        {columnKey === "orderId" && (
                          <span className="font-extrabold text-foreground font-mono select-all">
                            #{order?.trackingId?.tracking_id}
                          </span>
                        )}
                        {columnKey === "billingName" && (
                          <span className="font-bold text-foreground select-all">
                            {order?.user?.firstname +
                              " " +
                              order?.user?.lastname}
                          </span>
                        )}
                        {columnKey === "dateOrdered" && (
                          <span className="font-semibold text-muted-foreground select-none">
                            {formatDate(order?.createdAt)}
                          </span>
                        )}
                        {columnKey === "total" && (
                          <span className="font-bold text-foreground monospace select-all">
                            {formatCurrency(order?.totalPricePaid, "NGN")}
                          </span>
                        )}
                        {columnKey === "trackingStatus" && (
                          <div className="select-none">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest border ${getChipStyles(order?.trackingStatus)}`}
                            >
                              {order?.trackingStatus}
                            </span>
                          </div>
                        )}
                        {columnKey === "actions" && (
                          <div className="flex justify-end select-none">
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
                                      `/dashboard/orders/${order?._id}`,
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {pages > 1 && (
        <div className="flex items-center justify-between py-3 border-t border-border/60 select-none">
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

export default OrdersTable;
