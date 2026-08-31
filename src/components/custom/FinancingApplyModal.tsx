"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import { useCreateFinancingRequest } from "@/hooks/mutations/useFinancingMutations";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShieldCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
  UploadCloud,
  ChevronRight,
  ChevronLeft,
  X,
  User,
  Briefcase,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePackagesQuery } from "@/hooks/queries/usePackagesQuery";
import { formatCurrency } from "@/utils/helpers";
import Link from "next/link";

interface FinancingFormValues {
  packageId: string;
  requestType: "individual" | "corporate" | "";
  email: string;
  phoneNumber: string;
  nin: string;
  // Names
  firstName: string;
  lastName: string;
  // Individual fields
  officeAddress: string;
  jobRole: string;
  // Corporate fields
  businessAddress: string;
  natureOfBusiness: string;
  yearsInBusiness: string;
  // Files
  passportPhoto: FileList;
  cacDocument: FileList;
}

export default function FinancingApplyModal(props?: {
  open?: boolean;
  onClose?: () => void;
  initialProfileType?: "individual" | "corporate" | "";
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useSession();

  // Controlled mode (open/onClose props) takes priority over URL params
  const isControlled = props?.open !== undefined;
  const isOpen = isControlled
    ? !!props!.open
    : searchParams.get("apply-financing") === "true";

  const { data: packages = [], isLoading: packagesLoading } =
    usePackagesQuery();
  const packageIdParam = searchParams.get("packageId") || "";

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
      requestType: props?.initialProfileType || "individual",
      email: "",
      phoneNumber: "",
      nin: "",
      firstName: "",
      lastName: "",
      officeAddress: "",
      jobRole: "",
      businessAddress: "",
      natureOfBusiness: "",
      yearsInBusiness: "",
    },
  });

  const [successOpen, setSuccessOpen] = useState(false);

  const createFinancingMutation = useCreateFinancingRequest({
    onSuccess: () => {
      handleClose();
      setSuccessOpen(true);
    },
  });

  const watchRequestType = watch("requestType");
  const watchPackageId = watch("packageId");

  // Document File Watchers for dynamic label names
  const watchPassport = watch("passportPhoto");
  const watchCac = watch("cacDocument");

  useEffect(() => {
    if (!isOpen) {
      reset({
        packageId: packageIdParam,
        requestType: props?.initialProfileType || "individual",
        email: "",
        phoneNumber: "",
        nin: "",
        firstName: user?.firstname || "",
        lastName: user?.lastname || "",
        officeAddress: "",
        jobRole: "",
        businessAddress: "",
        natureOfBusiness: "",
        yearsInBusiness: "",
      });
    } else {
      setValue("packageId", packageIdParam);
      if (props?.initialProfileType) {
        setValue("requestType", props.initialProfileType);
      }
      if (user) {
        setValue("firstName", user.firstname || "");
        setValue("lastName", user.lastname || "");
        setValue("email", user.email || "");
      }
    }
  }, [isOpen, reset, packageIdParam, setValue, user, props?.initialProfileType]);

  const handleClose = () => {
    if (isControlled) {
      props!.onClose?.();
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.delete("apply-financing");
    params.delete("packageId");
    router.push(`${pathname}?${params.toString()}`);
  };

  const getFileName = (fileList: FileList | undefined) => {
    if (fileList && fileList.length > 0) {
      return fileList[0].name;
    }
    return null;
  };

  const onSubmit = (values: FinancingFormValues) => {
    const formData = new FormData();
    formData.append("packageId", values.packageId);
    formData.append("requestType", values.requestType);
    formData.append("email", values.email);
    formData.append("phoneNumber", values.phoneNumber);
    formData.append("nin", values.nin);
    formData.append("provisionOfCheque", "true");
    formData.append("directDebitSetup", "true");

    if (values.requestType === "individual") {
      formData.append("firstName", values.firstName || "");
      formData.append("lastName", values.lastName || "");
      formData.append("officeAddress", values.officeAddress || "");
      formData.append("jobRole", values.jobRole || "");

      // Files
      if (values.passportPhoto?.[0]) {
        formData.append("passportPhoto", values.passportPhoto[0]);
      }
    } else {
      formData.append("businessAddress", values.businessAddress || "");
      formData.append("natureOfBusiness", values.natureOfBusiness || "");
      formData.append("yearsInBusiness", values.yearsInBusiness || "");

      // Files
      if (values.passportPhoto?.[0]) {
        formData.append("passportPhoto", values.passportPhoto[0]);
      }
      if (values.cacDocument?.[0]) {
        formData.append("cacDocument", values.cacDocument[0]);
      }
    }

    createFinancingMutation.mutate(formData);
  };

  if (!isOpen && !successOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-card text-card-foreground border border-border/85 rounded-2xl p-0 font-inter overflow-hidden flex flex-col shadow-2xl sm:max-w-[620px] max-h-[85vh]">
          {/* Header */}
          <div className="p-6 border-b border-border/60 flex items-center justify-between bg-card shrink-0">
            <div className="space-y-1">
              <DialogTitle className="text-base font-black text-foreground tracking-tight flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#08AA08] animate-pulse" />
                Apply for Solar Financing
              </DialogTitle>
              <DialogDescription className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">
                Submit Required Application Documents ({watchRequestType === "corporate" ? "Corporate" : "Individual"})
              </DialogDescription>
            </div>
          </div>

          <ScrollArea className="flex-1 overflow-y-auto">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="px-6 pb-6 pt-4 space-y-5"
            >
              {/* Selected Package Display */}
              {watchPackageId && (
                <div className="p-4 bg-gradient-to-r from-[#08AA08]/5 to-transparent border border-[#08AA08]/10 dark:border-[#08AA08]/20 rounded-2xl text-left flex justify-between items-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-16 w-16 bg-[#08AA08]/5 rounded-bl-full pointer-events-none" />
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-[#08AA08] uppercase tracking-widest block font-black">
                      Selected Package
                    </span>
                    <span className="text-xs font-black text-foreground block">
                      {(() => {
                        const selected = packages.find(
                          (p: any) => p._id === watchPackageId,
                        );
                        return selected
                          ? `${selected.name} (${formatCurrency(selected.price, "NGN")})`
                          : "Selected Package";
                      })()}
                    </span>
                  </div>
                </div>
              )}

              {/* Package Dropdown Selection */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">
                  Select Solar Package <span className="text-red-500">*</span>
                </label>
                <Select
                  disabled={!!packageIdParam || packagesLoading}
                  value={watchPackageId}
                  onValueChange={(val) => setValue("packageId", val)}
                >
                  <SelectTrigger className="bg-muted/10 hover:bg-muted/20 border-border rounded-xl text-xs h-11 font-semibold focus:ring-2 focus:ring-[#08AA08]/20 transition-all cursor-pointer">
                    <SelectValue
                      placeholder={
                        packagesLoading
                          ? "Loading packages..."
                          : "Choose a solar package"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-card text-card-foreground border-border rounded-xl">
                    {packages.map((pkg: any) => (
                      <SelectItem
                        key={pkg._id}
                        value={pkg._id}
                        className="text-xs font-semibold hover:bg-muted/50 focus:bg-muted/50 rounded-lg cursor-pointer"
                      >
                        {pkg.name} ({formatCurrency(pkg.price, "NGN")})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!watchPackageId && (
                  <p className="text-[9px] text-amber-500 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    Please select a package to submit your request.
                  </p>
                )}
              </div>

              {/* Email Address field */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-455 block">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="e.g. john@example.com"
                  {...register("email", {
                    required: "Required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="bg-muted/10 border-border rounded-xl text-xs h-11 font-semibold focus-visible:ring-2 focus-visible:ring-[#08AA08]/20 focus-visible:border-[#08AA08] transition-all"
                />
                {errors.email && (
                  <p className="text-[10px] text-red-500 font-semibold mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

                  {/* Shared text inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-455 block">
                        Contact Phone Number{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="e.g. +234 803 111 2222"
                        {...register("phoneNumber", { required: "Required" })}
                        className="bg-muted/10 border-border rounded-xl text-xs h-11 font-semibold focus-visible:ring-2 focus-visible:ring-[#08AA08]/20 focus-visible:border-[#08AA08] transition-all"
                      />
                      {errors.phoneNumber && (
                        <p className="text-[10px] text-red-500 font-semibold mt-1">
                          {errors.phoneNumber.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-455 block">
                        NIN Number (11 Digits){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="e.g. 12345678901"
                        maxLength={11}
                        {...register("nin", {
                          required: "Required",
                          minLength: {
                            value: 11,
                            message: "Must be 11 digits",
                          },
                        })}
                        className="bg-muted/10 border-border rounded-xl text-xs h-11 font-semibold focus-visible:ring-2 focus-visible:ring-[#08AA08]/20 focus-visible:border-[#08AA08] transition-all"
                      />
                      {errors.nin && (
                        <p className="text-[10px] text-red-500 font-semibold mt-1">
                          {errors.nin.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Individual Conditional Fields */}
                  {watchRequestType === "individual" && (
                    <div className="space-y-4">
                      {/* First & Last Name */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5 text-left">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-455 block">
                            First Name <span className="text-red-500">*</span>
                          </label>
                          <Input
                            placeholder="e.g. John"
                            {...register("firstName", { required: "Required" })}
                            className="bg-muted/10 border-border rounded-xl text-xs h-11 font-semibold focus-visible:ring-2 focus-visible:ring-[#08AA08]/20 focus-visible:border-[#08AA08] transition-all"
                          />
                          {errors.firstName && (
                            <p className="text-[10px] text-red-500 font-semibold mt-1">
                              {errors.firstName.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1.5 text-left">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-455 block">
                            Last Name <span className="text-red-500">*</span>
                          </label>
                          <Input
                            placeholder="e.g. Doe"
                            {...register("lastName", { required: "Required" })}
                            className="bg-muted/10 border-border rounded-xl text-xs h-11 font-semibold focus-visible:ring-2 focus-visible:ring-[#08AA08]/20 focus-visible:border-[#08AA08] transition-all"
                          />
                          {errors.lastName && (
                            <p className="text-[10px] text-red-500 font-semibold mt-1">
                              {errors.lastName.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5 text-left">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-455 block">
                            Office Address{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <Input
                            placeholder="e.g. 12 Trans-Amadi, Port Harcourt"
                            {...register("officeAddress", {
                              required: "Required",
                            })}
                            className="bg-muted/10 border-border rounded-xl text-xs h-11 font-semibold focus-visible:ring-2 focus-visible:ring-[#08AA08]/20 focus-visible:border-[#08AA08] transition-all"
                          />
                          {errors.officeAddress && (
                            <p className="text-[10px] text-red-500 font-semibold mt-1">
                              {errors.officeAddress.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1.5 text-left">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-455 block">
                            Job Role <span className="text-red-500">*</span>
                          </label>
                          <Input
                            placeholder="e.g. Lead Engineer"
                            {...register("jobRole", { required: "Required" })}
                            className="bg-muted/10 border-border rounded-xl text-xs h-11 font-semibold focus-visible:ring-2 focus-visible:ring-[#08AA08]/20 focus-visible:border-[#08AA08] transition-all"
                          />
                          {errors.jobRole && (
                            <p className="text-[10px] text-red-500 font-semibold mt-1">
                              {errors.jobRole.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Documents uploads */}
                      <div className="space-y-3.5 pt-4 border-t border-border/40">
                        <h5 className="font-extrabold text-[9px] text-[#08AA08] uppercase tracking-wider block text-left">
                          Required Documents (Images Only)
                        </h5>
                        <div className="grid grid-cols-1 gap-4">
                          {/* Passport Photo */}
                          <div className="space-y-1.5 text-left">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">
                              Passport Photograph{" "}
                              <span className="text-red-500">*</span>
                            </span>
                            <div className="relative group cursor-pointer border-2 border-dashed border-border/85 hover:border-[#08AA08]/60 rounded-2xl p-6 bg-muted/5 hover:bg-muted/15 flex flex-col items-center justify-center text-center transition-all duration-300">
                              <input
                                type="file"
                                accept="image/*"
                                {...register("passportPhoto", {
                                  required: "Required",
                                })}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                              />
                              <div className="h-10 w-10 bg-[#08AA08]/10 text-[#08AA08] rounded-full flex items-center justify-center mb-2 transition-transform duration-350 group-hover:scale-110">
                                <UploadCloud className="h-5 w-5 shrink-0" />
                              </div>
                              <span className="text-[10px] font-bold text-zinc-650 truncate max-w-[220px]">
                                {getFileName(watchPassport) ||
                                  "Upload passport photograph"}
                              </span>
                              <span className="text-[8px] text-zinc-400 font-semibold mt-0.5">
                                PNG, JPG or WEBP (Max 5MB)
                              </span>
                            </div>
                            {errors.passportPhoto && (
                              <p className="text-[9px] text-red-500 font-bold mt-1">
                                {errors.passportPhoto.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Corporate Conditional Fields */}
                  {watchRequestType === "corporate" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5 text-left">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-455 block">
                            Business Address{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <Input
                            placeholder="e.g. 5 Marina, Lagos Island, Lagos"
                            {...register("businessAddress", {
                              required: "Required",
                            })}
                            className="bg-muted/10 border-border rounded-xl text-xs h-11 font-semibold focus-visible:ring-2 focus-visible:ring-[#08AA08]/20 focus-visible:border-[#08AA08] transition-all"
                          />
                          {errors.businessAddress && (
                            <p className="text-[10px] text-red-550 font-semibold mt-1">
                              {errors.businessAddress.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1.5 text-left">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-455 block">
                            Nature of Business{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <Input
                            placeholder="e.g. Logistics & Supply Chain"
                            {...register("natureOfBusiness", {
                              required: "Required",
                            })}
                            className="bg-muted/10 border-border rounded-xl text-xs h-11 font-semibold focus-visible:ring-2 focus-visible:ring-[#08AA08]/20 focus-visible:border-[#08AA08] transition-all"
                          />
                          {errors.natureOfBusiness && (
                            <p className="text-[10px] text-red-500 font-semibold mt-1">
                              {errors.natureOfBusiness.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-455 block">
                          Years in Business{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="number"
                          placeholder="e.g. 5"
                          {...register("yearsInBusiness", {
                            required: "Required",
                          })}
                          className="bg-muted/10 border-border rounded-xl text-xs h-11 font-semibold focus-visible:ring-2 focus-visible:ring-[#08AA08]/20 focus-visible:border-[#08AA08] transition-all"
                        />
                        {errors.yearsInBusiness && (
                          <p className="text-[10px] text-red-500 font-semibold mt-1">
                            {errors.yearsInBusiness.message}
                          </p>
                        )}
                      </div>

                      {/* Documents uploads */}
                      <div className="space-y-3.5 pt-4 border-t border-border/40">
                        <h5 className="font-extrabold text-[9px] text-[#08AA08] uppercase tracking-wider block text-left">
                          Required Documents (Images Only)
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Passport Photo */}
                          <div className="space-y-1.5 text-left">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">
                              Passport Photograph{" "}
                              <span className="text-red-500">*</span>
                            </span>
                            <div className="relative group cursor-pointer border-2 border-dashed border-border/85 hover:border-[#08AA08]/60 rounded-2xl p-5 bg-muted/5 hover:bg-muted/15 flex flex-col items-center justify-center text-center transition-all duration-300">
                              <input
                                type="file"
                                accept="image/*"
                                {...register("passportPhoto", {
                                  required: "Required",
                                })}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                              />
                              <div className="h-9 w-9 bg-[#08AA08]/10 text-[#08AA08] rounded-full flex items-center justify-center mb-2 transition-transform duration-350 group-hover:scale-110">
                                <UploadCloud className="h-4.5 w-4.5 shrink-0" />
                              </div>
                              <span className="text-[10px] font-bold text-zinc-650 truncate max-w-[220px]">
                                {getFileName(watchPassport) ||
                                  "Upload passport image"}
                              </span>
                              <span className="text-[8px] text-zinc-400 font-semibold mt-0.5">
                                PNG, JPG or WEBP (Max 5MB)
                              </span>
                            </div>
                            {errors.passportPhoto && (
                              <p className="text-[9px] text-red-500 font-bold mt-1">
                                {errors.passportPhoto.message}
                              </p>
                            )}
                          </div>

                          {/* CAC Copy */}
                          <div className="space-y-1.5 text-left">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">
                              Copy of CAC Certificate{" "}
                              <span className="text-red-500">*</span>
                            </span>
                            <div className="relative group cursor-pointer border-2 border-dashed border-border/85 hover:border-[#08AA08]/60 rounded-2xl p-5 bg-muted/5 hover:bg-muted/15 flex flex-col items-center justify-center text-center transition-all duration-300">
                              <input
                                type="file"
                                accept="image/*"
                                {...register("cacDocument", {
                                  required: "Required",
                                })}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                              />
                              <div className="h-9 w-9 bg-[#08AA08]/10 text-[#08AA08] rounded-full flex items-center justify-center mb-2 transition-transform duration-350 group-hover:scale-110">
                                <UploadCloud className="h-4.5 w-4.5 shrink-0" />
                              </div>
                              <span className="text-[10px] font-bold text-zinc-650 truncate max-w-[220px]">
                                {getFileName(watchCac) ||
                                  "Upload CAC certificate"}
                              </span>
                              <span className="text-[8px] text-zinc-400 font-semibold mt-0.5">
                                PNG, JPG or WEBP (Max 5MB)
                              </span>
                            </div>
                            {errors.cacDocument && (
                              <p className="text-[9px] text-red-500 font-bold mt-1">
                                {errors.cacDocument.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit navigation */}
                  <div className="pt-4 border-t border-border/40 text-right">
                    <Button
                      type="submit"
                      disabled={createFinancingMutation.isPending}
                      className="bg-gradient-to-r from-[#08AA08] to-[#079907] hover:brightness-105 active:scale-[0.98] text-[#ffffff] font-extrabold text-[10px] uppercase tracking-wider rounded-xl h-11 px-8 flex items-center gap-1.5 cursor-pointer shadow-md hover:shadow-lg transition-all ml-auto"
                    >
                      {createFinancingMutation.isPending ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                  </div>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Success Dialog — opens after form closes on successful submission */}
      <Dialog open={successOpen} onOpenChange={() => setSuccessOpen(false)}>
        <DialogContent className="sm:max-w-[420px] bg-card text-card-foreground border border-border rounded-2xl p-0 font-inter overflow-hidden shadow-2xl">
          <div className="p-8 text-center  space-y-6">
            <div className="h-16 w-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-base font-black text-foreground tracking-tight">
                Application Submitted!
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-semibold">
                Your request has been saved. A support representative will
                review your application and contact you offline shortly to
                finalize the contract.
              </DialogDescription>
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <Button
                onClick={() => {
                  setSuccessOpen(false);
                  router.push("/account/financing");
                }}
                className="bg-gradient-to-r from-[#08AA08] to-[#079907] text-white font-extrabold text-[10px] uppercase tracking-wider h-11 px-8 rounded-xl cursor-pointer shadow-md active:scale-95 transition-all"
              >
                View My Applications
              </Button>
              <Button
                variant="ghost"
                onClick={() => setSuccessOpen(false)}
                className="text-xs text-muted-foreground font-semibold cursor-pointer"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
