"use client";
import React, { useMemo, useState } from "react";
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
  UserCheck,
} from "lucide-react";
import { User } from "@/interfaces/auth.interface";
import { formatDate } from "@/utils/helpers";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useUsers from "@/hooks/useUsers";

const columns = [
  { name: "Name", uid: "name", sortable: true },
  { name: "Email address", uid: "email" },
  { name: "Phone number", uid: "phone" },
  { name: "Role", uid: "role", sortable: true },
  { name: "Privilege", uid: "privilege" },
  { name: "Verified", uid: "verified", sortable: true },
  { name: "Date Joined", uid: "dateJoined" },
  { name: "Actions", uid: "actions" },
];

const UsersTable = () => {
  const { users, isLoading, refetch } = useUsers();
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
  const [roleFilter, setRoleFilter] = useState(
    searchParams.get("role") || "All"
  );

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    return columns.filter((column) => visibleColumns.has(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user?.firstname.toLowerCase().includes(filterValue.toLowerCase()) ||
          user?.lastname.toLowerCase().includes(filterValue.toLowerCase()) ||
          user?.email.toLowerCase().includes(filterValue.toLowerCase()) ||
          user?.phoneNumber.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (roleFilter !== "All") {
      filteredUsers = filteredUsers.filter((user) => {
        if (roleFilter === "user") return !user.isAdmin && !user.isSuperAdmin;
        if (roleFilter === "admin") return user.isAdmin && !user.isSuperAdmin;
        if (roleFilter === "superAdmin") return user.isSuperAdmin;
        return true;
      });
    }

    return filteredUsers;
  }, [users, filterValue, roleFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    const sorted = [...items].sort((a, b) => {
      let first = a[sortColumn as keyof typeof a];
      let second = b[sortColumn as keyof typeof b];

      // Handle nested or generated fields
      if (sortColumn === "name") {
        first = `${a?.firstname} ${a?.lastname}`;
        second = `${b?.firstname} ${b?.lastname}`;
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

  const onRoleFilterChange = (role: string) => {
    const params = new URLSearchParams(searchParams);
    if (role && role !== "All") {
      params.set("role", role);
      setRoleFilter(role);
    } else {
      params.delete("role");
      setRoleFilter("All");
    }
    setPage(1);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const onResetFilters = () => {
    setFilterValue("");
    setRoleFilter("All");
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
      {/* Top action block */}
      <div className="flex justify-end items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="gap-2 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 bg-white dark:bg-[#222327] p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search customers..."
              value={filterValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 bg-zinc-50/50 dark:bg-zinc-900/20 border-zinc-200 dark:border-zinc-800"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {(hasSearchFilter || roleFilter !== "All") && (
              <Button variant="ghost" onClick={onResetFilters} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
                Reset
              </Button>
            )}

            {/* Role filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-zinc-200 dark:border-zinc-800">
                  {roleFilter === "All" ? "All Roles" : roleFilter === "user" ? "User" : roleFilter === "admin" ? "Admin" : "Super Admin"}
                  <ChevronDown className="ml-2 h-4 w-4 text-zinc-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40">
                <DropdownMenuItem onClick={() => onRoleFilterChange("All")}>All Roles</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onRoleFilterChange("user")}>User</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onRoleFilterChange("admin")}>Admin</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onRoleFilterChange("superAdmin")}>Super Admin</DropdownMenuItem>
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
          <span>Total {users.length} users</span>
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
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              sortedItems.map((userItem) => (
                <TableRow key={userItem?._id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/30 dark:hover:bg-zinc-800/10">
                  {headerColumns.map((col) => {
                    const columnKey = col.uid;
                    return (
                      <TableCell key={columnKey} className="py-3 text-sm text-zinc-800 dark:text-zinc-200">
                        {columnKey === "name" && (
                          <span 
                            onClick={() => router.push(`/dashboard/users/${userItem?._id}`)}
                            className="font-bold text-zinc-950 dark:text-white cursor-pointer hover:text-primary dark:hover:text-primary transition-colors"
                          >
                            {userItem?.firstname + " " + userItem?.lastname}
                          </span>
                        )}
                        {columnKey === "email" && (
                          <span>{userItem?.email}</span>
                        )}
                        {columnKey === "phone" && (
                          <span>{userItem?.phoneNumber || "-"}</span>
                        )}
                        {columnKey === "role" && (
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                            userItem?.isAdmin
                              ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50"
                              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
                          }`}>
                            {userItem?.isAdmin ? "Admin" : "User"}
                          </span>
                        )}
                        {columnKey === "privilege" && (
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                            userItem?.isSuperAdmin
                              ? "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50"
                              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
                          }`}>
                            {userItem?.isSuperAdmin ? "Super Admin" : "User"}
                          </span>
                        )}
                        {columnKey === "verified" && (
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                            userItem?.is_verified
                              ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50"
                              : "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/50"
                          }`}>
                            {userItem?.is_verified ? "Verified" : "Not Verified"}
                          </span>
                        )}
                        {columnKey === "dateJoined" && (
                          <span>{formatDate(userItem?.createdAt)}</span>
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
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/users/${userItem?._id}`)} className="cursor-pointer">
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

export default UsersTable;
