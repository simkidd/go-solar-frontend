"use client";
import React, { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { useCreateBannerMutation } from "@/hooks/mutations/useBannerMutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { toast } from "sonner";
import { useAllOffersQuery } from "@/hooks/queries/useOffersQuery";

interface CreateBannerFormValues {
  title: string;
  ctaLink?: string;
  placement:
    | "storefront_hero"
    | "storefront_promo_strip"
    | "storefront_promo_card"
    | "storefront_leaderboard";
  isActive?: boolean;
}

const CreateBannerForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { data: offers = [] } = useAllOffersQuery();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateBannerFormValues>({
    defaultValues: {
      title: "",
      ctaLink: "/products",
      isActive: true,
      placement: "storefront_hero",
    },
  });

  const createBannerMutation = useCreateBannerMutation({
    onSuccess: () => onClose(),
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
    if (values.ctaLink) formData.append("ctaLink", values.ctaLink);
    formData.append("isActive", String(values.isActive ?? true));
    formData.append("placement", values.placement);
    formData.append("image", selectedFile);
    createBannerMutation.mutate(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full font-inter flex flex-col gap-4"
    >
      <div className="space-y-6 pt-2">
        {/* Banner Admin Identifier */}
        <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
          <div className="border-b border-border/60 pb-3 ">
            <h3 className="text-sm font-extrabold text-foreground tracking-tight flex items-center gap-1.5">
              <LayoutTemplate className="h-4 w-4 text-primary" /> Administrative
              Label
            </h3>
            <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
              Specify a label for this graphic layout banner to manage it easily
              inside the dashboard.
            </p>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="title"
              className="text-[10px] font-black uppercase tracking-widest text-muted-foreground  block"
            >
              Banner Name / Label <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              placeholder="e.g. Summer Flash Sale Hero Banner"
              {...register("title", {
                required: "Banner title/label is required",
              })}
              className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary font-semibold"
            />
            {errors.title && (
              <p className="text-xs text-red-500 font-semibold mt-0.5">
                {errors.title.message}
              </p>
            )}
          </div>
        </div>

        {/* CTA & Settings Card */}
        <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
          <div className="border-b border-border/60 pb-3 ">
            <h3 className="text-sm font-extrabold text-foreground tracking-tight flex items-center gap-1.5">
              <Link2 className="h-4 w-4 text-primary" /> Call-to-Action &amp;
              Settings
            </h3>
            <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
              Configure the redirect destination and storefront placement
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground  block">
              Link to Active Sales Offer (Optional)
            </label>
            <Select
              onValueChange={(val) => {
                if (val === "none") {
                  setValue("ctaLink", "/products");
                } else {
                  setValue("ctaLink", `/products?offer=${val}`);
                }
              }}
            >
              <SelectTrigger className="bg-muted/30 border-border rounded-xl text-xs h-10 focus:ring-primary font-semibold">
                <SelectValue placeholder="Link banner to campaign..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl bg-card border border-border/80">
                <SelectItem
                  value="none"
                  className="cursor-pointer text-xs font-semibold"
                >
                  None (Use custom link below)
                </SelectItem>
                {offers.map((offer: any) => (
                  <SelectItem
                    key={offer._id}
                    value={offer._id}
                    className="cursor-pointer text-xs font-semibold"
                  >
                    {offer.name} ({offer.percentageOff}% OFF)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="ctaLink"
              className="text-[10px] font-black uppercase tracking-widest text-muted-foreground  block"
            >
              Destination URL
            </label>
            <Input
              id="ctaLink"
              placeholder="/products"
              {...register("ctaLink")}
              className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground  block">
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
                    <SelectItem
                      value="storefront_hero"
                      className="cursor-pointer text-xs font-semibold"
                    >
                      Storefront Hero Slider (Top Carousel)
                    </SelectItem>
                    <SelectItem
                      value="storefront_promo_strip"
                      className="cursor-pointer text-xs font-semibold"
                    >
                      Promotional Grid Strip (Middle)
                    </SelectItem>
                    <SelectItem
                      value="storefront_promo_card"
                      className="cursor-pointer text-xs font-semibold"
                    >
                      Featured Promo Card (Highlights)
                    </SelectItem>
                    <SelectItem
                      value="storefront_leaderboard"
                      className="cursor-pointer text-xs font-semibold"
                    >
                      Leaderboard Strip (1264 × 180 — Pure Graphic)
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/60 ">
            <div className="space-y-0.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground  block">
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
          <div className="border-b border-border/60 pb-3 ">
            <h3 className="text-sm font-extrabold text-foreground tracking-tight flex items-center gap-1.5">
              <ImageIcon className="h-4 w-4 text-primary" /> Banner Background
              Image <span className="text-red-500">*</span>
            </h3>
            <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
              Select a premium cover background image for this promotion
            </p>
          </div>

          {previewUrl ? (
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden border border-border bg-zinc-950">
              <Image
                src={previewUrl}
                alt="Banner preview"
                fill
                className="object-cover"
              />
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
              className={`flex flex-col items-center justify-center w-full aspect-[21/9] rounded-2xl border-2 border-dashed transition-all p-6 text-center  cursor-pointer ${
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
              <span className="text-[10px] text-[#08aa08] font-semibold mt-1">
                Recommended: Hero: 1920×600px | Strip: 1200×200px | Card:
                800×350px
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border/60 ">
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
          disabled={createBannerMutation.isPending}
          className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-10 px-6 rounded-xl shadow-xs cursor-pointer gap-1.5"
        >
          {createBannerMutation.isPending ? "Publishing..." : "Publish Banner"}
        </Button>
      </div>
    </form>
  );
};

export default CreateBannerForm;
