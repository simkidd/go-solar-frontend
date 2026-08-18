"use client";
import React, { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { Banner } from "@/interfaces/banner.interface";
import { useUpdateBannerMutation } from "@/hooks/mutations/useBannerMutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDropzone } from "react-dropzone";
import { ImageIcon, LayoutTemplate, Link2, UploadCloud, X } from "lucide-react";
import Image from "next/image";

interface UpdateBannerFormValues {
  title: string;
  subtitle?: string;
  badge?: string;
  ctaText?: string;
  ctaLink?: string;
  order?: number;
  isActive?: boolean;
  placement: "storefront_hero" | "storefront_promo_strip" | "storefront_promo_card";
}

const UpdateBannerForm: React.FC<{
  banner: Banner;
  onClose: () => void;
}> = ({ banner, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(banner.image || null);

  const {
    register,
    control,
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
      placement: banner.placement || "storefront_hero",
    },
  });

  const updateBannerMutation = useUpdateBannerMutation({
    onSuccess: () => {
      onClose();
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles[0]) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
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
    formData.append("placement", values.placement);

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
    <form onSubmit={handleSubmit(onSubmit)} className="w-full font-inter space-y-6">
      {/* Banner Content Card */}
      <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
        <div className="border-b border-border/60 pb-3 select-none">
          <h3 className="text-sm font-extrabold text-foreground tracking-tight flex items-center gap-1.5">
            <LayoutTemplate className="h-4 w-4 text-primary" /> Banner Content
          </h3>
          <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
            Core headline and descriptive titles shown in storefront hero carousel
          </p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
            Headline / Title <span className="text-red-500">*</span>
          </label>
          <Input
            id="title"
            placeholder="e.g. Empower Your Home With Solar"
            {...register("title", { required: "Banner title is required" })}
            className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary font-semibold"
          />
          {errors.title && (
            <p className="text-xs text-red-500 font-semibold mt-0.5">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="subtitle" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
            Subtitle copy <span className="text-[10px] font-normal text-muted-foreground normal-case">(Optional)</span>
          </label>
          <Textarea
            id="subtitle"
            placeholder="Short promotional copy shown below the headline"
            rows={2}
            {...register("subtitle")}
            className="bg-muted/30 border-border rounded-xl text-xs focus-visible:ring-primary min-h-[70px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="badge" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
            Pill Badge Text <span className="text-[10px] font-normal text-muted-foreground normal-case">(Optional)</span>
          </label>
          <Input
            id="badge"
            placeholder="e.g. Limited Time Offer"
            {...register("badge")}
            className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary font-semibold"
          />
        </div>
      </div>

      {/* CTA & Settings Card */}
      <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
        <div className="border-b border-border/60 pb-3 select-none">
          <h3 className="text-sm font-extrabold text-foreground tracking-tight flex items-center gap-1.5">
            <Link2 className="h-4 w-4 text-primary" /> Call-to-Action &amp; Settings
          </h3>
          <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
            Configure banner priority sorting and checkout links
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="ctaText" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
              Button Label
            </label>
            <Input
              id="ctaText"
              placeholder="e.g. Shop Now"
              {...register("ctaText")}
              className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="ctaLink" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
              Destination URL
            </label>
            <Input
              id="ctaLink"
              placeholder="/shop"
              {...register("ctaLink")}
              className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary font-semibold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="order"
              className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block"
            >
              Priority Order <span className="text-[10px] font-normal text-muted-foreground normal-case">(0 = first)</span>
            </label>
            <Input
              id="order"
              type="number"
              placeholder="0"
              {...register("order", { valueAsNumber: true })}
              className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary font-semibold w-full"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
              Placement Location <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name="placement"
              rules={{ required: "Placement location is required" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-muted/30 border-border rounded-xl text-xs h-10 focus:ring-primary font-semibold">
                    <SelectValue placeholder="Select placement location" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl bg-card border border-border/80">
                    <SelectItem value="storefront_hero" className="cursor-pointer text-xs font-semibold">
                      Storefront Hero Slider (Top Carousel)
                    </SelectItem>
                    <SelectItem value="storefront_promo_strip" className="cursor-pointer text-xs font-semibold">
                      Promotional Grid Strip (Middle)
                    </SelectItem>
                    <SelectItem value="storefront_promo_card" className="cursor-pointer text-xs font-semibold">
                      Featured Promo Card (Highlights)
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/60 select-none">
          <div className="space-y-0.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
              Active Status
            </label>
            <p className="text-[10px] text-muted-foreground font-semibold">
              Enable or disable this banner slide on the storefront
            </p>
          </div>
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>
      </div>

      {/* Banner Image Card */}
      <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
        <div className="border-b border-border/60 pb-3 select-none">
          <h3 className="text-sm font-extrabold text-foreground tracking-tight flex items-center gap-1.5">
            <ImageIcon className="h-4 w-4 text-primary" /> Banner Background Image
          </h3>
          <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
            Upload a new promotion cover image or retain the existing one
          </p>
        </div>

        {previewUrl && !selectedFile ? (
          <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden border border-border bg-zinc-950">
            <Image src={previewUrl} alt="Banner preview" fill className="object-cover" />
            <button
              type="button"
              onClick={removeSelectedFile}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : previewUrl && selectedFile ? (
          <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden border border-border bg-zinc-950">
            <Image src={previewUrl} alt="Banner preview" fill className="object-cover" />
            <button
              type="button"
              onClick={removeSelectedFile}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={`flex flex-col items-center justify-center w-full aspect-[21/9] rounded-2xl border-2 border-dashed transition-all p-6 text-center select-none cursor-pointer ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/60 bg-muted/20 hover:bg-muted/30"
            }`}
          >
            <input {...getInputProps()} />
            <UploadCloud
              className={`h-8 w-8 mb-2 transition-colors ${
                isDragActive ? "text-primary" : "text-muted-foreground/60"
              }`}
            />
            <span className="text-xs font-bold text-foreground">
              {isDragActive
                ? "Drop the file here..."
                : "Drag & drop or click to upload banner background"}
            </span>
            <span className="text-[10px] text-muted-foreground/80 font-medium mt-1">
              Recommended ratio: 21:9 (1920×800px) PNG, JPG, or WebP
            </span>
          </div>
        )}
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border/60 select-none">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="text-xs font-semibold rounded-xl h-10 px-5 cursor-pointer text-muted-foreground hover:text-foreground"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={updateBannerMutation.isPending}
          className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-10 px-6 rounded-xl shadow-xs cursor-pointer gap-1.5"
        >
          {updateBannerMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default UpdateBannerForm;
