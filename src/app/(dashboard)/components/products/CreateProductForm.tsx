"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
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
import { Plus, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useCategoriesQuery } from "@/hooks/queries/useCategoriesQuery";
import { useAllOffersQuery } from "@/hooks/queries/useOffersQuery";
import { useCreateProductMutation } from "@/hooks/mutations/useProductMutations";

interface FileWithPreview extends File {
  preview: string;
}

interface FormValues {
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  discountPrice?: number;
  shippingClass: "standard" | "medium" | "heavy_freight";
  additionalInfo: string;
  quantityInStock: number;
  outsideLocationDeliveryFee?: number;
  withinLocationDeliveryFee?: number;
  currentOffer?: string;
  showDatasheet: boolean;
  datasheet: Array<{ key: string; value: string }>;
}

const CreateProductForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { data: categories = [] } = useCategoriesQuery();
  const { data: offers = [] } = useAllOffersQuery();
  const createProductMutation = useCreateProductMutation({
    onSuccess: onClose,
  });

  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      category: "",
      brand: "",
      price: undefined,
      discountPrice: undefined,
      shippingClass: "standard",
      additionalInfo: "",
      quantityInStock: undefined,
      outsideLocationDeliveryFee: undefined,
      withinLocationDeliveryFee: undefined,
      currentOffer: "",
      showDatasheet: false,
      datasheet: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "datasheet",
  });

  const showDatasheet = watch("showDatasheet");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (files.length + acceptedFiles.length > 3) {
        toast.info("You can only upload up to 3 images");
        return;
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setFiles((prev) => [...prev, ...newFiles]);
    },
    [files.length]
  );

  const thumbs = files.map((file) => (
    <div
      key={file.name}
      className="relative w-20 h-20 rounded-xl overflow-hidden border border-border bg-muted select-none"
    >
      <Image
        src={file.preview}
        alt={file.name}
        className="w-full h-full object-cover"
        width={80}
        height={80}
        onLoad={() => URL.revokeObjectURL(file.preview)}
      />
      <button
        type="button"
        className="absolute top-1.5 right-1.5 bg-black/75 hover:bg-black text-white hover:text-red-400 rounded-full p-1 transition-colors cursor-pointer"
        onClick={() => setFiles(files.filter((f) => f !== file))}
      >
        <Trash2 size={12} />
      </button>
    </div>
  ));

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    multiple: true,
    maxFiles: 3,
  });

  const onSubmit = (values: FormValues) => {
    if (!values.category) {
      toast.error("Please select a category");
      return;
    }

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("category", values.category);
    formData.append("brand", values.brand || "");
    formData.append("price", String(values.price));
    formData.append("discountPrice", String(values.discountPrice || 0));
    formData.append("shippingClass", values.shippingClass || "standard");
    formData.append("quantityInStock", String(values.quantityInStock || 0));
    formData.append("additionalInfo", values.additionalInfo || "");
    formData.append(
      "withinLocationDeliveryFee",
      String(values.withinLocationDeliveryFee || 0)
    );
    formData.append(
      "outsideLocationDeliveryFee",
      String(values.outsideLocationDeliveryFee || 0)
    );
    formData.append("showDatasheet", String(values.showDatasheet));
    formData.append("datasheet", JSON.stringify(values.datasheet || []));

    if (values.currentOffer) {
      formData.append("currentOffer", values.currentOffer);
    }

    files.forEach((file) => {
      formData.append("images", file);
    });

    createProductMutation.mutate(formData);
  };

  const activeOffers = offers.filter((offer) => offer?.isActive);

  return (
    <form
      className="w-full font-inter flex flex-col gap-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* 2:1 Shopify-style Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-4">
        
        {/* ── Wider Main Column (2/3) ── */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Core Details */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
            <div className="border-b border-border/60 pb-3 select-none">
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">General Details</h3>
              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">Core title and description of the product</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                Product Title / Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g., Canadian Solar Panel 450W"
                {...register("name", { required: "Product title is required" })}
                className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
              />
              {errors.name && (
                <p className="text-xs text-red-500 font-semibold">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                Description Details <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="Describe product characteristics, benefits, specifications, and layout detail..."
                rows={5}
                {...register("description", { required: "Product description is required" })}
                className="bg-muted/30 border-border rounded-xl text-xs focus-visible:ring-primary min-h-[120px]"
              />
              {errors.description && (
                <p className="text-xs text-red-500 font-semibold">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Card 2: Storefront Media */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
            <div className="border-b border-border/60 pb-3 select-none">
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">Product Media</h3>
              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">Upload images for the storefront catalog listing</p>
            </div>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl py-8 px-4 flex flex-col items-center justify-center cursor-pointer transition-all bg-muted/20 hover:bg-muted/30 border-border ${
                isDragActive ? "border-primary bg-primary/5" : ""
              }`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-primary text-xs font-black uppercase tracking-widest">
                  Drop files here...
                </p>
              ) : (
                <div className="flex flex-col items-center justify-center text-center space-y-1.5 select-none">
                  <Upload className="h-5 w-5 text-muted-foreground/60" />
                  <p className="text-xs text-muted-foreground font-semibold">
                    Drag &amp; drop files here, or <span className="text-primary font-bold">browse</span>
                  </p>
                  <p className="text-[9px] text-muted-foreground/50 uppercase font-bold">
                    Maximum of 3 image files allowed
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">{thumbs}</div>
          </div>

          {/* Card 3: Pricing & Stock */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
            <div className="border-b border-border/60 pb-3 select-none">
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">Pricing &amp; Inventory</h3>
              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">Configure storefront prices and stock levels</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                  Regular Price (₦) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  {...register("price", {
                    required: "Price is required",
                    valueAsNumber: true,
                  })}
                  className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
                />
                {errors.price && (
                  <p className="text-xs text-red-500 font-semibold">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                  Discount Price (₦)
                </label>
                <Input
                  type="number"
                  placeholder="Promo price"
                  {...register("discountPrice", { valueAsNumber: true })}
                  className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                  Quantity in Stock <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  {...register("quantityInStock", {
                    required: "Stock quantity is required",
                    valueAsNumber: true,
                  })}
                  className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
                />
                {errors.quantityInStock && (
                  <p className="text-xs text-red-500 font-semibold">{errors.quantityInStock.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Card 4: Technical Specifications */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
            <div className="border-b border-border/60 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-foreground tracking-tight select-none">Technical Specifications</h3>
                <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">Parameters shown on the product detail page</p>
              </div>
              <div className="flex items-center gap-2 select-none">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  {showDatasheet ? "Visible" : "Hidden"}
                </span>
                <Controller
                  control={control}
                  name="showDatasheet"
                  render={({ field }) => (
                    <Switch
                      id="showDatasheet"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>

            {fields.map((field, idx) => (
              <div key={field.id} className="flex items-center gap-2">
                <Input
                  placeholder="Spec name (e.g. Capacity)"
                  {...register(`datasheet.${idx}.key` as const, { required: true })}
                  className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
                />
                <Input
                  placeholder="Value (e.g. 200Ah)"
                  {...register(`datasheet.${idx}.value` as const, { required: true })}
                  className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="text-red-500 hover:text-red-600 p-2 rounded-xl hover:bg-red-50/50 dark:hover:bg-red-950/10 transition-colors cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ key: "", value: "" })}
              className="border-dashed border-border text-muted-foreground hover:text-foreground h-9 rounded-xl text-xs font-semibold gap-1.5 cursor-pointer"
            >
              <Plus size={13} /> Add Row
            </Button>
          </div>

        </div>

        {/* ── Narrower Sidebar Column (1/3) ── */}
        <div className="space-y-6">
          
          {/* Card 5: Product Organization */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
            <div className="border-b border-border/60 pb-3 select-none">
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">Organization</h3>
              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">Assign category shelves and brand names</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                  Category <span className="text-red-500">*</span>
                </label>
                <Controller
                  control={control}
                  name="category"
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-muted/30 border-border rounded-xl text-xs h-10 focus:ring-primary">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl bg-card border border-border/80">
                        {categories.map((cat) => (
                          <SelectItem key={cat?._id} value={cat?._id} className="cursor-pointer font-semibold text-xs">
                            {cat?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-xs text-red-500 font-semibold">{errors.category.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                  Brand Name
                </label>
                <Input
                  placeholder="e.g. Canadian Solar"
                  {...register("brand")}
                  className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Card 6: Promo & Marketing campaigns */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
            <div className="border-b border-border/60 pb-3 select-none">
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">Marketing Offers</h3>
              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">Link active discount campaigns</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                Promo Campaign
              </label>
              <Controller
                control={control}
                name="currentOffer"
                render={({ field }) => (
                  <Select
                    value={field.value || "none"}
                    onValueChange={(val) => field.onChange(val === "none" ? "" : val)}
                  >
                    <SelectTrigger className="bg-muted/30 border-border rounded-xl text-xs h-10 focus:ring-primary">
                      <SelectValue placeholder="Select offer campaign" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl bg-card border border-border/80">
                      <SelectItem value="none" className="cursor-pointer font-semibold text-xs">No Active Campaign</SelectItem>
                      {activeOffers.map((offer) => (
                        <SelectItem key={offer?._id} value={offer?._id} className="cursor-pointer font-semibold text-xs">
                          {offer?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Card 7: Logistics & Shipping details */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
            <div className="border-b border-border/60 pb-3 select-none">
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">Logistics &amp; Delivery</h3>
              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">Configure delivery fees and shipping tiers</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                  Shipping Class
                </label>
                <Controller
                  control={control}
                  name="shippingClass"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-muted/30 border-border rounded-xl text-xs h-10 focus:ring-primary">
                        <SelectValue placeholder="Select Shipping Class" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl bg-card border border-border/80">
                        <SelectItem value="standard" className="cursor-pointer font-semibold text-xs">Standard Equipment (0–5kg)</SelectItem>
                        <SelectItem value="medium" className="cursor-pointer font-semibold text-xs">Medium Cargo (5–20kg)</SelectItem>
                        <SelectItem value="heavy_freight" className="cursor-pointer font-semibold text-xs">Heavy Freight (20kg+)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                  Local City Delivery (₦)
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  {...register("withinLocationDeliveryFee", { valueAsNumber: true })}
                  className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                  Interstate Delivery (₦)
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  {...register("outsideLocationDeliveryFee", { valueAsNumber: true })}
                  className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                  Additional Details
                </label>
                <Input
                  placeholder="e.g. 1 Year Warranty details"
                  {...register("additionalInfo")}
                  className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer buttons (Non-uppercase) */}
      <div className="flex items-center gap-2 pt-4 mt-2 border-t border-border justify-end select-none">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="text-xs font-semibold rounded-xl h-10 px-5 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted/30"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={createProductMutation.isPending}
          className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-10 px-6 rounded-xl shadow-xs cursor-pointer"
        >
          {createProductMutation.isPending ? "Creating..." : "Create Product"}
        </Button>
      </div>
    </form>
  );
};

export default CreateProductForm;
