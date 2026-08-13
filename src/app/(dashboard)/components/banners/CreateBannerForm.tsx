"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateBannerMutation } from "@/hooks/mutations/useBannerMutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageIcon, LayoutTemplate, Link2, UploadCloud, X } from "lucide-react";
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

  const createBannerMutation = useCreateBannerMutation({ onSuccess: () => onClose() });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }
  };

  const onSubmit = (values: CreateBannerFormValues) => {
    if (!selectedFile) { toast.error("Please upload a banner image"); return; }
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
    <form onSubmit={handleSubmit(onSubmit)} className="w-full font-inter flex flex-col gap-4">
      <ScrollArea className="flex-1 max-h-[70vh]">
        <div className="space-y-4 pr-4 pt-2">

          {/* Banner Content */}
          <div className="rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/20 p-4 space-y-4">
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
              <LayoutTemplate className="h-3 w-3" /> Banner Content
            </p>

            <div className="space-y-1.5">
              <label htmlFor="title" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Headline / Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                placeholder="e.g. Empower Your Home With Solar"
                {...register("title", { required: "Banner title is required" })}
                className="h-9 text-sm bg-white dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 rounded-lg focus-visible:ring-primary/30"
              />
              {errors.title && <p className="text-xs text-red-500 mt-0.5">{errors.title.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="subtitle" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Subtitle{" "}
                <span className="text-[10px] font-normal text-zinc-400">(Optional)</span>
              </label>
              <Textarea
                id="subtitle"
                placeholder="Short promotional copy shown below the headline"
                rows={2}
                {...register("subtitle")}
                className="text-sm bg-white dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 rounded-lg focus-visible:ring-primary/30 resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="badge" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Pill Badge <span className="text-[10px] font-normal text-zinc-400">(Optional)</span>
              </label>
              <Input
                id="badge"
                placeholder="e.g. Limited Time Offer"
                {...register("badge")}
                className="h-9 text-sm bg-white dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 rounded-lg focus-visible:ring-primary/30"
              />
            </div>
          </div>

          {/* CTA & Settings */}
          <div className="rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/20 p-4 space-y-4">
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
              <Link2 className="h-3 w-3" /> Call-to-Action & Settings
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="ctaText" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Button Label
                </label>
                <Input
                  id="ctaText"
                  placeholder="e.g. Shop Now"
                  {...register("ctaText")}
                  className="h-9 text-sm bg-white dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 rounded-lg focus-visible:ring-primary/30"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="ctaLink" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Destination URL
                </label>
                <Input
                  id="ctaLink"
                  placeholder="/shop"
                  {...register("ctaLink")}
                  className="h-9 text-sm bg-white dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 rounded-lg focus-visible:ring-primary/30"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="order" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Priority Order{" "}
                <span className="text-[10px] font-normal text-zinc-400">(0 = displayed first)</span>
              </label>
              <Input
                id="order"
                type="number"
                placeholder="0"
                {...register("order", { valueAsNumber: true })}
                className="h-9 text-sm bg-white dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 rounded-lg focus-visible:ring-primary/30 w-1/2"
              />
            </div>
          </div>

          {/* Banner Image */}
          <div className="rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/20 p-4 space-y-3">
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
              <ImageIcon className="h-3 w-3" /> Banner Image <span className="text-red-500 normal-case font-semibold text-[10px]">*</span>
            </p>

            {previewUrl ? (
              <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-950">
                <Image src={previewUrl} alt="Banner preview" fill className="object-cover" />
                <button
                  type="button"
                  onClick={removeSelectedFile}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full aspect-[21/9] rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 hover:border-primary/60 cursor-pointer bg-white dark:bg-zinc-900/30 transition-colors p-4">
                <UploadCloud className="h-7 w-7 text-zinc-400 mb-2" />
                <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                  Click to upload banner background
                </span>
                <span className="text-[10px] text-zinc-400 mt-1">
                  Recommended: 21:9 or 1920×800px (PNG, JPG, WebP)
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            )}
          </div>

        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <Button type="button" variant="ghost" size="sm" onClick={onClose} className="h-9 text-xs dark:text-zinc-300">
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={createBannerMutation.isPending}
          className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-9 rounded-lg gap-1.5 shadow-sm"
        >
          {createBannerMutation.isPending ? "Publishing..." : "Publish Banner"}
        </Button>
      </div>
    </form>
  );
};

export default CreateBannerForm;
