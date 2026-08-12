"use client";
import React from "react";
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
import { toast } from "sonner";
import { useCategoriesQuery } from "@/hooks/queries/useCategoriesQuery";
import { useAllOffersQuery } from "@/hooks/queries/useOffersQuery";
import { useUpdateProductMutation } from "@/hooks/mutations/useProductMutations";

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
  const { data: allCategories = [] } = useCategoriesQuery();
  const { data: offers = [] } = useAllOffersQuery();
  const updateProductMutation = useUpdateProductMutation({ onSuccess: onClose });

  const {
    register,
    control,
    handleSubmit,
    watch,
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
      outsideLocationDeliveryFee: Number(values.outsideLocationDeliveryFee || 0),
      isPublished: values.isPublished,
      currentOffer: values.currentOffer || undefined,
      datasheet: values.datasheet,
      showDatasheet: values.showDatasheet,
    });
  };

  const activeOffers = offers.filter((offer) => offer?.isActive);

  return (
    <form className="w-full font-inter space-y-6 pt-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full grid lg:grid-cols-2 grid-cols-1 gap-6">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter product name"
              {...register("name", { required: "Product title is required" })}
              className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Enter product description"
              rows={4}
              {...register("description", { required: "Product description is required" })}
              className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Category <span className="text-red-500">*</span>
              </label>
              <Controller
                control={control}
                name="category"
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {allCategories.map((cat) => (
                        <SelectItem key={cat?._id} value={cat?._id}>
                          {cat?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-xs text-red-500">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Brand</label>
              <Input
                placeholder="Brand name"
                {...register("brand")}
                className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Regular Price (₦) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="0"
                {...register("price", {
                  required: "Price is required",
                  valueAsNumber: true,
                })}
                className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
              />
              {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Discount Price (₦) <span className="text-xs text-zinc-400 font-normal">(Optional)</span>
              </label>
              <Input
                type="number"
                placeholder="Leave blank if no discount"
                {...register("discountPrice", { valueAsNumber: true })}
                className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Quantity in Stock <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="0"
                {...register("quantityInStock", {
                  required: "Stock quantity is required",
                  valueAsNumber: true,
                })}
                className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
              />
              {errors.quantityInStock && (
                <p className="text-xs text-red-500">{errors.quantityInStock.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Shipping Class
              </label>
              <Controller
                control={control}
                name="shippingClass"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800">
                      <SelectValue placeholder="Select Shipping Class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Equipment (0–5kg)</SelectItem>
                      <SelectItem value="medium">Medium Cargo (5–20kg)</SelectItem>
                      <SelectItem value="heavy_freight">Heavy Freight (Batteries / Panels 20kg+)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Additional Information</label>
            <Textarea
              placeholder="Enter additional details"
              rows={4}
              {...register("additionalInfo")}
              className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Custom Delivery In-City (₦) <span className="text-xs text-zinc-400 font-normal">(Optional)</span>
              </label>
              <Input
                type="number"
                placeholder="0"
                {...register("withinLocationDeliveryFee", { valueAsNumber: true })}
                className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Custom Delivery Interstate (₦) <span className="text-xs text-zinc-400 font-normal">(Optional)</span>
              </label>
              <Input
                type="number"
                placeholder="0"
                {...register("outsideLocationDeliveryFee", { valueAsNumber: true })}
                className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Campaign Offer <span className="text-xs text-zinc-400 font-normal">(Optional sitewide promo)</span>
            </label>
            <Controller
              control={control}
              name="currentOffer"
              render={({ field }) => (
                <Select
                  value={field.value || "none"}
                  onValueChange={(val) => field.onChange(val === "none" ? "" : val)}
                >
                  <SelectTrigger className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800">
                    <SelectValue placeholder="Select an offer campaign (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Campaign</SelectItem>
                    {activeOffers.map((offer) => (
                      <SelectItem key={offer?._id} value={offer?._id}>
                        {offer?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      </div>

      {/* ── Datasheet Section ───────────────────────────── */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Technical Datasheet</p>
            <p className="text-xs text-zinc-400 mt-0.5">Spec rows shown on the product detail page</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">{showDatasheet ? "Visible" : "Hidden"}</span>
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
              {...register(`datasheet.${idx}.key` as const, { required: true })}
              className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
            />
            <Input
              placeholder="Value (e.g. 200Ah)"
              {...register(`datasheet.${idx}.value` as const, { required: true })}
              className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
            />
            <button
              type="button"
              onClick={() => remove(idx)}
              className="text-red-500 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ key: "", value: "" })}
          className="border-dashed text-zinc-500 dark:text-zinc-400 gap-1.5"
        >
          <Plus size={14} /> Add Row
        </Button>
      </div>

      <div className="flex items-center gap-2 mt-8 justify-end">
        <Button type="button" variant="ghost" onClick={onClose} className="dark:text-zinc-300">
          Close
        </Button>
        <Button
          type="submit"
          disabled={updateProductMutation.isPending}
          className="bg-primary hover:bg-primary/95 text-white"
        >
          {updateProductMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
};

export default UpdateProductForm;
