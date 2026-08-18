"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { OfferType } from "@/interfaces/product.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateOfferMutation } from "@/hooks/mutations/useOfferMutations";
import { Tag } from "lucide-react";

interface FormValues {
  name: string;
  description: string;
  type: OfferType;
  percentageOff: number;
}

const CreateOfferForm: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const createOfferMutation = useCreateOfferMutation({ onSuccess: onClose });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      type: OfferType.PercentageOff,
      percentageOff: undefined,
    },
  });

  const onSubmit = (values: FormValues) => {
    createOfferMutation.mutate({
      name: values.name,
      description: values.description,
      type: values.type,
      percentageOff: Number(values.percentageOff),
      isActive: true,
    });
  };

  return (
    <form className="w-full font-inter flex flex-col gap-4 pt-2" onSubmit={handleSubmit(onSubmit)}>
      {/* Offer Info Section */}
      <div className="rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/20 p-4 space-y-4">
        <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
          <Tag className="h-3 w-3" /> Offer Information
        </p>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Title <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="e.g. Clearance Sale"
            {...register("name", { required: "Offer title is required" })}
            className="h-9 text-sm bg-white dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 rounded-lg focus-visible:ring-primary/30"
          />
          {errors.name && <p className="text-xs text-red-500 mt-0.5">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Description <span className="text-red-500">*</span>
          </label>
          <Textarea
            placeholder="Describe what this offer covers"
            rows={3}
            {...register("description", { required: "Offer description is required" })}
            className="text-sm bg-white dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 rounded-lg focus-visible:ring-primary/30 resize-none"
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-0.5">{errors.description.message}</p>
          )}
        </div>
      </div>

      {/* Discount Section */}
      <div className="rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/20 p-4 space-y-4">
        <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
          Discount Settings
        </p>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
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
              className="h-9 text-sm bg-white dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 rounded-lg focus-visible:ring-primary/30 pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs font-semibold">%</span>
          </div>
          {errors.percentageOff && (
            <p className="text-xs text-red-500 mt-0.5">{errors.percentageOff.message}</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-2 pt-1">
        <Button type="button" variant="ghost" size="sm" onClick={onClose} className="h-9 text-xs dark:text-zinc-300">
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={createOfferMutation.isPending}
          className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-9 rounded-lg gap-1.5 shadow-sm"
        >
          {createOfferMutation.isPending ? "Creating..." : "Create Offer"}
        </Button>
      </div>
    </form>
  );
};

export default CreateOfferForm;
