"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  const createProductMutation = useCreateProductMutation({ onSuccess: onClose });

  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const {
    register,
    control,
    handleSubmit,
    setValue,
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
      className="relative w-20 h-20 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800"
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
        className="absolute top-1 right-1 bg-white/90 text-red-600 rounded-full p-1 shadow-sm"
        onClick={() => setFiles(files.filter((f) => f !== file))}
      >
        <Trash2 size={14} />
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
    if (files.length === 0) {
      toast.error("Please upload at least one image");
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
    <form className="w-full font-inter flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <ScrollArea className="flex-1 max-h-[70vh]">
        <div className="space-y-6 pr-4 pt-2">

          {/* ── Main 2-Column Grid ── */}
          <div className="w-full grid lg:grid-cols-2 grid-cols-1 gap-6">
            {/* Left Column */}
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
                          {categories.map((cat) => (
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
                    <Select value={field.value || "none"} onValueChange={(val) => field.onChange(val === "none" ? "" : val)}>
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

            {/* Right Column */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Images</label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl py-10 px-4 flex flex-col items-center justify-center cursor-pointer transition-all bg-zinc-50/50 dark:bg-zinc-900/10 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/10 ${
                    isDragActive ? "border-primary bg-primary/5" : "border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p className="text-primary text-sm font-medium">Drop the files here...</p>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center space-y-2">
                      <Upload className="h-5 w-5 text-zinc-400" />
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Drag &amp; drop files here, or <span className="text-primary font-medium">browse</span>
                      </p>
                      <p className="text-xs text-zinc-400">(Maximum of 3 files allowed)</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">{thumbs}</div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Additional Information</label>
                <Textarea
                  placeholder="Enter additional details"
                  rows={4}
                  {...register("additionalInfo")}
                  className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
                />
              </div>
            </div>
          </div>

          {/* ── Datasheet Section ── */}
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

        </div>
      </ScrollArea>

      <div className="flex items-center gap-2 pt-4 mt-2 border-t border-zinc-100 dark:border-zinc-800 justify-end">
        <Button type="button" variant="ghost" onClick={onClose} className="dark:text-zinc-300">
          Close
        </Button>
        <Button
          type="submit"
          disabled={createProductMutation.isPending}
          className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-9 rounded-lg shadow-sm"
        >
          {createProductMutation.isPending ? "Creating..." : "Create Product"}
        </Button>
      </div>
    </form>
  );
};

export default CreateProductForm;
