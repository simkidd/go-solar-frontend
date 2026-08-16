"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Trash2, Layers, Check } from "lucide-react";
import PriceInput from "@/components/ui/price-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { toast } from "sonner";
import { useAllProductsQuery } from "@/hooks/queries/useProductsQuery";
import { useUpdatePackageMutation } from "@/hooks/mutations/usePackageMutations";
import { Product } from "@/interfaces/product.interface";

interface UpdatePackageFormProps {
  initialData: any;
  onClose: () => void;
}

interface FormValues {
  name: string;
  tagline: string;
  description: string;
  capacityKva: number;
  batteryType: "Lithium" | "Tubular" | "AGM" | "Gel";
  batteryKwh: number;
  pvKwp: number;
  price: number | "";
  discountPrice: number | "";
  inStock: boolean;
  highlights: { text: string }[];
  powers: { text: string }[];
}

export const UpdatePackageForm: React.FC<UpdatePackageFormProps> = ({ initialData, onClose }) => {
  const updateMutation = useUpdatePackageMutation({ onSuccess: onClose });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      tagline: "",
      description: "",
      capacityKva: 3.5,
      batteryType: "Lithium",
      batteryKwh: 5,
      pvKwp: 3,
      price: "",
      discountPrice: "",
      inStock: true,
      highlights: [],
      powers: [],
    },
  });

  const { fields: highlightFields, append: appendHighlight, remove: removeHighlight } =
    useFieldArray({ control, name: "highlights" });

  const { fields: powerFields, append: appendPower, remove: removePower } =
    useFieldArray({ control, name: "powers" });

  // Constituents in local state — needs full Product object for display
  const [constituents, setConstituents] = useState<Array<{ product: Product; qty: number }>>([]);
  const [productSearch, setProductSearch] = useState("");

  const highlightInputRef = useRef<HTMLInputElement>(null);
  const powerInputRef = useRef<HTMLInputElement>(null);

  // Pre-fill form when initialData loads
  useEffect(() => {
    if (!initialData) return;
    reset({
      name: initialData.name || "",
      tagline: initialData.tagline || "",
      description: initialData.description || "",
      capacityKva: initialData.capacityKva ?? 3.5,
      batteryType: initialData.batteryType || "Lithium",
      batteryKwh: initialData.batteryKwh ?? 5,
      pvKwp: initialData.pvKwp ?? 3,
      price: initialData.price || "",
      discountPrice: initialData.discountPrice || "",
      inStock: initialData.inStock !== false,
      highlights: (initialData.highlights || []).map((h: string) => ({ text: h })),
      powers: (initialData.powers || []).map((p: string) => ({ text: p })),
    });

    if (Array.isArray(initialData.constituents)) {
      const mapped = initialData.constituents
        .map((c: any) =>
          c.product && typeof c.product === "object"
            ? { product: c.product as Product, qty: c.qty || 1 }
            : null
        )
        .filter(Boolean) as Array<{ product: Product; qty: number }>;
      setConstituents(mapped);
    }
  }, [initialData, reset]);

  const { data: productsRes } = useAllProductsQuery({
    page: 1, limit: 5, q: productSearch, status: "published",
  });
  const searchedProducts = productsRes?.products || [];

  const constituentsTotalPrice = useMemo(
    () => constituents.reduce((sum, c) => sum + c.product.price * c.qty, 0),
    [constituents]
  );

  const handleAddHighlight = () => {
    const val = highlightInputRef.current?.value?.trim();
    if (val) { appendHighlight({ text: val }); highlightInputRef.current!.value = ""; }
  };

  const handleAddPower = () => {
    const val = powerInputRef.current?.value?.trim();
    if (val) { appendPower({ text: val }); powerInputRef.current!.value = ""; }
  };

  const handleAddProduct = (prod: Product) => {
    if (constituents.some((c) => c.product._id === prod._id)) {
      toast.info("Product already added."); return;
    }
    setConstituents((prev) => [...prev, { product: prod, qty: 1 }]);
    setProductSearch("");
  };

  const handleRemoveProduct = (prodId: string) =>
    setConstituents((prev) => prev.filter((c) => c.product._id !== prodId));

  const handleQtyChange = (prodId: string, qty: number) =>
    setConstituents((prev) =>
      prev.map((c) => (c.product._id === prodId ? { ...c, qty: Math.max(1, qty) } : c))
    );

  const onSubmit = (values: FormValues) => {
    if (constituents.length === 0) {
      toast.error("Please add at least one product constituent."); return;
    }
    updateMutation.mutate({
      id: initialData._id,
      input: {
        ...values,
        price: values.price || 0,
        discountPrice: values.discountPrice || 0,
        highlights: values.highlights.map((h) => h.text),
        powers: values.powers.map((p) => p.text),
        constituents: constituents.map((c) => ({ product: c.product._id, qty: c.qty })),
      },
    });
  };

  return (
    <form className="w-full font-inter flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-4">

        {/* ── Main Column (2/3) ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Card 1: General Details */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
            <div className="border-b border-border/60 pb-3 select-none">
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">General Details</h3>
              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                Name, tagline, and detailed description of this solar package
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                Package Title <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. GoSolar 5kVA Premium Setup"
                {...register("name", { required: "Package name is required" })}
                className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
              />
              {errors.name && (
                <p className="text-xs text-red-500 font-semibold">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                Tagline / Configuration Summary
              </label>
              <Input
                placeholder="e.g. 5kVA Inverter + 5.0kWh Lithium Wall Mount + 6x 550W Panels"
                {...register("tagline")}
                className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                Package Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                rows={4}
                placeholder="Describe the load profile and household appliances this package supports..."
                {...register("description", { required: "Description is required" })}
                className="bg-muted/30 border-border rounded-xl text-xs focus-visible:ring-primary min-h-[100px]"
              />
              {errors.description && (
                <p className="text-xs text-red-500 font-semibold">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Card 2: Constituent Products */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
            <div className="border-b border-border/60 pb-3 select-none">
              <h3 className="text-sm font-extrabold text-foreground tracking-tight flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                Constituent Products
              </h3>
              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                Search and link real store products that form this package bundle
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <Input
                placeholder="Search published products..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="pl-10 bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
              />
              {productSearch && searchedProducts.length > 0 && (
                <div className="absolute left-0 right-0 top-11 border border-border/80 bg-card rounded-xl shadow-lg z-30 overflow-hidden divide-y divide-border/60">
                  {searchedProducts.map((prod) => {
                    const alreadyAdded = constituents.some((c) => c.product._id === prod._id);
                    return (
                      <div key={prod._id} className="p-2.5 flex items-center justify-between gap-3 hover:bg-muted/20 transition-colors">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="h-8 w-8 min-w-[32px] rounded-lg overflow-hidden border border-border/80 relative bg-muted">
                            {prod.images?.[0]?.url && (
                              <Image src={prod.images[0].url} alt={prod.name} fill className="object-cover" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-foreground truncate">{prod.name}</p>
                            <p className="text-[10px] text-muted-foreground font-semibold">
                              ₦{prod.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant={alreadyAdded ? "ghost" : "default"}
                          onClick={() => handleAddProduct(prod)}
                          disabled={alreadyAdded}
                          className="h-7 px-3 text-[10px] font-bold shrink-0"
                        >
                          {alreadyAdded ? <Check size={12} className="text-emerald-500" /> : <Plus size={12} />}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {constituents.length === 0 ? (
              <div className="text-center py-8 text-[11px] text-muted-foreground font-semibold border-2 border-dashed border-border rounded-xl">
                No products linked yet. Search above to add constituent equipment.
              </div>
            ) : (
              <>
                <ScrollArea className="max-h-[280px]">
                  <div className="space-y-2 pr-3">
                  {constituents.map((item) => (
                    <div key={item.product._id} className="flex items-center justify-between gap-3 p-3 bg-muted/20 rounded-xl border border-border/60">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-10 w-10 min-w-[40px] rounded-xl overflow-hidden border border-border/80 relative bg-muted">
                          {item.product.images?.[0]?.url && (
                            <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold text-foreground truncate">{item.product.name}</p>
                          <p className="text-[10px] text-muted-foreground font-semibold">
                            {item.product.brand} — ₦{(item.product.price * item.qty).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none">Qty</label>
                        <Input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => handleQtyChange(item.product._id, Number(e.target.value))}
                          className="w-14 h-8 text-center text-xs px-1 font-bold bg-muted/30 border-border rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(item.product._id)}
                          className="text-muted-foreground hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50/50 dark:hover:bg-red-950/10 transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                  </div>
                </ScrollArea>
                {constituentsTotalPrice > 0 && (
                  <div className="flex justify-end pt-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Constituent Sum: <span className="text-foreground">₦{constituentsTotalPrice.toLocaleString()}</span>
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Card 3: Package Capabilities */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
            <div className="border-b border-border/60 pb-3 select-none">
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">Package Capabilities</h3>
              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                Key selling highlights and supported load capabilities shown on the storefront
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Highlights */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                  Package Highlights
                </label>
                <div className="flex gap-2">
                  <input
                    ref={highlightInputRef}
                    placeholder="e.g. 25-year panel warranty"
                    className="flex h-9 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddHighlight())}
                  />
                  <Button type="button" onClick={handleAddHighlight} variant="outline" size="sm"
                    className="h-9 text-xs border-border text-muted-foreground hover:text-foreground cursor-pointer shrink-0">
                    Add
                  </Button>
                </div>
                <ul className="space-y-1 max-h-[140px] overflow-y-auto">
                  {highlightFields.map((field, i) => (
                    <li key={field.id} className="flex justify-between items-center text-[11px] font-semibold text-foreground bg-muted/20 px-3 py-1.5 rounded-lg border border-border/60">
                      <span className="truncate pr-2">{field.text}</span>
                      <button type="button" onClick={() => removeHighlight(i)}
                        className="text-muted-foreground hover:text-red-500 shrink-0 cursor-pointer">×</button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Powers */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                  Load Capabilities
                </label>
                <div className="flex gap-2">
                  <input
                    ref={powerInputRef}
                    placeholder="e.g. 1 Refrigerator + 5 Fans"
                    className="flex h-9 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddPower())}
                  />
                  <Button type="button" onClick={handleAddPower} variant="outline" size="sm"
                    className="h-9 text-xs border-border text-muted-foreground hover:text-foreground cursor-pointer shrink-0">
                    Add
                  </Button>
                </div>
                <ul className="space-y-1 max-h-[140px] overflow-y-auto">
                  {powerFields.map((field, i) => (
                    <li key={field.id} className="flex justify-between items-center text-[11px] font-semibold text-foreground bg-muted/20 px-3 py-1.5 rounded-lg border border-border/60">
                      <span className="truncate pr-2">{field.text}</span>
                      <button type="button" onClick={() => removePower(i)}
                        className="text-muted-foreground hover:text-red-500 shrink-0 cursor-pointer">×</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ── Sidebar Column (1/3) ── */}
        <div className="space-y-6">

          {/* Card: Pricing */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
            <div className="border-b border-border/60 pb-3 select-none">
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">Pricing</h3>
              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                Installed bundle price displayed on the storefront
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                Installed Price (₦) <span className="text-red-500">*</span>
              </label>
              <Controller
                control={control}
                name="price"
                rules={{ required: "Price is required", validate: (v) => (v !== "" && v > 0) || "Price must be greater than 0" }}
                render={({ field }) => (
                  <PriceInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="e.g. 3,850,000"
                    className="text-primary font-bold"
                  />
                )}
              />
              {errors.price && (
                <p className="text-xs text-red-500 font-semibold">{errors.price.message}</p>
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
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="0 if no discount"
                  />
                )}
              />
            </div>
          </div>

          {/* Card: System Specifications */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
            <div className="border-b border-border/60 pb-3 select-none">
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">System Specifications</h3>
              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                Technical sizing parameters for calculator integration
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                Inverter Capacity (kVA) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                step="0.1"
                {...register("capacityKva", { required: "Capacity is required", valueAsNumber: true, min: { value: 0.1, message: "Must be > 0" } })}
                className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
              />
              {errors.capacityKva && (
                <p className="text-xs text-red-500 font-semibold">{errors.capacityKva.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                Battery Chemistry
              </label>
              <Controller
                control={control}
                name="batteryType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="bg-muted/30 border-border rounded-xl text-xs h-10 focus:ring-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl bg-card border border-border/80">
                      <SelectItem value="Lithium" className="cursor-pointer font-semibold text-xs">Lithium (LiFePO4)</SelectItem>
                      <SelectItem value="Tubular" className="cursor-pointer font-semibold text-xs">Tubular</SelectItem>
                      <SelectItem value="AGM" className="cursor-pointer font-semibold text-xs">AGM Deep Cycle</SelectItem>
                      <SelectItem value="Gel" className="cursor-pointer font-semibold text-xs">Gel</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                Battery Capacity (kWh)
              </label>
              <Input
                type="number"
                step="0.1"
                {...register("batteryKwh", { valueAsNumber: true })}
                className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                Solar Array (kWp)
              </label>
              <Input
                type="number"
                step="0.1"
                {...register("pvKwp", { valueAsNumber: true })}
                className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
              />
            </div>
          </div>

          {/* Card: Availability */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
            <div className="border-b border-border/60 pb-3 select-none">
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">Availability</h3>
              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                Control whether this package is orderable on the storefront
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                Stock Status
              </label>
              <Controller
                control={control}
                name="inStock"
                render={({ field }) => (
                  <Select value={String(field.value)} onValueChange={(val) => field.onChange(val === "true")}>
                    <SelectTrigger className="bg-muted/30 border-border rounded-xl text-xs h-10 focus:ring-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl bg-card border border-border/80">
                      <SelectItem value="true" className="cursor-pointer font-semibold text-xs">In Stock</SelectItem>
                      <SelectItem value="false" className="cursor-pointer font-semibold text-xs">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
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
          disabled={updateMutation.isPending}
          className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-10 px-6 rounded-xl shadow-xs cursor-pointer"
        >
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default UpdatePackageForm;
