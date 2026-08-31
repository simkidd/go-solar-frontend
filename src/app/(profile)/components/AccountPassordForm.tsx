"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/stores/auth.store";
import { KeyRound, UserCog } from "lucide-react";
import {
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from "@/hooks/mutations/useAuthMutations";
import Cookies from "js-cookie";
import { USER_DETAILS } from "@/utils/constants";

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ProfileFormValues {
  firstname: string;
  lastname: string;
  phoneNumber: string;
}

const AccountSettingsManager = () => {
  const { user, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  // TanStack Query Mutations
  const updateProfileMutation = useUpdateProfileMutation({
    onSuccess: (data) => {
      if (data?.data?.user) {
        setUser(data.data.user);
        Cookies.set(USER_DETAILS, JSON.stringify(data.data.user), {
          expires: 30,
        });
      }
    },
  });

  const changePasswordMutation = useChangePasswordMutation({
    onSuccess: () => {
      resetPassword();
    },
  });

  // React Hook Form for Profile Info
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      phoneNumber: user?.phoneNumber || "",
    },
  });

  // React Hook Form for Password Info
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch: watchPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watchPassword("newPassword");

  // Handlers
  const onProfileUpdate = (values: ProfileFormValues) => {
    updateProfileMutation.mutate({
      firstname: values.firstname,
      lastname: values.lastname,
      phoneNumber: values.phoneNumber,
    });
  };

  const onPasswordUpdate = (values: PasswordFormValues) => {
    changePasswordMutation.mutate({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  };

  return (
    <div className="space-y-6 font-inter">
      {/* ── Settings Tabs ── */}
      <div className="flex border-b border-border/60 pb-px gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-wider border-b-2 transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "profile"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <UserCog className="h-3.5 w-3.5" />
          Edit Profile
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-wider border-b-2 transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "password"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <KeyRound className="h-3.5 w-3.5" />
          Password & Security
        </button>
      </div>

      {/* ── Profile Details Tab Content ── */}
      {activeTab === "profile" && (
        <div className="border border-border/80 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl p-6 space-y-6 max-w-xl transition-all duration-300">
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">
              Profile Information
            </h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Update your personal contact details and phone information.
            </p>
          </div>

          <form
            onSubmit={handleProfileSubmit(onProfileUpdate)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="John"
                  {...registerProfile("firstname", {
                    required: "First name is required",
                  })}
                  className="border-border rounded-xl bg-card text-xs font-bold focus-visible:ring-1"
                />
                {profileErrors.firstname && (
                  <p className="text-[10px] text-rose-500 font-semibold pl-1">
                    {profileErrors.firstname.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Doe"
                  {...registerProfile("lastname", {
                    required: "Last name is required",
                  })}
                  className="border-border rounded-xl bg-card text-xs font-bold focus-visible:ring-1"
                />
                {profileErrors.lastname && (
                  <p className="text-[10px] text-rose-500 font-semibold pl-1">
                    {profileErrors.lastname.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground">
                Email Address
              </label>
              <Input
                type="email"
                value={user?.email || ""}
                disabled
                className="border-border rounded-xl bg-muted/50 text-xs font-bold cursor-not-allowed text-muted-foreground "
              />
              <p className="text-[9px] text-muted-foreground pl-1">
                Login email addresses cannot be modified directly from this
                settings screen.
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground">
                Phone Number
              </label>
              <Input
                type="tel"
                placeholder="+234..."
                {...registerProfile("phoneNumber")}
                className="border-border rounded-xl bg-card text-xs font-bold focus-visible:ring-1"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider rounded-xl h-10 px-6 cursor-pointer"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save Details"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ── Password Security Tab Content ── */}
      {activeTab === "password" && (
        <div className="border border-border/80 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl p-6 space-y-6 max-w-xl transition-all duration-300">
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">
              Security & Password
            </h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Edit your dashboard authentication password details.
            </p>
          </div>

          <form
            onSubmit={handlePasswordSubmit(onPasswordUpdate)}
            className="space-y-4"
          >
            <div className="space-y-1">
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground">
                Current Password <span className="text-rose-500">*</span>
              </label>
              <Input
                type="password"
                placeholder="Enter current password"
                {...registerPassword("currentPassword", {
                  required: "Current password is required",
                })}
                className="border-border rounded-xl bg-card text-xs font-bold focus-visible:ring-1"
              />
              {passwordErrors.currentPassword && (
                <p className="text-[10px] text-rose-500 font-semibold pl-1">
                  {passwordErrors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground">
                New Password <span className="text-rose-500">*</span>
              </label>
              <Input
                type="password"
                placeholder="Enter new password"
                {...registerPassword("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="border-border rounded-xl bg-card text-xs font-bold focus-visible:ring-1"
              />
              {passwordErrors.newPassword && (
                <p className="text-[10px] text-rose-500 font-semibold pl-1">
                  {passwordErrors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground">
                Confirm New Password <span className="text-rose-500">*</span>
              </label>
              <Input
                type="password"
                placeholder="Confirm new password"
                {...registerPassword("confirmPassword", {
                  required: "Please confirm new password",
                  validate: (val) =>
                    val === newPassword || "Passwords do not match",
                })}
                className="border-border rounded-xl bg-card text-xs font-bold focus-visible:ring-1"
              />
              {passwordErrors.confirmPassword && (
                <p className="text-[10px] text-rose-500 font-semibold pl-1">
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider rounded-xl h-10 px-6 cursor-pointer"
                disabled={changePasswordMutation.isPending}
              >
                {changePasswordMutation.isPending
                  ? "Updating..."
                  : "Update Password"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AccountSettingsManager;
