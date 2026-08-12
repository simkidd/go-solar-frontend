"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { OfferType } from "@/interfaces/product.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateOfferMutation } from "@/hooks/mutations/useOfferMutations";

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
    <form className="w-full font-inter space-y-4 pt-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Title <span className="text-red-500">*</span>
        </label>
        <Input
          placeholder="Enter offer name"
          {...register("name", { required: "Offer title is required" })}
          className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Description <span className="text-red-500">*</span>
        </label>
        <Textarea
          placeholder="Enter offer description"
          rows={4}
          {...register("description", { required: "Offer description is required" })}
          className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
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
              className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800 pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">%</span>
          </div>
          {errors.percentageOff && (
            <p className="text-xs text-red-500">{errors.percentageOff.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-8 justify-end">
        <Button type="button" variant="ghost" onClick={onClose} className="dark:text-zinc-300">
          Close
        </Button>
        <Button
          type="submit"
          disabled={createOfferMutation.isPending}
          className="bg-primary hover:bg-primary/95 text-white"
        >
          {createOfferMutation.isPending ? "Creating..." : "Create"}
        </Button>
      </div>
    </form>
  );
};

export default CreateOfferForm;
