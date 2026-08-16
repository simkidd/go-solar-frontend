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
} from "lucide-react";
import { formatDate } from "@/utils/helpers";
import { toast } from "sonner";
import {
  useAdminUsersQuery,
  useCreateAccountMutation,
  useUpdateUserRoleMutation,
} from "@/hooks/queries/useUsersQuery";
import UserDetails from "./UserDetails";
import { Skeleton } from "@/components/ui/skeleton";

export const AdminsTable = () => {
  const { data: admins = [], isLoading, refetch } = useAdminUsersQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  // Dialog & Sheet states
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRevokeOpen, setIsRevokeOpen] = useState(false);
  const [targetRevokeAdmin, setTargetRevokeAdmin] = useState<any | null>(null);

  // Invite Form state
  const [inviteForm, setInviteForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    roleType: "admin", // admin or superAdmin
    roleTitle: "Solar Technical Specialist",
    password: "",
  });

  const createAdminMutation = useCreateAccountMutation({
    onSuccess: () => {
      setIsInviteOpen(false);
      setInviteForm({
        firstname: "",
        lastname: "",
        email: "",
        phoneNumber: "",
        roleType: "admin",
        roleTitle: "Solar Technical Specialist",
        password: "",
      });
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

  const handleSaveInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !inviteForm.firstname ||
      !inviteForm.lastname ||
      !inviteForm.email ||
      !inviteForm.phoneNumber ||
      !inviteForm.password
    ) {
      toast.error("Please fill in all administrator details");
      return;
    }

    createAdminMutation.mutate({
      firstname: inviteForm.firstname,
      lastname: inviteForm.lastname,
      email: inviteForm.email,
      phoneNumber: inviteForm.phoneNumber,
      password: inviteForm.password,
      role: inviteForm.roleType,
      roleTitle: inviteForm.roleTitle,
    });
  };

  const handleToggleSuperAdmin = (admin: any) => {
    const nextSuper = !admin.isSuperAdmin;
    updateRoleMutation.mutate({
      userid: admin._id,
      payload: {
        isSuperAdmin: nextSuper,
        // Make sure it remains admin
        isAdmin: true,
      },
    });
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
    <div className="space-y-6 font-inter">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Administrator Directory
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Manage administrative staff, permissions, and security roles.
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
            onClick={() => setIsInviteOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-9 rounded-lg gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Admin
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch bg-white dark:bg-[#1a1b1e] p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search administrators..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 rounded-lg"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">Privilege:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-9 px-2.5 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 outline-none"
          >
            <option value="All">All Privileges ({admins.length})</option>
            <option value="Super Admin">Super Admins</option>
            <option value="Store Admin">Store Admins</option>
          </select>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white dark:bg-[#1a1b1e] rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/20">
            <TableRow className="border-b border-zinc-100 dark:border-zinc-800">
              <TableHead className="font-semibold text-zinc-500 h-10 px-4">
                Administrator
              </TableHead>
              <TableHead className="font-semibold text-zinc-500 h-10">
                Contact
              </TableHead>
              <TableHead className="font-semibold text-zinc-500 h-10">
                Assigned Privilege
              </TableHead>
              <TableHead className="font-semibold text-zinc-500 h-10">
                Status
              </TableHead>
              <TableHead className="font-semibold text-zinc-500 h-10">
                Date Appointed
              </TableHead>
              <TableHead className="font-semibold text-zinc-500 h-10">
                Last Login
              </TableHead>
              <TableHead className="font-semibold text-zinc-500 h-10 text-right px-4">
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
                          className="h-8 w-8 text-zinc-400 rounded-lg"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 text-xs">
                        <DropdownMenuLabel>Permissions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleOpenDetails(adm._id)}
                          className="cursor-pointer"
                        >
                          <Eye className="h-4 w-4 mr-2 text-zinc-500" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleSuperAdmin(adm)}
                          className="cursor-pointer"
                          disabled={updateRoleMutation.isPending}
                        >
                          <KeyRound className="h-4 w-4 mr-2 text-primary" />
                          <span>
                            {adm.isSuperAdmin
                              ? "Demote to Admin"
                              : "Promote to Super Admin"}
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setTargetRevokeAdmin(adm);
                            setIsRevokeOpen(true);
                          }}
                          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
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
        <SheetContent className="sm:max-w-md w-full overflow-y-auto border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1a1b1e] p-6">
          <SheetHeader className="border-b border-zinc-100 dark:border-zinc-800/80 pb-4 mb-4">
            <SheetTitle className="text-lg font-extrabold text-zinc-950 dark:text-white">
              Administrator Profile Details
            </SheetTitle>
            <SheetDescription className="text-xs text-zinc-500">
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
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-[#1a1b1e] border-zinc-100 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Add Administrator
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Grant staff or partners administrative access to the GoSolar
              dashboard.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveInvite} className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  First Name
                </label>
                <Input
                  placeholder="e.g. David"
                  value={inviteForm.firstname}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, firstname: e.target.value })
                  }
                  required
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Last Name
                </label>
                <Input
                  placeholder="e.g. Okoye"
                  value={inviteForm.lastname}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, lastname: e.target.value })
                  }
                  required
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="staff@gosolar.ng"
                value={inviteForm.email}
                onChange={(e) =>
                  setInviteForm({ ...inviteForm, email: e.target.value })
                }
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Phone Number
              </label>
              <Input
                placeholder="e.g. +234 803 111 2222"
                value={inviteForm.phoneNumber}
                onChange={(e) =>
                  setInviteForm({ ...inviteForm, phoneNumber: e.target.value })
                }
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Privilege
                </label>
                <select
                  value={inviteForm.roleType}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, roleType: e.target.value })
                  }
                  className="w-full h-9 px-2 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold outline-none"
                >
                  <option value="admin">Store Admin</option>
                  <option value="superAdmin">Super Admin</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Role Title
                </label>
                <Input
                  placeholder="e.g. Inventory Lead"
                  value={inviteForm.roleTitle}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, roleTitle: e.target.value })
                  }
                  required
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                System Password
              </label>
              <Input
                type="password"
                placeholder="Minimum 6 characters"
                value={inviteForm.password}
                onChange={(e) =>
                  setInviteForm({ ...inviteForm, password: e.target.value })
                }
                required
                className="h-9 text-xs"
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsInviteOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-primary hover:bg-primary/90 text-white font-bold"
                disabled={createAdminMutation.isPending}
              >
                {createAdminMutation.isPending ? "Creating..." : "Create Admin"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* CONFIRM ACCESS REVOCATION */}
      <Dialog open={isRevokeOpen} onOpenChange={setIsRevokeOpen}>
        <DialogContent className="max-w-sm bg-white dark:bg-[#1a1b1e] border-zinc-100 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-900 dark:text-white">
              Confirm Revocation
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Are you sure you want to revoke administrative access for{" "}
              <strong className="text-zinc-800 dark:text-white">
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
