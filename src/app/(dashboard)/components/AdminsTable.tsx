"use client";
import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import {
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  Search,
  Trash2,
  KeyRound,
  CheckCircle2,
  Plus,
  RefreshCw,
  Eye,
  ChevronDown,
} from "lucide-react";
import { formatDate } from "@/utils/helpers";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import AppModal from "@/components/AppModal";
import {
  useAdminUsersQuery,
  useCreateAccountMutation,
  useUpdateUserRoleMutation,
  useCurrentUserQuery,
} from "@/hooks/queries/useUsersQuery";
import UserDetails from "./UserDetails";
import { Skeleton } from "@/components/ui/skeleton";

export const AdminsTable = () => {
  const { data: admins = [], isLoading, refetch } = useAdminUsersQuery();
  const { data: currentUser } = useCurrentUserQuery();
  const isSuperAdmin = currentUser?.isSuperAdmin ?? false;
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  // Dialog & Sheet states
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRevokeOpen, setIsRevokeOpen] = useState(false);
  const [targetRevokeAdmin, setTargetRevokeAdmin] = useState<any | null>(null);
  const [isPromoteOpen, setIsPromoteOpen] = useState(false);
  const [targetPromoteAdmin, setTargetPromoteAdmin] = useState<any | null>(
    null,
  );

  // react-hook-form for invite admin form
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
      roleType: "admin",
      roleTitle: "Solar Technical Specialist",
      password: "",
    },
  });

  const createAdminMutation = useCreateAccountMutation({
    onSuccess: () => {
      setIsInviteOpen(false);
      reset();
      toast.success("Administrator account created successfully!");
    },
  });

  const updateRoleMutation = useUpdateUserRoleMutation({
    onSuccess: () => {
      toast.success("Administrator privilege updated!");
    },
  });

  const revokeMutation = useUpdateUserRoleMutation({
    onSuccess: () => {
      setIsRevokeOpen(false);
      setTargetRevokeAdmin(null);
      toast.success("Access revoked. Account demoted to customer.");
    },
  });

  // Filter loaded admins list
  const filteredAdmins = useMemo(() => {
    return admins.filter((adm) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        adm.firstname.toLowerCase().includes(q) ||
        adm.lastname.toLowerCase().includes(q) ||
        adm.email.toLowerCase().includes(q) ||
        (adm.phoneNumber && adm.phoneNumber.toLowerCase().includes(q));

      const matchesRole =
        roleFilter === "All"
          ? true
          : roleFilter === "Super Admin"
            ? adm.isSuperAdmin
            : !adm.isSuperAdmin;

      return matchesSearch && matchesRole;
    });
  }, [admins, searchTerm, roleFilter]);

  const handleSaveInvite = (values: any) => {
    createAdminMutation.mutate({
      firstname: values.firstname,
      lastname: values.lastname,
      email: values.email,
      phoneNumber: values.phoneNumber,
      password: values.password,
      role: values.roleType,
      roleTitle: values.roleTitle,
    });
  };

  const handleToggleSuperAdmin = () => {
    if (!targetPromoteAdmin) return;
    const nextSuper = !targetPromoteAdmin.isSuperAdmin;
    updateRoleMutation.mutate({
      userid: targetPromoteAdmin._id,
      payload: {
        isSuperAdmin: nextSuper,
        isAdmin: true,
      },
    });
    setIsPromoteOpen(false);
    setTargetPromoteAdmin(null);
  };

  const handleConfirmRevoke = () => {
    if (!targetRevokeAdmin) return;
    revokeMutation.mutate({
      userid: targetRevokeAdmin._id,
      payload: {
        isAdmin: false,
        isSuperAdmin: false,
      },
    });
  };

  const handleOpenDetails = (id: string) => {
    setSelectedUserId(id);
    setIsDetailsOpen(true);
  };

  return (
    <div className="w-full space-y-5 font-inter">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 ">
        <div>
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2 tracking-tight">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Administrator Directory
          </h2>
          <p className="text-xs text-muted-foreground font-semibold mt-0.5">
            Manage administrative staff, permissions, and security roles.
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
              setIsInviteOpen(true);
            }}
            className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-9 rounded-lg gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Admin
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 bg-card text-card-foreground p-5 rounded-2xl border border-border/80 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              placeholder="Search administrators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(searchTerm || roleFilter !== "All") && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchTerm("");
                  setRoleFilter("All");
                }}
                className="text-red-500 hover:text-red-600 hover:bg-red-50/50 dark:hover:bg-red-950/10 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Reset
              </Button>
            )}

            {/* Privilege Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-border text-xs font-semibold rounded-xl h-10 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted/30"
                >
                  {roleFilter === "All"
                    ? "All Privileges"
                    : roleFilter === "Super Admin"
                      ? "Super Admins"
                      : "Store Admins"}
                  <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-44 rounded-xl bg-card border border-border/80">
                <DropdownMenuItem
                  onClick={() => setRoleFilter("All")}
                  className="cursor-pointer text-xs font-bold"
                >
                  All Privileges
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setRoleFilter("Super Admin")}
                  className="cursor-pointer text-xs font-bold"
                >
                  Super Admins
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setRoleFilter("Store Admin")}
                  className="cursor-pointer text-xs font-bold"
                >
                  Store Admins
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] text-muted-foreground border-t border-border/60 pt-3  font-bold uppercase tracking-wider">
          <span>Total {filteredAdmins.length} administrators listed</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-card text-card-foreground rounded-2xl border border-border/80 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/80">
              <TableHead className="font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12  px-4">
                Administrator
              </TableHead>
              <TableHead className="font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12 ">
                Contact
              </TableHead>
              <TableHead className="font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12 ">
                Assigned Privilege
              </TableHead>
              <TableHead className="font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12 ">
                Status
              </TableHead>
              <TableHead className="font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12 ">
                Date Appointed
              </TableHead>
              <TableHead className="font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12 ">
                Last Login
              </TableHead>
              <TableHead className="font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12  text-right px-4">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32">
                  <div className="space-y-2 flex flex-col justify-center items-center py-8">
                    <Skeleton className="h-5 w-4/5" />
                    <Skeleton className="h-5 w-3/5" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredAdmins.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-12 text-sm text-zinc-400"
                >
                  No administrators found.
                </TableCell>
              </TableRow>
            ) : (
              filteredAdmins.map((adm) => (
                <TableRow
                  key={adm._id}
                  className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 border-b border-zinc-100 dark:border-zinc-800 last:border-b-0"
                >
                  {/* Name & Avatar */}
                  <TableCell className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-zinc-200 dark:border-zinc-700">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                          {adm.firstname[0]}
                          {adm.lastname[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span
                          onClick={() => handleOpenDetails(adm._id)}
                          className="font-bold text-zinc-900 dark:text-white text-sm cursor-pointer hover:text-primary transition-colors"
                        >
                          {adm.firstname} {adm.lastname}
                        </span>
                        <p className="text-xs text-zinc-400">
                          {adm.roleTitle || "Store Admin"}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Contact */}
                  <TableCell>
                    <div className="space-y-0.5 text-xs text-zinc-600 dark:text-zinc-300">
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3 w-3 text-zinc-400" />
                        <span>{adm.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <Phone className="h-3 w-3 text-zinc-400" />
                        <span>{adm.phoneNumber || "-"}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Privilege Badge */}
                  <TableCell>
                    {adm.isSuperAdmin ? (
                      <Badge className="bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/50 font-bold px-2.5 py-0.5 text-[10px] gap-1">
                        <ShieldCheck className="h-3 w-3 text-amber-600" />
                        Super Admin
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary border-primary/20 font-bold px-2.5 py-0.5 text-[10px] gap-1"
                      >
                        <ShieldAlert className="h-3 w-3 text-primary" />
                        Store Admin
                      </Badge>
                    )}
                  </TableCell>

                  {/* Verified Status */}
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Active
                    </span>
                  </TableCell>

                  {/* Date Appointed */}
                  <TableCell className="text-xs text-zinc-500 font-medium">
                    {formatDate(adm.createdAt)}
                  </TableCell>

                  {/* Last Login */}
                  <TableCell className="text-xs text-zinc-500 font-medium">
                    {adm.lastLogin
                      ? formatDate(adm.lastLogin)
                      : "Never logged in"}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right px-4">
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
                        className="w-48 rounded-xl bg-card border border-border/80"
                      >
                        <DropdownMenuLabel className="font-bold text-xs">
                          Permissions
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="border-border/60" />
                        <DropdownMenuItem
                          onClick={() => handleOpenDetails(adm._id)}
                          className="cursor-pointer text-xs font-bold"
                        >
                          <Eye className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        {isSuperAdmin && (
                          <DropdownMenuItem
                            onClick={() => {
                              setTargetPromoteAdmin(adm);
                              setIsPromoteOpen(true);
                            }}
                            className="cursor-pointer text-xs font-bold"
                            disabled={updateRoleMutation.isPending}
                          >
                            <KeyRound className="h-4 w-4 mr-2 text-primary" />
                            <span>
                              {adm.isSuperAdmin
                                ? "Demote to Admin"
                                : "Promote to Super Admin"}
                            </span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator className="border-border/60" />
                        <DropdownMenuItem
                          onClick={() => {
                            setTargetRevokeAdmin(adm);
                            setIsRevokeOpen(true);
                          }}
                          className="cursor-pointer text-xs font-bold text-rose-600 focus:text-rose-600 focus:bg-rose-50/50 dark:focus:bg-rose-950/20"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          <span>Revoke Access</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* DETAILS SLIDING SIDE SHEET */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="sm:max-w-md w-full overflow-y-auto border-border/80 bg-card text-card-foreground p-6">
          <SheetHeader className="border-b border-border/60 pb-4 mb-4">
            <SheetTitle className="text-lg font-extrabold text-foreground">
              Administrator Profile Details
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground mt-2">
              Assigned system role attributes, privileges, and verification
              audits.
            </SheetDescription>
          </SheetHeader>

          {selectedUserId && (
            <div className="py-2">
              <UserDetails id={selectedUserId} />
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* CREATE ADMIN DIALOG */}
      <AppModal
        isOpen={isInviteOpen}
        onOpenChange={setIsInviteOpen}
        title="Add Administrator"
        size="lg"
      >
        <form
          onSubmit={handleSubmit(handleSaveInvite)}
          className="w-full font-inter flex flex-col gap-6 pt-2"
        >
          {/* Details Card */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
            <div className="border-b border-border/60 pb-3 ">
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                Administrator Profile
              </h3>
              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                Grant staff or partners administrative access to the GoSolar
                dashboard
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block ">
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
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block ">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g. Okoye"
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
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block ">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                placeholder="staff@gosolar.ng"
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
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block ">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. +234 803 111 2222"
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

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block ">
                  Privilege
                </label>
                <select
                  {...register("roleType")}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-muted/30 text-xs font-bold text-foreground outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="admin">Store Admin</option>
                  <option value="superAdmin">Super Admin</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block ">
                  Role Title <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g. Inventory Lead"
                  {...register("roleTitle", {
                    required: "Role title is required",
                  })}
                  className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
                />
                {errors.roleTitle && (
                  <span className="text-[11px] font-bold text-red-500 mt-0.5 block">
                    {errors.roleTitle.message}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block ">
                System Password <span className="text-red-500">*</span>
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
              onClick={() => setIsInviteOpen(false)}
              className="text-muted-foreground hover:text-foreground text-xs font-bold h-10 px-4 rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider rounded-xl h-10 px-6 shadow-sm cursor-pointer"
              disabled={createAdminMutation.isPending}
            >
              {createAdminMutation.isPending ? "Creating..." : "Create Admin"}
            </Button>
          </div>
        </form>
      </AppModal>

      {/* CONFIRM PROMOTE / DEMOTE */}
      <Dialog open={isPromoteOpen} onOpenChange={setIsPromoteOpen}>
        <DialogContent className="max-w-sm bg-card border border-border/80 rounded-2xl ">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-foreground">
              {targetPromoteAdmin?.isSuperAdmin
                ? "Demote to Store Admin"
                : "Promote to Super Admin"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-2 leading-relaxed">
              {targetPromoteAdmin?.isSuperAdmin ? (
                <>
                  This will remove Super Admin privileges from{" "}
                  <strong className="text-foreground">
                    {targetPromoteAdmin?.firstname}{" "}
                    {targetPromoteAdmin?.lastname}
                  </strong>
                  . They will retain Store Admin access.
                </>
              ) : (
                <>
                  This will grant full Super Admin privileges to{" "}
                  <strong className="text-foreground">
                    {targetPromoteAdmin?.firstname}{" "}
                    {targetPromoteAdmin?.lastname}
                  </strong>
                  . Proceed with caution.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2 gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPromoteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleToggleSuperAdmin}
              disabled={updateRoleMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl px-5 cursor-pointer"
            >
              {updateRoleMutation.isPending
                ? "Updating..."
                : targetPromoteAdmin?.isSuperAdmin
                  ? "Yes, Demote"
                  : "Yes, Promote"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CONFIRM ACCESS REVOCATION */}
      <Dialog open={isRevokeOpen} onOpenChange={setIsRevokeOpen}>
        <DialogContent className="max-w-sm bg-card border border-border/80 rounded-2xl ">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-foreground">
              Confirm Revocation
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Are you sure you want to revoke administrative access for{" "}
              <strong className="text-foreground">
                {targetRevokeAdmin?.firstname} {targetRevokeAdmin?.lastname}
              </strong>
              ? They will be demoted to a regular customer profile.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2 gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsRevokeOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirmRevoke}
              disabled={revokeMutation.isPending}
            >
              {revokeMutation.isPending ? "Revoking..." : "Revoke Access"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
