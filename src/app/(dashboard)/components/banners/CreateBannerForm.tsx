"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateBannerMutation } from "@/hooks/mutations/useBannerMutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface CreateBannerFormValues {
  title: string;
  subtitle?: string;
  badge?: string;
  ctaText?: string;
  ctaLink?: string;
  order?: number;
  isActive?: boolean;
}

const CreateBannerForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBannerFormValues>({
    defaultValues: {
      badge: "Special Highlight",
      ctaText: "Explore Now",
      ctaLink: "/shop",
      order: 0,
      isActive: true,
    },
  });

  const createBannerMutation = useCreateBannerMutation({
    onSuccess: () => {
      onClose();
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const onSubmit = (values: CreateBannerFormValues) => {
    if (!selectedFile) {
      toast.error("Please upload a banner image");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);
    if (values.subtitle) formData.append("subtitle", values.subtitle);
    if (values.badge) formData.append("badge", values.badge);
    if (values.ctaText) formData.append("ctaText", values.ctaText);
    if (values.ctaLink) formData.append("ctaLink", values.ctaLink);
    formData.append("order", String(values.order || 0));
    formData.append("isActive", String(values.isActive ?? true));
    formData.append("image", selectedFile);

    createBannerMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-inter">
      {/* Banner Title */}
      <div className="space-y-1.5">
        <label htmlFor="title" className="text-xs font-semibold">
          Banner Headline / Title <span className="text-red-500">*</span>
        </label>
        <Input
          id="title"
          placeholder="e.g. Empower Your Home With Hybrid Solar Uptime"
          {...register("title", { required: "Banner title is required" })}
          className="h-10 text-xs"
        />
        {errors.title && (
          <p className="text-[11px] text-red-500 font-medium">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Subtitle / Description */}
      <div className="space-y-1.5">
        <label htmlFor="subtitle" className="text-xs font-semibold">
          Subtitle / Promotional Copy
        </label>
        <Textarea
          id="subtitle"
          placeholder="e.g. Get customized hybrid inverter setups and LiFePO4 batteries with 5-year hardware warranties."
          rows={2}
          {...register("subtitle")}
          className="text-xs resize-none"
        />
      </div>

      {/* Grid: Badge & Order */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label htmlFor="badge" className="text-xs font-semibold">
            Pill Badge Text
          </label>
          <Input
            id="badge"
            placeholder="e.g. Limited Time Offer"
            {...register("badge")}
            className="h-10 text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="order" className="text-xs font-semibold">
            Priority Order (0 = First)
          </label>
          <Input
            id="order"
            type="number"
            placeholder="0"
            {...register("order", { valueAsNumber: true })}
            className="h-10 text-xs"
          />
        </div>
      </div>

      {/* Grid: CTA Text & CTA Link */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label htmlFor="ctaText" className="text-xs font-semibold">
            Button Label
          </label>
          <Input
            id="ctaText"
            placeholder="e.g. Configure Package"
            {...register("ctaText")}
            className="h-10 text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="ctaLink" className="text-xs font-semibold">
            Destination URL
          </label>
          <Input
            id="ctaLink"
            placeholder="e.g. /energy-calculator or /shop"
            {...register("ctaLink")}
            className="h-10 text-xs"
          />
        </div>
      </div>

      {/* Image Upload Box */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold">
          Banner Image <span className="text-red-500">*</span>
        </label>
        {previewUrl ? (
          <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-950 group">
            <Image
              src={previewUrl}
              alt="Banner preview"
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={removeSelectedFile}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full aspect-[21/9] rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-primary/60 cursor-pointer bg-zinc-50 dark:bg-zinc-900/40 transition-colors p-4">
            <UploadCloud className="h-8 w-8 text-zinc-400 mb-2" />
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Click to upload banner background
            </span>
            <span className="text-[10px] text-zinc-400 mt-1">
              Recommended ratio: 21:9 or 1920x800px (PNG, JPG, WebP)
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-150 dark:border-zinc-800">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="text-xs h-10 px-4"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={createBannerMutation.isPending}
          className="bg-primary hover:bg-primary/95 text-white font-bold text-xs h-10 px-6"
        >
          {createBannerMutation.isPending ? "Creating..." : "Publish Banner"}
        </Button>
      </div>
    </form>
  );
};

export default CreateBannerForm;
