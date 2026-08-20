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
import {
  useAllUsersQuery,
  useCreateAccountMutation,
} from "@/hooks/queries/useUsersQuery";
import UserDetails from "./UserDetails";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import AppModal from "@/components/AppModal";

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

  // react-hook-form for customer form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phoneNumber: "",
      password: "",
    },
  });

  const createMutation = useCreateAccountMutation({
    onSuccess: () => {
      setIsCreateOpen(false);
      reset();
      toast.success("Customer account registered successfully!");
      setPage(1);
    },
  });

  const { data, isLoading, refetch } = useAllUsersQuery({
    page,
    limit: rowsPerPage,
    q: searchTerm,
  });

  const customers = data?.users || [];
  const pagination = data?.pagination || { total: 0, pages: 1 };

  const handleOpenDetails = (id: string) => {
    setSelectedUserId(id);
    setIsDetailsOpen(true);
  };

  const handleCreateCustomer = (values: any) => {
    createMutation.mutate({
      firstname: values.firstname,
      lastname: values.lastname,
      email: values.email,
      phoneNumber: values.phoneNumber,
      password: values.password,
      role: "customer",
    });
  };

  return (
    <div className="w-full space-y-5 font-inter">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
        <div>
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2 tracking-tight">
            <UserCheck className="h-5 w-5 text-primary" />
            Customer Directory
          </h2>
          <p className="text-xs text-muted-foreground font-semibold mt-0.5">
            Manage registered system users, customer accounts, and verification
            statuses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-2 border-border text-muted-foreground hover:text-foreground h-9 rounded-xl text-xs font-semibold cursor-pointer hover:bg-muted/30"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>

          <Button
            onClick={() => {
              reset();
              setIsCreateOpen(true);
            }}
            className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-9 rounded-lg gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 bg-card text-card-foreground p-5 rounded-2xl border border-border/80 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              placeholder="Search leads by name, email, phone..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="pl-10 bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
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
                className="text-red-500 hover:text-red-600 hover:bg-red-50/50 dark:hover:bg-red-950/10 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Counter */}
        <div className="flex justify-between items-center text-[10px] text-muted-foreground border-t border-border/60 pt-3 select-none font-bold uppercase tracking-wider">
          <span>Total {pagination.total} registered customers</span>
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
                    col.uid === "actions" ? "text-right px-4" : ""
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
                  </div>
                </TableCell>
              </TableRow>
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-sm text-zinc-500 dark:text-zinc-400"
                >
                  No customers found
                </TableCell>
              </TableRow>
            ) : (
              customers.map((userItem) => (
                <TableRow
                  key={userItem?._id}
                  className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/30 dark:hover:bg-zinc-800/10"
                >
                  {columns.map((col) => {
                    const columnKey = col.uid;
                    return (
                      <TableCell
                        key={columnKey}
                        className="py-3 text-sm text-zinc-800 dark:text-zinc-200"
                      >
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
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              userItem?.is_verified
                                ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50"
                                : "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/50"
                            }`}
                          >
                            {userItem?.is_verified
                              ? "Verified"
                              : "Not Verified"}
                          </span>
                        )}
                        {columnKey === "lastLogin" && (
                          <span className="text-xs font-semibold text-zinc-500">
                            {userItem?.lastLogin
                              ? formatDate(userItem.lastLogin)
                              : "Never logged in"}
                          </span>
                        )}
                        {columnKey === "actions" && (
                          <div className="flex justify-end px-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-lg cursor-pointer hover:bg-muted"
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
                                    handleOpenDetails(userItem?._id)
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
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, pagination.pages))
              }
              className="border-zinc-200 dark:border-zinc-800"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* DETAILS SLIDING SIDE SHEET */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="sm:max-w-md w-full overflow-y-auto border-border/80 bg-card text-card-foreground p-6">
          <SheetHeader className="border-b border-border/60 pb-4 mb-4">
            <SheetTitle className="text-lg font-extrabold text-foreground">
              Customer Profile Details
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground mt-2">
              Complete user account security parameters, logs, and
              registrations.
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
      <AppModal
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Add Customer Account"
        size="lg"
      >
        <form
          onSubmit={handleSubmit(handleCreateCustomer)}
          className="w-full font-inter flex flex-col gap-6 pt-2"
        >
          {/* Details Card */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
            <div className="border-b border-border/60 pb-3 select-none">
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                Customer Profile
              </h3>
              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                Create a new pre-verified customer profile directly in the
                database
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block select-none">
                  First Name <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g. David"
                  {...register("firstname", {
                    required: "First name is required",
                  })}
                  className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
                />
                {errors.firstname && (
                  <span className="text-[11px] font-bold text-red-500 mt-0.5 block">
                    {errors.firstname.message}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block select-none">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g. Okeke"
                  {...register("lastname", {
                    required: "Last name is required",
                  })}
                  className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
                />
                {errors.lastname && (
                  <span className="text-[11px] font-bold text-red-500 mt-0.5 block">
                    {errors.lastname.message}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block select-none">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                placeholder="customer@domain.com"
                {...register("email", { required: "Email is required" })}
                className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
              />
              {errors.email && (
                <span className="text-[11px] font-bold text-red-500 mt-0.5 block">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block select-none">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. +234 803 000 0000"
                {...register("phoneNumber", {
                  required: "Phone number is required",
                })}
                className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
              />
              {errors.phoneNumber && (
                <span className="text-[11px] font-bold text-red-500 mt-0.5 block">
                  {errors.phoneNumber.message}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block select-none">
                Password <span className="text-red-500">*</span>
              </label>
              <Input
                type="password"
                placeholder="Minimum 6 characters"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Min length is 6" },
                })}
                className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
              />
              {errors.password && (
                <span className="text-[11px] font-bold text-red-500 mt-0.5 block">
                  {errors.password.message}
                </span>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsCreateOpen(false)}
              className="text-muted-foreground hover:text-foreground text-xs font-bold h-10 px-4 rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider rounded-xl h-10 px-6 shadow-sm cursor-pointer"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Creating..." : "Save Customer"}
            </Button>
          </div>
        </form>
      </AppModal>
    </div>
  );
};

export default UsersTable;
