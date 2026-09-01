"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import { usePackagesQuery } from "@/hooks/queries/usePackagesQuery";
import { useCreateFinancingRequest } from "@/hooks/mutations/useFinancingMutations";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/helpers";
import {
  ShieldCheck,
  Calculator,
  Briefcase,
  DollarSign,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

interface FinancingFormValues {
  packageId: string;
  customSystemSize: string;
  customAmount: string;
  downPaymentPercent: string;
  repaymentMonths: string;
  employmentStatus: string;
  monthlyIncome: string;
  employerName: string;
  phoneNumber: string;
  address: string;
}

export default function FinancingApplyClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, loading: sessionLoading } = useSession();
  const packageIdParam = searchParams.get("packageId") || "";

  const { data: packages = [], isLoading: packagesLoading } =
    usePackagesQuery();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FinancingFormValues>({
    defaultValues: {
      packageId: packageIdParam,
      customSystemSize: "",
      customAmount: "",
      downPaymentPercent: "20",
      repaymentMonths: "12",
      employmentStatus: "Employed",
      monthlyIncome: "",
      employerName: "",
      phoneNumber: "",
      address: "",
    },
  });

  const createFinancingMutation = useCreateFinancingRequest({
    onSuccess: () => {
      setIsSuccessOpen(true);
      reset();
    },
  });

  const watchPackageId = watch("packageId");
  const watchCustomAmount = watch("customAmount");
  const watchCustomSystemSize = watch("customSystemSize");
  const watchDownPaymentPercent = watch("downPaymentPercent");
  const watchRepaymentMonths = watch("repaymentMonths");

  // Selected package details
  const selectedPkg = packages.find((p: any) => p._id === watchPackageId);

  // Amounts calculation
  const totalAmount = selectedPkg
    ? selectedPkg.price
    : parseFloat(watchCustomAmount) || 0;
  const systemSize = selectedPkg
    ? selectedPkg.name
    : watchCustomSystemSize || "Custom Solar System";

  const downPaymentPercentVal = parseFloat(watchDownPaymentPercent) || 20;
  const downPaymentAmount = (totalAmount * downPaymentPercentVal) / 100;
  const remainingBalance = totalAmount - downPaymentAmount;

  // Monthly payment calculation with flat 5% interest
  const months = parseInt(watchRepaymentMonths) || 12;
  const interestMultiplier = 1.05; // flat 5% interest
  const monthlyPayment =
    totalAmount > 0 ? (remainingBalance * interestMultiplier) / months : 0;

  useEffect(() => {
    if (packageIdParam) {
      setValue("packageId", packageIdParam);
    }
  }, [packageIdParam, setValue]);

  if (sessionLoading || packagesLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 max-w-lg py-16 text-center  font-inter">
        <Card className="border-border rounded-2xl p-6 shadow-sm bg-white dark:bg-zinc-900">
          <CardContent className="space-y-4 pt-4">
            <div className="h-14 w-14 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              Sign In Required
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Please sign in to your GoSolar account to apply for solar
              financing.
            </p>
            <Link
              href={`/auth/login?redirectUrl=${encodeURIComponent("/financing/apply")}`}
              className="block w-full"
            >
              <Button className="w-full bg-[#08AA08] hover:bg-[#079907] text-white font-semibold rounded-xl h-11 text-xs">
                Sign In to Continue
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const onSubmit = (values: FinancingFormValues) => {
    if (totalAmount <= 0) {
      return;
    }

    createFinancingMutation.mutate({
      packageId: values.packageId || undefined,
      systemSize,
      totalAmount,
      downPayment: downPaymentAmount,
      repaymentMonths: months,
      monthlyPayment,
      employmentStatus: values.employmentStatus,
      monthlyIncome: parseFloat(values.monthlyIncome),
      employerName: values.employerName,
      phoneNumber: values.phoneNumber,
      address: values.address,
    });
  };

  return (
    <div className="w-full font-inter bg-zinc-50/50 dark:bg-zinc-955 py-12 text-left">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center space-y-2 mb-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#08AA08] bg-[#08AA08]/10 px-3 py-1.5 rounded-full">
            Flexible Repayments
          </span>
          <h1 className="mt-2 text-3xl font-black text-zinc-900 dark:text-white tracking-tight leading-none">
            Solar Financing Application
          </h1>
          <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
            Apply for flexible repayment options to power your home or business
            with clean energy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="lg:col-span-7 space-y-6"
          >
            <Card className="border border-border/80 rounded-2xl shadow-xs bg-white dark:bg-zinc-900">
              <CardContent className="p-6 md:p-8 space-y-6">
                <div className="space-y-4">
                  <h3 className="font-extrabold text-sm text-foreground uppercase tracking-wider pb-2 border-b border-border/50">
                    1. System Sizing & Package
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground  block">
                      Select Package
                    </label>
                    <Select
                      disabled={!!packageIdParam}
                      value={watchPackageId}
                      onValueChange={(val) => {
                        setValue("packageId", val);
                        if (val !== "custom") {
                          setValue("customAmount", "");
                          setValue("customSystemSize", "");
                        }
                      }}
                    >
                      <SelectTrigger className="bg-muted/30 border-border rounded-xl text-xs h-10 font-semibold focus:ring-primary">
                        <SelectValue placeholder="Pick a standard package" />
                      </SelectTrigger>
                      <SelectContent className="bg-card text-card-foreground border-border rounded-xl">
                        {packages.map((pkg: any) => (
                          <SelectItem
                            key={pkg._id}
                            value={pkg._id}
                            className="text-xs font-semibold"
                          >
                            {pkg.name} ({formatCurrency(pkg.price, "NGN")})
                          </SelectItem>
                        ))}
                        <SelectItem
                          value="custom"
                          className="text-xs font-semibold text-[#08AA08]"
                        >
                          Custom Request / Quote Amount
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {watchPackageId === "custom" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground  block">
                          System Size / Title{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <Input
                          placeholder="e.g. 5kVA Solar Setup"
                          {...register("customSystemSize", {
                            required:
                              watchPackageId === "custom"
                                ? "Field required"
                                : false,
                          })}
                          className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary font-semibold"
                        />
                        {errors.customSystemSize && (
                          <p className="text-[10px] text-red-500 font-semibold">
                            {errors.customSystemSize.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground  block">
                          Total Quote Amount (NGN){" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="number"
                          placeholder="e.g. 3500000"
                          {...register("customAmount", {
                            required:
                              watchPackageId === "custom"
                                ? "Field required"
                                : false,
                          })}
                          className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary font-semibold"
                        />
                        {errors.customAmount && (
                          <p className="text-[10px] text-red-500 font-semibold">
                            {errors.customAmount.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-extrabold text-sm text-foreground uppercase tracking-wider pb-2 border-b border-border/50">
                    2. Repayment Settings
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground  block">
                        Down Payment Percentage
                      </label>
                      <Select
                        value={watchDownPaymentPercent}
                        onValueChange={(val) =>
                          setValue("downPaymentPercent", val)
                        }
                      >
                        <SelectTrigger className="bg-muted/30 border-border rounded-xl text-xs h-10 font-semibold focus:ring-primary">
                          <SelectValue placeholder="Select percentage" />
                        </SelectTrigger>
                        <SelectContent className="bg-card text-card-foreground border-border rounded-xl">
                          <SelectItem
                            value="20"
                            className="text-xs font-semibold"
                          >
                            20% Down Payment (Minimum)
                          </SelectItem>
                          <SelectItem
                            value="30"
                            className="text-xs font-semibold"
                          >
                            30% Down Payment
                          </SelectItem>
                          <SelectItem
                            value="40"
                            className="text-xs font-semibold"
                          >
                            40% Down Payment
                          </SelectItem>
                          <SelectItem
                            value="50"
                            className="text-xs font-semibold"
                          >
                            50% Down Payment
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground  block">
                        Repayment Duration
                      </label>
                      <Select
                        value={watchRepaymentMonths}
                        onValueChange={(val) =>
                          setValue("repaymentMonths", val)
                        }
                      >
                        <SelectTrigger className="bg-muted/30 border-border rounded-xl text-xs h-10 font-semibold focus:ring-primary">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent className="bg-card text-card-foreground border-border rounded-xl">
                          <SelectItem
                            value="3"
                            className="text-xs font-semibold"
                          >
                            3 Months Repayment
                          </SelectItem>
                          <SelectItem
                            value="6"
                            className="text-xs font-semibold"
                          >
                            6 Months Repayment
                          </SelectItem>
                          <SelectItem
                            value="12"
                            className="text-xs font-semibold"
                          >
                            12 Months Repayment
                          </SelectItem>
                          <SelectItem
                            value="24"
                            className="text-xs font-semibold"
                          >
                            24 Months Repayment
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-extrabold text-sm text-foreground uppercase tracking-wider pb-2 border-b border-border/50">
                    3. Personal & Financial Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground  block">
                        Employment Status
                      </label>
                      <Select
                        defaultValue="Employed"
                        onValueChange={(val) =>
                          setValue("employmentStatus", val)
                        }
                      >
                        <SelectTrigger className="bg-muted/30 border-border rounded-xl text-xs h-10 font-semibold focus:ring-primary">
                          <SelectValue placeholder="Employment status" />
                        </SelectTrigger>
                        <SelectContent className="bg-card text-card-foreground border-border rounded-xl">
                          <SelectItem
                            value="Employed"
                            className="text-xs font-semibold"
                          >
                            Employed
                          </SelectItem>
                          <SelectItem
                            value="Self-Employed"
                            className="text-xs font-semibold"
                          >
                            Self-Employed
                          </SelectItem>
                          <SelectItem
                            value="Business Owner"
                            className="text-xs font-semibold"
                          >
                            Business Owner
                          </SelectItem>
                          <SelectItem
                            value="Other"
                            className="text-xs font-semibold"
                          >
                            Other
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground  block">
                        Monthly Income (NGN){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="number"
                        placeholder="e.g. 500000"
                        {...register("monthlyIncome", {
                          required: "Monthly income is required",
                        })}
                        className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary font-semibold"
                      />
                      {errors.monthlyIncome && (
                        <p className="text-[10px] text-red-500 font-semibold">
                          {errors.monthlyIncome.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground  block">
                        Employer / Company Name
                      </label>
                      <Input
                        placeholder="e.g. Shell Nigeria"
                        {...register("employerName")}
                        className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary font-semibold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground  block">
                        Contact Phone Number{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="e.g. +234 803 111 2222"
                        {...register("phoneNumber", {
                          required: "Phone number is required",
                        })}
                        className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary font-semibold"
                      />
                      {errors.phoneNumber && (
                        <p className="text-[10px] text-red-500 font-semibold">
                          {errors.phoneNumber.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground  block">
                      Residential or Office Address{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="e.g. 15 Eneka Road, Port Harcourt"
                      {...register("address", {
                        required: "Address is required",
                      })}
                      className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary font-semibold"
                    />
                    {errors.address && (
                      <p className="text-[10px] text-red-500 font-semibold">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={
                    createFinancingMutation.isPending || totalAmount <= 0
                  }
                  className="w-full bg-[#08AA08] hover:bg-[#079907] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl h-11 shadow-sm mt-4 cursor-pointer"
                >
                  {createFinancingMutation.isPending
                    ? "Submitting..."
                    : "Submit Financing Request"}
                </Button>
              </CardContent>
            </Card>
          </form>

          {/* Calculator Card */}
          <div className="lg:col-span-5 space-y-6 sticky top-28">
            <Card className="border border-border/80 rounded-2xl shadow-xs bg-white dark:bg-zinc-900 font-semibold">
              <CardContent className="p-6 space-y-6">
                <div className="pb-4 border-b border-border/60 flex items-center gap-2">
                  <Calculator className="h-4.5 w-4.5 text-[#08AA08]" />
                  <h3 className="font-extrabold text-sm text-foreground uppercase tracking-tight">
                    Payment Plan Calculator
                  </h3>
                </div>

                <div className="space-y-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  <div className="flex justify-between items-center">
                    <span>Selected System</span>
                    <span className="text-zinc-900 dark:text-white font-bold max-w-[200px] truncate">
                      {systemSize}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm font-extrabold">
                    <span className="text-zinc-900 dark:text-white font-black">
                      Total Cost
                    </span>
                    <span className="text-zinc-900 dark:text-white font-black">
                      {formatCurrency(totalAmount, "NGN")}
                    </span>
                  </div>

                  <div className="border-t border-border/40 my-3" />

                  <div className="flex justify-between items-center">
                    <span>Down Payment ({watchDownPaymentPercent}%)</span>
                    <span className="text-[#08AA08] font-bold">
                      {formatCurrency(downPaymentAmount, "NGN")}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Remaining Balance</span>
                    <span className="text-zinc-950 dark:text-zinc-50">
                      {formatCurrency(remainingBalance, "NGN")}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-zinc-400">
                    <span>Flat Interest Rate</span>
                    <span>5.0% flat</span>
                  </div>

                  <div className="border-t border-border/40 my-3" />

                  <div className="bg-[#08AA08]/5 border border-[#08AA08]/20 p-4 rounded-xl space-y-1 text-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-505 block">
                      Estimated Monthly Payment
                    </span>
                    <span className="text-xl font-extrabold text-[#08AA08] tracking-tight block">
                      {formatCurrency(monthlyPayment, "NGN")}
                    </span>
                    <span className="text-[9px] font-semibold text-zinc-400 block uppercase tracking-wide">
                      For {watchRepaymentMonths} Months
                    </span>
                  </div>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-xl flex gap-3 items-start text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-semibold">
                  <ShieldCheck className="h-4.5 w-4.5 text-[#08AA08] shrink-0 mt-0.5" />
                  <p>
                    All plans are subject to review by GoSolar. Once approved,
                    the payment schedule will activate and be visible under your
                    Account panel.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="sm:max-w-[480px] bg-card text-card-foreground border-border rounded-2xl  text-center py-6 space-y-4">
          <div className="h-14 w-14 bg-[#08AA08]/10 text-[#08AA08] rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-extrabold text-foreground tracking-tight">
              Application Submitted!
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
              Your solar financing application has been successfully received.
              Our support team will review your application parameters and
              update your dashboard within 24-48 hours.
            </p>
          </div>
          <Button
            onClick={() => {
              setIsSuccessOpen(false);
              router.push("/account/financing");
            }}
            className="bg-[#08AA08] hover:bg-[#079907] text-white font-semibold text-xs h-9 px-6 rounded-xl cursor-pointer"
          >
            View Plans
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
