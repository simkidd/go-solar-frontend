"use client";

import React, { useState } from "react";
import { useUserDetailQuery } from "@/hooks/queries/useUsersQuery";
import { formatDate, formatDateTime } from "@/utils/helpers";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  Clock,
  User as UserIcon,
  Shield,
  UserCheck,
  Fingerprint,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";

interface UserDetailsProps {
  id: string;
}

const UserDetails: React.FC<UserDetailsProps> = ({ id }) => {
  const { data: user, isLoading, isError } = useUserDetailQuery(id);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string, key: string) => {
    if (!text || text === "-") return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 font-inter">
        <div className="flex items-center gap-3 pb-4 border-b border-border/60">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-5 w-36 rounded-md" />
            <Skeleton className="h-3.5 w-24 rounded-md" />
          </div>
        </div>
        <div className="space-y-3 pt-2">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="p-6 text-center space-y-2 font-inter">
        <div className="h-10 w-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-2">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <h4 className="text-sm font-bold text-foreground">User Record Not Found</h4>
        <p className="text-xs text-muted-foreground">
          Unable to locate account information.
        </p>
      </div>
    );
  }

  const initials = `${user.firstname?.[0] || ""}${user.lastname?.[0] || ""}`.toUpperCase() || "U";

  return (
    <div className="space-y-5 font-inter text-xs">
      {/* ── 1. Profile Header ── */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-border/60">
        <Avatar className="h-12 w-12 border border-border/80">
          <AvatarFallback
            className={`font-black text-sm tracking-wider ${
              user.isSuperAdmin
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                : user.isAdmin
                ? "bg-primary/10 text-primary"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-extrabold text-foreground tracking-tight truncate">
              {user.firstname} {user.lastname}
            </h3>

            {user.isSuperAdmin ? (
              <Badge className="bg-amber-500/10 hover:bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20 text-[9px] font-bold px-2 py-0.5 shadow-none gap-1">
                <ShieldCheck className="h-2.5 w-2.5" />
                Super Admin
              </Badge>
            ) : user.isAdmin ? (
              <Badge className="bg-primary/10 hover:bg-primary/15 text-primary border-primary/20 text-[9px] font-bold px-2 py-0.5 shadow-none gap-1">
                <Shield className="h-2.5 w-2.5" />
                Store Admin
              </Badge>
            ) : (
              <Badge className="bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-[9px] font-bold px-2 py-0.5 shadow-none gap-1">
                <UserCheck className="h-2.5 w-2.5" />
                Customer
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {user.is_verified ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-3 w-3" />
                Verified Account
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                <ShieldAlert className="h-3 w-3" />
                Unverified Email
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── 2. Contact Details ── */}
      <div className="bg-card border border-border/80 p-4 rounded-2xl space-y-3 shadow-xs">
        <div className="border-b border-border/60 pb-2">
          <h4 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
            Contact Information
          </h4>
        </div>

        <div className="space-y-2.5">
          {/* Email */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/60">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                  Email
                </p>
                <a
                  href={`mailto:${user.email}`}
                  className="font-semibold text-foreground hover:text-primary transition-colors text-xs truncate block"
                >
                  {user.email}
                </a>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(user.email, "Email", "email")}
              className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
              title="Copy Email"
            >
              {copiedKey === "email" ? (
                <Check className="h-3 w-3 text-emerald-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>

          {/* Phone */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/60">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <Phone className="h-4 w-4 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                  Phone
                </p>
                <a
                  href={user.phoneNumber ? `tel:${user.phoneNumber}` : undefined}
                  className="font-semibold text-foreground hover:text-primary transition-colors text-xs truncate block"
                >
                  {user.phoneNumber || "Not provided"}
                </a>
              </div>
            </div>
            {user.phoneNumber && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(user.phoneNumber, "Phone number", "phone")}
                className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                title="Copy Phone"
              >
                {copiedKey === "phone" ? (
                  <Check className="h-3 w-3 text-emerald-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            )}
          </div>

          {/* Role Title (Staff) */}
          {user.roleTitle && (
            <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 flex items-center gap-2.5">
              <UserIcon className="h-4 w-4 text-primary shrink-0" />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                  Role Title
                </p>
                <p className="font-semibold text-foreground text-xs mt-0.5">
                  {user.roleTitle}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 3. Account Activity & Security Logs ── */}
      <div className="bg-card border border-border/80 p-4 rounded-2xl space-y-3 shadow-xs">
        <div className="border-b border-border/60 pb-2">
          <h4 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
            Account Security & Timestamps
          </h4>
        </div>

        <div className="space-y-2 text-xs">
          {/* User ID */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
            <span className="text-muted-foreground text-[11px]">User ID</span>
            <button
              type="button"
              onClick={() => copyToClipboard(user._id, "User ID", "userid")}
              className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-foreground hover:text-primary cursor-pointer"
              title="Copy User ID"
            >
              <span>{user._id}</span>
              {copiedKey === "userid" ? (
                <Check className="h-3 w-3 text-emerald-500" />
              ) : (
                <Copy className="h-3 w-3 text-muted-foreground" />
              )}
            </button>
          </div>

          {/* Date Joined */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
            <span className="text-muted-foreground text-[11px] flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              Registered
            </span>
            <span className="font-semibold text-foreground text-[11px]">
              {user.createdAt ? formatDate(user.createdAt) : "-"}
            </span>
          </div>

          {/* Last Login */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
            <span className="text-muted-foreground text-[11px] flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              Last Login
            </span>
            <span className="font-semibold text-foreground text-[11px]">
              {user.lastLogin ? formatDateTime(user.lastLogin) : "Never logged in"}
            </span>
          </div>

          {/* Last Updated */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
            <span className="text-muted-foreground text-[11px] flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              Last Update
            </span>
            <span className="font-semibold text-foreground text-[11px]">
              {user.updatedAt ? formatDate(user.updatedAt) : "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
