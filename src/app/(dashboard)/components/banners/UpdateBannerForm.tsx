"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Banner } from "@/interfaces/banner.interface";
import { useUpdateBannerMutation } from "@/hooks/mutations/useBannerMutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud } from "lucide-react";
import Image from "next/image";

interface UpdateBannerFormValues {
  title: string;
  subtitle?: string;
  badge?: string;
  ctaText?: string;
  ctaLink?: string;
  order?: number;
  isActive?: boolean;
}

const UpdateBannerForm: React.FC<{
  banner: Banner;
  onClose: () => void;
}> = ({ banner, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(banner.image || null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateBannerFormValues>({
    defaultValues: {
      title: banner.title,
      subtitle: banner.subtitle || "",
      badge: banner.badge || "Special Highlight",
      ctaText: banner.ctaText || "Explore Now",
      ctaLink: banner.ctaLink || "/shop",
      order: banner.order || 0,
      isActive: banner.isActive ?? true,
    },
  });

  const updateBannerMutation = useUpdateBannerMutation({
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

  const onSubmit = (values: UpdateBannerFormValues) => {
    const formData = new FormData();
    formData.append("title", values.title);
    if (values.subtitle !== undefined) formData.append("subtitle", values.subtitle);
    if (values.badge !== undefined) formData.append("badge", values.badge);
    if (values.ctaText !== undefined) formData.append("ctaText", values.ctaText);
    if (values.ctaLink !== undefined) formData.append("ctaLink", values.ctaLink);
    formData.append("order", String(values.order || 0));
    formData.append("isActive", String(values.isActive ?? true));

    if (selectedFile) {
      formData.append("image", selectedFile);
    } else {
      formData.append("image", banner.image);
    }

    updateBannerMutation.mutate({
      bannerId: banner._id,
      formData,
    });
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
            {...register("ctaLink")}
            className="h-10 text-xs"
          />
        </div>
      </div>

      {/* Image Preview & Change */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold">Banner Image</label>
        {previewUrl && (
          <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-850 bg-zinc-950 mb-2">
            <Image
              src={previewUrl}
              alt="Banner preview"
              fill
              className="object-cover"
            />
          </div>
        )}
        <label className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-primary/60 cursor-pointer bg-zinc-50 dark:bg-zinc-900/40 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors">
          <UploadCloud className="h-4 w-4 text-zinc-400" />
          <span>Upload New Image (Optional)</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
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
          disabled={updateBannerMutation.isPending}
          className="bg-primary hover:bg-primary/95 text-white font-bold text-xs h-10 px-6"
        >
          {updateBannerMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default UpdateBannerForm;
