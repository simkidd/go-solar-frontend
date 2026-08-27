"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, CheckCircle2, ShoppingCart, DollarSign } from "lucide-react";
import Link from "next/link";
import { useCreateQuoteMutation } from "@/hooks/mutations/useQuoteMutations";
import { useForm } from "react-hook-form";
import useCartStore from "@/lib/stores/cart.store";

interface InquiryFormValues {
  fullName: string;
  email: string;
  phoneNumber: string;
  state: string;
  city: string;
  address: string;
  message: string;
}

const AddToCartBtn = ({ pkg }: { pkg: any }) => {
  const { addItem, cartItems } = useCartStore();
  const isInCart = cartItems.some((item) => item.product._id === pkg._id);
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleAddToCart = () => {
    const images = pkg.constituents
      ?.map((c: any) => c.product?.images?.[0])
      .filter(Boolean) || [];

    addItem({
      product: {
        _id: pkg._id,
        name: pkg.name,
        slug: pkg.slug,
        price: pkg.price,
        discountPrice: pkg.discountPrice,
        description: pkg.description,
        images: images.length > 0 ? images : [{ url: "/images/bg/hero-bg.jpg", public_id: "hero" }],
        quantityInStock: pkg.inStock ? 100 : 0,
        additionalInfo: pkg.highlights?.join(", ") || "",
        brand: "GoSolar System",
        datasheet: [],
        showDatasheet: false,
      } as any,
      qty: 1,
      deliveryFee: 0,
    });
  };

  const createQuoteMutation = useCreateQuoteMutation({
    showToast: false,
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      state: "Rivers",
      city: "Port Harcourt",
      address: "",
      message: "",
    },
  });

  const handleOpenDialog = () => {
    setSubmitted(false);
    reset();
    setIsOpen(true);
  };

  const onSubmit = (values: InquiryFormValues) => {
    const capacityKva = pkg.capacityKva || 5;
    const dailyKwh = Math.round(capacityKva * 4);
    const peakWatts = Math.round(capacityKva * 800);

    const recommendedInverter = `${capacityKva} kVA Hybrid Inverter`;
    const recommendedBattery = pkg.batteryKwh
      ? `${pkg.batteryKwh} kWh ${pkg.batteryType || "Lithium"} Battery`
      : `${capacityKva * 2} kWh Battery Storage`;
    const recommendedPv = pkg.pvKwp
      ? `${pkg.pvKwp} kWp Solar PV Panels`
      : "Solar PV Panels Array";

    const notes = `[Package Inquiry: ${pkg.name}] type: Free Onsite Assessment. Additional Message: ${values.message || "None."}`;

    createQuoteMutation.mutate({
      fullName: values.fullName,
      email: values.email,
      phoneNumber: values.phoneNumber,
      state: values.state,
      city: values.city,
      address: values.address,
      dailyKwh,
      peakWatts,
      recommendedInverter,
      recommendedBattery,
      recommendedPv,
      notes,
    });
  };

  return (
    <div className="space-y-3 pt-2">
      {/* Main Call to Action: Add Setup to Cart */}
      <Button
        onClick={handleAddToCart}
        disabled={isInCart}
        className="w-full bg-[#08AA08] hover:bg-[#079907] disabled:bg-zinc-100 disabled:text-zinc-400 dark:disabled:bg-zinc-900/50 dark:disabled:text-zinc-650 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl h-11 shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
      >
        {isInCart ? (
          <>
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
            Setup in Cart
          </>
        ) : (
          <>
            <ShoppingCart className="h-4.5 w-4.5" />
            Add Setup to Cart
          </>
        )}
      </Button>

      {/* Secondary Button: Book Free Assessment */}
      <Button
        onClick={handleOpenDialog}
        variant="outline"
        className="w-full border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold rounded-xl h-11 text-xs cursor-pointer flex items-center justify-center gap-1.5"
      >
        <CalendarDays className="h-4 w-4 text-zinc-550" />
        Book Free Assessment
      </Button>

      {/* Financing Button */}
      <Link href={`?apply-financing=true&packageId=${pkg._id}`} className="block w-full">
        <Button
          variant="outline"
          className="w-full border-primary/30 hover:bg-primary/5 text-primary font-extrabold rounded-xl h-11 text-xs cursor-pointer flex items-center justify-center gap-1.5"
        >
          <DollarSign className="h-4 w-4" />
          Apply for Financing
        </Button>
      </Link>

      {/* Inquiry Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[480px] bg-card text-card-foreground border-border rounded-2xl">
          {submitted ? (
            <div className="text-center py-6 space-y-4 select-none">
              <div className="h-14 w-14 bg-[#08AA08]/10 text-[#08AA08] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-extrabold text-foreground tracking-tight">
                  Request Submitted!
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  Thank you for your interest in the <b>{pkg.name}</b> setup. Our clean energy support team has recorded your details and will call you back shortly.
                </p>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                className="bg-[#08AA08] hover:bg-[#079907] text-white font-semibold text-xs h-9 px-6 rounded-xl cursor-pointer"
              >
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-inter text-left">
              <DialogHeader className="space-y-1.5 pb-2 border-b border-border/60 select-none">
                <DialogTitle className="text-sm font-extrabold text-foreground tracking-tight uppercase">
                  Book Free Assessment
                </DialogTitle>
                <DialogDescription className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                  Configuring solar setup: {pkg.name}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3.5 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. Mrs. Blessing Alabi"
                    {...register("fullName", { required: "Name is required" })}
                    className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary font-semibold"
                  />
                  {errors.fullName && (
                    <p className="text-[10px] text-red-500 font-semibold">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="e.g. +234 803 111 2222"
                      {...register("phoneNumber", { required: "Phone number is required" })}
                      className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary font-semibold"
                    />
                    {errors.phoneNumber && (
                      <p className="text-[10px] text-red-500 font-semibold">{errors.phoneNumber.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      placeholder="name@email.com"
                      {...register("email", { required: "Email is required" })}
                      className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary font-semibold"
                    />
                    {errors.email && (
                      <p className="text-[10px] text-red-500 font-semibold">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                      State
                    </label>
                    <Input
                      {...register("state")}
                      className="bg-muted/30 border-border rounded-xl text-xs h-10 font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                      City
                    </label>
                    <Input
                      {...register("city")}
                      className="bg-muted/30 border-border rounded-xl text-xs h-10 font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                    Installation Address
                  </label>
                  <Input
                    placeholder="e.g. 15 Eneka Road, beside Airport plaza"
                    {...register("address")}
                    className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                    Special Requests / Message
                  </label>
                  <Textarea
                    placeholder="Optional: Mention your current appliances, load needs, or preferred installation date..."
                    rows={3}
                    {...register("message")}
                    className="bg-muted/30 border-border rounded-xl text-xs resize-none"
                  />
                </div>
              </div>

              <DialogFooter className="pt-4 border-t border-border/60 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-semibold rounded-xl h-10 px-5 cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createQuoteMutation.isPending}
                  className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-10 px-6 rounded-xl shadow-xs cursor-pointer"
                >
                  {createQuoteMutation.isPending ? "Submitting..." : "Submit Request"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddToCartBtn;
