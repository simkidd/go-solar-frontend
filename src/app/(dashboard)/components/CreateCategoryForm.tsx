"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
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
import { useCategoriesQuery } from "@/hooks/queries/useCategoriesQuery";
import { useCreateCategoryMutation } from "@/hooks/mutations/useCategoryMutations";

interface FormValues {
  name: string;
  description: string;
  parent?: string;
}

const CreateCategoryForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { data: categories = [] } = useCategoriesQuery();
  const createCategoryMutation = useCreateCategoryMutation({ onSuccess: onClose });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      parent: "none",
    },
  });

  const onSubmit = (values: FormValues) => {
    createCategoryMutation.mutate({
      name: values.name,
      description: values.description,
      parent: values.parent === "none" ? null : values.parent,
    });
  };

  const parentOptions = categories.filter((c: any) => !c.parent);

  return (
    <form className="w-full font-inter flex flex-col gap-4 pt-2" onSubmit={handleSubmit(onSubmit)}>
      {/* Details Section */}
      <div className="rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/20 p-4 space-y-4">
        <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
          Category Details
        </p>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Name <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="e.g. Solar Panels"
            {...register("name", { required: "Category name is required" })}
            className="h-9 text-sm bg-white dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 rounded-lg focus-visible:ring-primary/30"
          />
          {errors.name && <p className="text-xs text-red-500 mt-0.5">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Parent Category{" "}
            <span className="text-[10px] font-normal text-zinc-400">(Leave empty for top-level)</span>
          </label>
          <Controller
            control={control}
            name="parent"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-9 text-sm bg-white dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 rounded-lg focus-visible:ring-primary/30">
                  <SelectValue placeholder="Select Parent Category (Optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Top-Level Category)</SelectItem>
                  {parentOptions.map((cat) => (
                    <SelectItem key={cat?._id} value={cat?._id}>
                      {cat?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Description{" "}
            <span className="text-[10px] font-normal text-zinc-400">(Optional)</span>
          </label>
          <Textarea
            placeholder="Brief description of this category"
            rows={3}
            {...register("description")}
            className="text-sm bg-white dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 rounded-lg focus-visible:ring-primary/30 resize-none"
          />
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
          disabled={createCategoryMutation.isPending}
          className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-9 rounded-lg gap-1.5 shadow-sm"
        >
          {createCategoryMutation.isPending ? "Creating..." : "Create Category"}
        </Button>
      </div>
    </form>
  );
};

export default CreateCategoryForm;
