"use client";
import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
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
  MoreVertical,
  Eye,
  RefreshCw,
  Search,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Plus,
  UserPlus,
} from "lucide-react";
import { formatDate } from "@/utils/helpers";
import { useAllUsersQuery, useCreateAccountMutation } from "@/hooks/queries/useUsersQuery";
import UserDetails from "./UserDetails";
import { toast } from "sonner";

const columns = [
  { name: "Customer Name", uid: "name" },
  { name: "Contact Info", uid: "contact" },
  { name: "Date Joined", uid: "dateJoined" },
  { name: "Verification Status", uid: "verified" },
  { name: "Last Login", uid: "lastLogin" },
  { name: "Actions", uid: "actions" },
];

const UsersTable = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Detailed sheet state
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Manual create state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const { data, isLoading, refetch } = useAllUsersQuery({
    page,
    limit: rowsPerPage,
    q: searchTerm,
  });

  const createMutation = useCreateAccountMutation({
    onSuccess: () => {
      setIsCreateOpen(false);
      setCreateForm({
        firstname: "",
        lastname: "",
        email: "",
        phoneNumber: "",
        password: "",
      });
      toast.success("Customer account registered successfully!");
      setPage(1);
    },
  });

  const customers = data?.users || [];
  const pagination = data?.pagination || { total: 0, pages: 1 };

  const handleOpenDetails = (id: string) => {
    setSelectedUserId(id);
    setIsDetailsOpen(true);
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.firstname || !createForm.lastname || !createForm.email || !createForm.phoneNumber || !createForm.password) {
      toast.error("Please fill in all fields.");
      return;
    }
    createMutation.mutate({
      ...createForm,
      role: "customer",
    });
  };

  const onRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  return (
    <div className="space-y-6 font-inter">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            Customer Directory
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Manage registered system users, customer accounts, and verification statuses.
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

          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-9 rounded-lg gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 bg-white dark:bg-[#1a1b1e] p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search leads by name, email, phone..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="pl-9 h-9 text-xs bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 rounded-lg"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {searchTerm && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchTerm("");
                  setPage(1);
                }}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs h-9"
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Counter and row switcher */}
        <div className="flex justify-between items-center text-xs text-zinc-400 dark:text-zinc-500 border-t border-zinc-100 dark:border-zinc-800/80 pt-3">
          <span>Total {pagination.total} registered customers</span>
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
              {columns.map((col) => (
                <TableHead
                  key={col.uid}
                  className={`font-semibold text-zinc-500 dark:text-zinc-400 h-11 text-xs select-none ${col.uid === "actions" ? "text-right px-4" : ""}`}
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
                  </div>
                </TableCell>
              </TableRow>
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  No customers found
                </TableCell>
              </TableRow>
            ) : (
              customers.map((userItem) => (
                <TableRow key={userItem?._id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/30 dark:hover:bg-zinc-800/10">
                  {columns.map((col) => {
                    const columnKey = col.uid;
                    return (
                      <TableCell key={columnKey} className="py-3 text-sm text-zinc-800 dark:text-zinc-200">
                        {columnKey === "name" && (
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border border-zinc-200 dark:border-zinc-700">
                              <AvatarFallback className="bg-primary/10 text-primary font-bold text-[10px]">
                                {userItem?.firstname[0]}
                                {userItem?.lastname[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span 
                              onClick={() => handleOpenDetails(userItem?._id)}
                              className="font-bold text-zinc-950 dark:text-white cursor-pointer hover:text-primary dark:hover:text-primary transition-colors"
                            >
                              {userItem?.firstname + " " + userItem?.lastname}
                            </span>
                          </div>
                        )}
                        {columnKey === "contact" && (
                          <div className="space-y-0.5 text-xs">
                            <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300">
                              <Mail className="h-3 w-3 text-zinc-400" />
                              <span>{userItem?.email}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-zinc-400">
                              <Phone className="h-3 w-3 text-zinc-400" />
                              <span>{userItem?.phoneNumber || "-"}</span>
                            </div>
                          </div>
                        )}
                        {columnKey === "dateJoined" && (
                          <span>{formatDate(userItem?.createdAt)}</span>
                        )}
                        {columnKey === "verified" && (
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            userItem?.is_verified
                              ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50"
                              : "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/50"
                          }`}>
                            {userItem?.is_verified ? "Verified" : "Not Verified"}
                          </span>
                        )}
                        {columnKey === "lastLogin" && (
                          <span className="text-xs font-semibold text-zinc-500">
                            {userItem?.lastLogin ? formatDate(userItem.lastLogin) : "Never logged in"}
                          </span>
                        )}
                        {columnKey === "actions" && (
                          <div className="flex justify-end px-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-32">
                                <DropdownMenuItem onClick={() => handleOpenDetails(userItem?._id)} className="cursor-pointer">
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
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between py-2 border-t border-zinc-100 dark:border-zinc-800">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Page {page} of {pagination.pages}
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
              disabled={page === pagination.pages}
              onClick={() => setPage((prev) => Math.min(prev + 1, pagination.pages))}
              className="border-zinc-200 dark:border-zinc-800"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* DETAILS SLIDING SIDE SHEET */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="sm:max-w-md w-full overflow-y-auto border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1a1b1e] p-6">
          <SheetHeader className="border-b border-zinc-100 dark:border-zinc-800/80 pb-4 mb-4">
            <SheetTitle className="text-lg font-extrabold text-zinc-950 dark:text-white">
              Customer Profile Details
            </SheetTitle>
            <SheetDescription className="text-xs text-zinc-500">
              Complete user account security parameters, logs, and registrations.
            </SheetDescription>
          </SheetHeader>

          {selectedUserId && (
            <div className="py-2">
              <UserDetails id={selectedUserId} />
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* ADD CUSTOMER MODAL */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-[#1a1b1e] border-zinc-100 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Add Customer Account
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Create a new pre-verified customer profile directly in the database.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateCustomer} className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">First Name</label>
                <Input
                  placeholder="e.g. David"
                  value={createForm.firstname}
                  onChange={(e) => setCreateForm({ ...createForm, firstname: e.target.value })}
                  required
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Last Name</label>
                <Input
                  placeholder="e.g. Okeke"
                  value={createForm.lastname}
                  onChange={(e) => setCreateForm({ ...createForm, lastname: e.target.value })}
                  required
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Email Address</label>
              <Input
                type="email"
                placeholder="customer@domain.com"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Phone Number</label>
              <Input
                placeholder="e.g. +234 803 000 0000"
                value={createForm.phoneNumber}
                onChange={(e) => setCreateForm({ ...createForm, phoneNumber: e.target.value })}
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Password</label>
              <Input
                type="password"
                placeholder="Minimum 6 characters"
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                required
                className="h-9 text-xs"
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 text-white font-bold" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Save Customer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersTable;
