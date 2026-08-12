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
  Lock,
  User,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import useUsers from "@/hooks/useUsers";
import { formatDate } from "@/utils/helpers";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";

export interface AdminUserItem {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  roleTitle?: string;
  is_verified: boolean;
  createdAt: string;
}

const INITIAL_ADMINS: AdminUserItem[] = [
  {
    _id: "adm-1",
    firstname: "John",
    lastname: "Mason",
    email: "john.mason@gosolar.ng",
    phoneNumber: "+234 803 111 2233",
    isSuperAdmin: true,
    isAdmin: true,
    roleTitle: "Lead Systems Architect",
    is_verified: true,
    createdAt: new Date("2024-01-15").toISOString(),
  },
  {
    _id: "adm-2",
    firstname: "Chidinma",
    lastname: "Eze",
    email: "c.eze@gosolar.ng",
    phoneNumber: "+234 802 444 5566",
    isSuperAdmin: false,
    isAdmin: true,
    roleTitle: "Store & Inventory Manager",
    is_verified: true,
    createdAt: new Date("2024-06-20").toISOString(),
  },
  {
    _id: "adm-3",
    firstname: "Babajide",
    lastname: "Fashola",
    email: "b.fashola@gosolar.ng",
    phoneNumber: "+234 812 777 8899",
    isSuperAdmin: false,
    isAdmin: true,
    roleTitle: "Customer Quotes Lead",
    is_verified: true,
    createdAt: new Date("2025-02-10").toISOString(),
  },
];

