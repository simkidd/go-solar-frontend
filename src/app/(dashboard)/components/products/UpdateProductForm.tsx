"use client";

import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Product } from "@/interfaces/product.interface";
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
import { Plus, Trash2 } from "lucide-react";
import PriceInput from "@/components/ui/price-input";
import { toast } from "sonner";
import { useCategoriesQuery } from "@/hooks/queries/useCategoriesQuery";
import { useAllOffersQuery } from "@/hooks/queries/useOffersQuery";
import { useUpdateProductMutation } from "@/hooks/mutations/useProductMutations";
import { useQueryClient } from "@tanstack/react-query";

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
  isPublished: boolean;
  showDatasheet: boolean;
  datasheet: Array<{ key: string; value: string }>;
}

const UpdateProductForm: React.FC<{
  product: Product;
  onClose: () => void;
}> = ({ product, onClose }) => {
  const { data: catRes } = useCategoriesQuery({ page: 1, limit: 1000 });
  const allCategories = catRes?.categories || [];
  const { data: offers = [] } = useAllOffersQuery();
  const queryClient = useQueryClient();

  const updateProductMutation = useUpdateProductMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getProductById", product._id],
      });
      onClose();
    },
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      category: product?.category?._id || "",
      brand: product?.brand || "",
      price: product?.price || 0,
      discountPrice: product?.discountPrice ?? 0,
      shippingClass: product?.shippingClass ?? "standard",
      additionalInfo: product?.additionalInfo || "",
      quantityInStock: product?.quantityInStock || 0,
      outsideLocationDeliveryFee: product?.outsideLocationDeliveryFee ?? 0,
      withinLocationDeliveryFee: product?.withinLocationDeliveryFee ?? 0,
      currentOffer: product?.currentOffer?._id || "",
      isPublished: product?.isPublished ?? false,
      showDatasheet: product?.showDatasheet ?? false,
      datasheet: product?.datasheet ?? [],
    },
  });

  const [selectedParentId, setSelectedParentId] = useState<string>(
    (product?.category as any)?.parent || product?.category?._id || "",
  );

  const parentCategories = allCategories.filter((c: any) => !c.parent);
  const subcategories = allCategories.filter((c: any) => {
    const parentVal = typeof c.parent === "object" ? c.parent?._id : c.parent;
    return parentVal === selectedParentId;
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "datasheet",
  });

  const showDatasheet = watch("showDatasheet");

  const onSubmit = (values: FormValues) => {
    if (!values.category) {
      toast.error("Please select a category");
      return;
    }

    updateProductMutation.mutate({
      productId: product._id,
      name: values.name,
      description: values.description,
      category: values.category,
      brand: values.brand,
      price: Number(values.price),
      discountPrice: Number(values.discountPrice || 0),
      shippingClass: values.shippingClass,
      quantityInStock: Number(values.quantityInStock),
      additionalInfo: values.additionalInfo,
      withinLocationDeliveryFee: Number(values.withinLocationDeliveryFee || 0),
      outsideLocationDeliveryFee: Number(
        values.outsideLocationDeliveryFee || 0,
      ),
      isPublished: values.isPublished,
      currentOffer: values.currentOffer || undefined,
      datasheet: values.datasheet,
      showDatasheet: values.showDatasheet,
    });
  };

  const activeOffers = offers.filter((offer) => offer?.isActive);

  return (
    <form
      className="w-full font-inter space-y-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* 2:1 Shopify-style Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-4">
        {/* ── Wider Main Column (2/3) ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Core Details */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
            <div className="border-b border-border/60 pb-3 select-none">
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                General Details
              </h3>
              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                Core title and description of the product
              </p>
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
                <p className="text-xs text-red-500 font-semibold">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                Description Details <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="Describe product characteristics, benefits, and specifications..."
                rows={5}
                {...register("description", {
                  required: "Product description is required",
                })}
                className="bg-muted/30 border-border rounded-xl text-xs focus-visible:ring-primary min-h-[120px]"
              />
              {errors.description && (
                <p className="text-xs text-red-500 font-semibold">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* Card 2: Pricing & Stock */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
            <div className="border-b border-border/60 pb-3 select-none">
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                Pricing &amp; Inventory
              </h3>
              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                Configure storefront prices and stock levels
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                  Regular Price (₦) <span className="text-red-500">*</span>
                </label>
                <Controller
                  control={control}
                  name="price"
                  rules={{ required: "Price is required", validate: (v) => v > 0 || "Price must be greater than 0" }}
                  render={({ field }) => (
                    <PriceInput
                      value={field.value || ""}
                      onChange={(val) => field.onChange(val === "" ? 0 : val)}
                      placeholder="e.g. 450,000"
                      className="text-primary font-bold"
                    />
                  )}
                />
                {errors.price && (
                  <p className="text-xs text-red-500 font-semibold">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                  Discount Price (₦)
                </label>
                <Controller
                  control={control}
                  name="discountPrice"
                  render={({ field }) => (
                    <PriceInput
                      value={field.value || ""}
                      onChange={(val) => field.onChange(val === "" ? 0 : val)}
                      placeholder="Promo price"
                    />
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                  Quantity in Stock <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  min={0}
                  placeholder="0"
                  {...register("quantityInStock", {
                    required: "Stock quantity is required",
                    valueAsNumber: true,
                  })}
                  className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
                />
                {errors.quantityInStock && (
                  <p className="text-xs text-red-500 font-semibold">
                    {errors.quantityInStock.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Card 3: Technical Specifications */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
            <div className="border-b border-border/60 pb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-extrabold text-foreground tracking-tight select-none">
                  Technical Specifications
                </p>
                <p className="text-[10px] text-muted-foreground/80 font-semibold select-none mt-0.5">
                  Parameters shown on the product detail page
                </p>
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
                      id="showDatasheet-update"
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
                  {...register(`datasheet.${idx}.key` as const, {
                    required: true,
                  })}
                  className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
                />
                <Input
                  placeholder="Value (e.g. 200Ah)"
                  {...register(`datasheet.${idx}.value` as const, {
                    required: true,
                  })}
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
          {/* Card 4: Product Visibility */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4 select-none">
            <div className="border-b border-border/60 pb-3">
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                Product Status
              </h3>
              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                Toggle active storefront visibility
              </p>
            </div>

            <div className="flex items-center justify-between border border-border bg-muted/20 rounded-xl p-3">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                {watch("isPublished") ? "Published" : "Draft (Hidden)"}
              </span>
              <Controller
                control={control}
                name="isPublished"
                render={({ field }) => (
                  <Switch
                    id="isPublished-update"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>

          {/* Card 5: Product Organization */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
            <div className="border-b border-border/60 pb-3 select-none">
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                Organization
              </h3>
              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                Assign category shelves and brand names
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                  Parent Category <span className="text-red-500">*</span>
                </label>
                <Select
                  value={selectedParentId}
                  onValueChange={(val) => {
                    setSelectedParentId(val);
                    setValue("category", val); // Fallback to parent category
                  }}
                >
                  <SelectTrigger className="bg-muted/30 border-border rounded-xl text-xs h-10 focus:ring-primary">
                    <SelectValue placeholder="Select Parent Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl bg-card border border-border/80">
                    {parentCategories.map((cat) => (
                      <SelectItem
                        key={cat?._id}
                        value={cat?._id}
                        className="cursor-pointer font-semibold text-xs"
                      >
                        {cat?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedParentId && subcategories.length > 0 && (
                <div className="space-y-1.5 animate-fadeIn">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                    Subcategory <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="category"
                    rules={{ required: "Subcategory is required" }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="bg-muted/30 border-border rounded-xl text-xs h-10 focus:ring-primary">
                          <SelectValue placeholder="Select Subcategory" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl bg-card border border-border/80">
                          {subcategories.map((cat) => (
                            <SelectItem
                              key={cat?._id}
                              value={cat?._id}
                              className="cursor-pointer font-semibold text-xs"
                            >
                              {cat?.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category && (
                    <p className="text-xs text-red-500 font-semibold">
                      {errors.category.message}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                  Brand
                </label>
                <Input
                  placeholder="e.g. Canadian Solar"
                  {...register("brand")}
                  className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Card 6: Marketing offers */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
            <div className="border-b border-border/60 pb-3 select-none">
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                Marketing Offers
              </h3>
              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                Link active discount campaigns
              </p>
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
                    onValueChange={(val) =>
                      field.onChange(val === "none" ? "" : val)
                    }
                  >
                    <SelectTrigger className="bg-muted/30 border-border rounded-xl text-xs h-10 focus:ring-primary">
                      <SelectValue placeholder="Select an offer campaign" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl bg-card border border-border/80">
                      <SelectItem
                        value="none"
                        className="cursor-pointer font-semibold text-xs"
                      >
                        No Active Campaign
                      </SelectItem>
                      {activeOffers.map((offer) => (
                        <SelectItem
                          key={offer?._id}
                          value={offer?._id}
                          className="cursor-pointer font-semibold text-xs"
                        >
                          {offer?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Card 7: Logistics & Shipping */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
            <div className="border-b border-border/60 pb-3 select-none">
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                Logistics &amp; Delivery
              </h3>
              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                Configure delivery charges and classes
              </p>
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
                        <SelectItem
                          value="standard"
                          className="cursor-pointer font-semibold text-xs"
                        >
                          Standard Equipment (0–5kg)
                        </SelectItem>
                        <SelectItem
                          value="medium"
                          className="cursor-pointer font-semibold text-xs"
                        >
                          Medium Cargo (5–20kg)
                        </SelectItem>
                        <SelectItem
                          value="heavy_freight"
                          className="cursor-pointer font-semibold text-xs"
                        >
                          Heavy Freight (20kg+)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                  Local City Delivery (₦)
                </label>
                <Controller
                  control={control}
                  name="withinLocationDeliveryFee"
                  render={({ field }) => (
                    <PriceInput
                      value={field.value || ""}
                      onChange={(val) => field.onChange(val === "" ? 0 : val)}
                      placeholder="0"
                    />
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                  Interstate Delivery (₦)
                </label>
                <Controller
                  control={control}
                  name="outsideLocationDeliveryFee"
                  render={({ field }) => (
                    <PriceInput
                      value={field.value || ""}
                      onChange={(val) => field.onChange(val === "" ? 0 : val)}
                      placeholder="0"
                    />
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                  Additional Details
                </label>
                <Input
                  placeholder="e.g. Warranty details"
                  {...register("additionalInfo")}
                  className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-8 justify-end select-none">
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
          disabled={updateProductMutation.isPending}
          className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-10 px-6 rounded-xl shadow-xs cursor-pointer"
        >
          {updateProductMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
};

export default UpdateProductForm;
