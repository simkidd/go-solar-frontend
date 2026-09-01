"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Offer, OfferType } from "@/interfaces/product.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useUpdateOfferMutation } from "@/hooks/mutations/useOfferMutations";
import { Tag, Calendar } from "lucide-react";

interface FormValues {
  name: string;
  description: string;
  type: OfferType;
  percentageOff: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

const formatDateForInput = (dateStr?: string) => {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toISOString().split("T")[0];
  } catch (e) {
    return "";
  }
};

const UpdateOfferForm: React.FC<{
  onClose: () => void;
  existingOffer?: Offer;
}> = ({ onClose, existingOffer }) => {
  const updateOfferMutation = useUpdateOfferMutation({ onSuccess: onClose });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: existingOffer?.name || "",
      description: existingOffer?.description || "",
      type: (existingOffer?.type as OfferType) || OfferType.PercentageOff,
      percentageOff: existingOffer?.percentageOff || 0,
      isActive: existingOffer?.isActive ?? true,
      startDate: formatDateForInput(existingOffer?.startDate),
      endDate: formatDateForInput(existingOffer?.endDate),
    },
  });

  const onSubmit = (values: FormValues) => {
    if (!existingOffer?._id) return;
    updateOfferMutation.mutate({
      offerId: existingOffer._id,
      input: {
        name: values.name,
        description: values.description,
        type: values.type,
        percentageOff: Number(values.percentageOff),
        isActive: values.isActive,
        startDate: values.startDate || undefined,
        endDate: values.endDate || undefined,
      },
    });
  };

  return (
    <form
      className="w-full font-inter flex flex-col gap-5 pt-2 text-left"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Offer Info Section */}
      <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground  flex items-center gap-1.5 border-b border-border/60 pb-3">
          <Tag className="h-3.5 w-3.5 text-primary" /> Offer Information
        </p>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground  block">
            Title <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="e.g. Clearance Sale"
            {...register("name", { required: "Offer title is required" })}
            className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
          />
          {errors.name && (
            <p className="text-xs text-red-500 font-semibold mt-0.5">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground  block">
            Description <span className="text-red-500">*</span>
          </label>
          <Textarea
            placeholder="Describe what this offer covers"
            rows={3}
            {...register("description", {
              required: "Offer description is required",
            })}
            className="text-xs bg-muted/30 border-border rounded-xl focus-visible:ring-primary resize-none p-3"
          />
          {errors.description && (
            <p className="text-xs text-red-500 font-semibold mt-0.5">
              {errors.description.message}
            </p>
          )}
        </div>
      </div>

      {/* Discount & Campaign Period Section */}
      <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground  flex items-center gap-1.5 border-b border-border/60 pb-3">
          <Calendar className="h-3.5 w-3.5 text-primary" /> Campaign Settings
        </p>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground  block">
            Percentage Off (%) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              type="number"
              placeholder="e.g. 15"
              {...register("percentageOff", {
                required: "Percentage is required",
                min: { value: 1, message: "Minimum is 1%" },
                max: { value: 100, message: "Maximum is 100%" },
                valueAsNumber: true,
              })}
              className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-black">
              %
            </span>
          </div>
          {errors.percentageOff && (
            <p className="text-xs text-red-500 font-semibold mt-0.5">
              {errors.percentageOff.message}
            </p>
          )}
        </div>

        {/* Start and End Dates */}
        <div className="grid grid-cols-2 gap-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground  block">
              Start Date
            </label>
            <Input
              type="date"
              {...register("startDate")}
              className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground  block">
              End Date
            </label>
            <Input
              type="date"
              {...register("endDate")}
              className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
            />
          </div>
        </div>

        {/* Active Toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/80">
          <div>
            <p className="text-xs font-bold text-foreground">
              Activate Campaign
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5 font-semibold">
              Make this offer live on the storefront
            </p>
          </div>
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <Switch
                id="isActive"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="cursor-pointer"
              />
            )}
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-2 pt-2  border-t border-border/40">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-10 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer rounded-xl px-4"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={updateOfferMutation.isPending}
          className="bg-primary hover:bg-primary/95 text-white font-extrabold text-xs h-10 rounded-xl gap-1.5 shadow-sm cursor-pointer px-4 uppercase"
        >
          {updateOfferMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default UpdateOfferForm;