export const AdminsTable = () => {
  const { users, isLoading, refetch } = useUsers();
  const [localAdmins, setLocalAdmins] = useState<AdminUserItem[]>(INITIAL_ADMINS);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  // Dialog states
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeAdmin, setActiveAdmin] = useState<AdminUserItem | null>(null);

  // Invite Form state
  const [inviteForm, setInviteForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    roleType: "Store Admin",
    roleTitle: "Solar Technical Specialist",
    password: "",
  });

  // Combine database admin users with local admins
  const allAdmins = useMemo(() => {
    const apiAdmins = users
      .filter((u) => u.isAdmin || u.isSuperAdmin)
      .map((u) => ({
        _id: u._id,
        firstname: u.firstname,
        lastname: u.lastname,
        email: u.email,
        phoneNumber: u.phoneNumber || "+234 800 000 0000",
        isSuperAdmin: u.isSuperAdmin,
        isAdmin: u.isAdmin,
        roleTitle: u.isSuperAdmin ? "Super Admin" : "Store Administrator",
        is_verified: u.is_verified,
        createdAt: new Date(u.createdAt).toISOString(),
      }));

    const combined = [...localAdmins];
    apiAdmins.forEach((apiAdm) => {
      if (!combined.some((a) => a.email.toLowerCase() === apiAdm.email.toLowerCase())) {
        combined.push(apiAdm);
      }
    });

    return combined;
  }, [users, localAdmins]);

  const filteredAdmins = useMemo(() => {
    return allAdmins.filter((adm) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        adm.firstname.toLowerCase().includes(q) ||
        adm.lastname.toLowerCase().includes(q) ||
        adm.email.toLowerCase().includes(q) ||
        adm.phoneNumber.includes(q);

      const matchesRole =
        roleFilter === "All"
          ? true
          : roleFilter === "Super Admin"
          ? adm.isSuperAdmin
          : !adm.isSuperAdmin;

      return matchesSearch && matchesRole;
    });
  }, [allAdmins, searchTerm, roleFilter]);

  const handleSaveInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteForm.email || !inviteForm.firstname) {
      toast.error("Please fill in admin details");
      return;
    }

    const isSuper = inviteForm.roleType === "Super Admin";
    const newAdmin: AdminUserItem = {
      _id: `adm-${Date.now()}`,
      firstname: inviteForm.firstname,
      lastname: inviteForm.lastname,
      email: inviteForm.email,
      phoneNumber: inviteForm.phoneNumber || "+234 800 000 0000",
      isSuperAdmin: isSuper,
      isAdmin: true,
      roleTitle: inviteForm.roleTitle || inviteForm.roleType,
      is_verified: true,
      createdAt: new Date().toISOString(),
    };

    setLocalAdmins((prev) => [newAdmin, ...prev]);
    setIsInviteOpen(false);
    toast.success(`Administrator ${inviteForm.firstname} ${inviteForm.lastname} added!`);
  };

  const handleToggleSuperAdmin = (admin: AdminUserItem) => {
    const updatedStatus = !admin.isSuperAdmin;
    setLocalAdmins((prev) =>
      prev.map((a) =>
        a._id === admin._id ? { ...a, isSuperAdmin: updatedStatus } : a
      )
    );
    toast.success(
      updatedStatus
        ? `${admin.firstname} elevated to Super Admin`
        : `${admin.firstname} set to Store Admin`
    );
  };

  const handleDelete = () => {
    if (!activeAdmin) return;
    setLocalAdmins((prev) => prev.filter((a) => a._id !== activeAdmin._id));
    setIsDeleteOpen(false);
    toast.success(`Revoked administrative access for ${activeAdmin.firstname}`);
  };

  return (
    <div className="space-y-6 font-inter">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Administrators & Staff Management
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Manage store administrators, privilege levels, and system permissions.
          </p>
        </div>

        <Button
          onClick={() => setIsInviteOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-9 rounded-lg gap-1.5 shadow-sm"
        >
          <UserPlus className="h-4 w-4" />
          Add Administrator
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-[#1a1b1e] p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search admins by name, email, phone..."
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
            <option value="All">All Privileges ({allAdmins.length})</option>
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
              <TableHead className="font-semibold text-zinc-500 h-10 px-4">Administrator</TableHead>
              <TableHead className="font-semibold text-zinc-500 h-10">Contact</TableHead>
              <TableHead className="font-semibold text-zinc-500 h-10">Assigned Privilege</TableHead>
              <TableHead className="font-semibold text-zinc-500 h-10">Status</TableHead>
              <TableHead className="font-semibold text-zinc-500 h-10">Date Appointed</TableHead>
              <TableHead className="font-semibold text-zinc-500 h-10 text-right px-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAdmins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-sm text-zinc-400">
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
                        <p className="font-bold text-zinc-900 dark:text-white text-sm">
                          {adm.firstname} {adm.lastname}
                        </p>
                        <p className="text-xs text-zinc-400">{adm.roleTitle || "Store Admin"}</p>
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
                        <span>{adm.phoneNumber}</span>
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
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-bold px-2.5 py-0.5 text-[10px] gap-1">
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

                  {/* Actions */}
                  <TableCell className="text-right px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 rounded-lg">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 text-xs">
                        <DropdownMenuLabel>Permissions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleToggleSuperAdmin(adm)} className="cursor-pointer">
                          <KeyRound className="h-4 w-4 mr-2 text-primary" />
                          <span>{adm.isSuperAdmin ? "Demote to Admin" : "Promote to Super Admin"}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setActiveAdmin(adm);
                            setIsDeleteOpen(true);
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

      {/* INVITE / ADD ADMIN MODAL */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-[#1a1b1e] border-zinc-100 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Add Administrator
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Grant staff or partners administrative access to the GoSolar dashboard.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveInvite} className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">First Name</label>
                <Input
                  placeholder="e.g. David"
                  value={inviteForm.firstname}
                  onChange={(e) => setInviteForm({ ...inviteForm, firstname: e.target.value })}
                  required
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Last Name</label>
                <Input
                  placeholder="e.g. Nwachukwu"
                  value={inviteForm.lastname}
                  onChange={(e) => setInviteForm({ ...inviteForm, lastname: e.target.value })}
                  required
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Official Email</label>
              <Input
                type="email"
                placeholder="staff@gosolar.ng"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Phone</label>
                <Input
                  placeholder="+234 800 000 0000"
                  value={inviteForm.phoneNumber}
                  onChange={(e) => setInviteForm({ ...inviteForm, phoneNumber: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Privilege Tier</label>
                <select
                  value={inviteForm.roleType}
                  onChange={(e) => setInviteForm({ ...inviteForm, roleType: e.target.value })}
                  className="w-full h-9 px-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900 text-xs font-semibold"
                >
                  <option value="Store Admin">Store Administrator</option>
                  <option value="Super Admin">Super Administrator</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Job Title / Designation</label>
              <Input
                placeholder="e.g. Solar Technical Engineer"
                value={inviteForm.roleTitle}
                onChange={(e) => setInviteForm({ ...inviteForm, roleTitle: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsInviteOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 text-white font-bold">
                Create Admin Account
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* REVOKE ACCESS MODAL */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm bg-white dark:bg-[#1a1b1e] border-zinc-100 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-900 dark:text-white">
              Revoke Administrator Access
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 mt-2">
              Are you sure you want to revoke administrative permissions for <b>{activeAdmin?.firstname} {activeAdmin?.lastname}</b>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              Confirm Revocation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminsTable;
