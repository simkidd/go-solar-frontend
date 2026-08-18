"use client";

import { useAuthStore } from "@/lib/stores/auth.store";
import React from "react";
import { User, Phone, Mail, Calendar, ArrowRight, ShieldCheck, ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/utils/helpers";
import { Button } from "@/components/ui/button";

const ProfileDetails = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8 font-inter">
      
      {/* ── Welcome Greeting Banner ── */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent p-6 sm:p-8">
        <div className="relative z-10 space-y-2 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="h-3 w-3" />
            Verified Account
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white leading-tight">
            Hello, {user?.firstname || "Customer"}!
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Welcome to your GoSolar Account Portal. From here, you can view your purchase history, edit password credentials, and access configuration utilities.
          </p>
        </div>
        {/* Ambient decorative bg pattern */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-[radial-gradient(circle_at_bottom_right,var(--primary)/15,transparent_60%)] pointer-events-none" />
      </div>

      {/* ── Dashboard Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Profile Card */}
        <div className="bg-zinc-50/50 dark:bg-zinc-900/30 border border-border/80 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
              <User className="h-4.5 w-4.5 text-primary" />
              Personal Profile
            </h3>
            <Link 
              href="/account/settings" 
              className="text-[10px] font-black uppercase tracking-wider text-primary hover:underline flex items-center gap-1"
            >
              Edit Settings
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3.5 text-xs text-zinc-650 dark:text-zinc-350">
            <div className="flex items-center justify-between py-0.5">
              <span className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Full Name</span>
              <span className="font-extrabold text-foreground">{user?.firstname} {user?.lastname}</span>
            </div>
            <div className="flex items-center justify-between py-0.5">
              <span className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Email Address</span>
              <span className="font-extrabold text-foreground select-all">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between py-0.5">
              <span className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Phone Number</span>
              <span className="font-extrabold text-foreground">{user?.phoneNumber || "Not provided"}</span>
            </div>
            <div className="flex items-center justify-between py-0.5">
              <span className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Joined Date</span>
              <span className="font-extrabold text-foreground">{user?.createdAt ? formatDate(user.createdAt) : "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Quick Utilities & Calculator Shortcuts */}
        <div className="bg-zinc-50/50 dark:bg-zinc-900/30 border border-border/80 rounded-2xl p-6 space-y-4">
          <div className="border-b border-border/60 pb-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-primary" />
              Quick Utilities
            </h3>
          </div>

          <div className="space-y-3 pt-1">
            <Link href="/energy-calculator" className="block group">
              <div className="flex items-center justify-between p-3 rounded-xl border border-border/60 hover:border-primary/40 bg-card hover:bg-primary/5 transition-all duration-200">
                <div>
                  <h4 className="font-extrabold text-xs text-foreground group-hover:text-primary transition-colors">
                    Solar Calculator
                  </h4>
                  <p className="text-[10px] text-muted-foreground">
                    Configure and estimate your home load sizing system.
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
              </div>
            </Link>

            <Link href="/shop" className="block group">
              <div className="flex items-center justify-between p-3 rounded-xl border border-border/60 hover:border-primary/40 bg-card hover:bg-primary/5 transition-all duration-200">
                <div>
                  <h4 className="font-extrabold text-xs text-foreground group-hover:text-primary transition-colors">
                    Store Catalog
                  </h4>
                  <p className="text-[10px] text-muted-foreground">
                    Browse clean solar panels, invertors, and battery packages.
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ProfileDetails;
