"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Category } from "@/interfaces/product.interface";
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
import { useUpdateCategoryMutation } from "@/hooks/mutations/useCategoryMutations";

interface FormValues {
  name: string;
  description: string;
  parent?: string;
}

const UpdateCategoryForm: React.FC<{
  category: Category & { parent?: any };
  onClose: () => void;
}> = ({ category, onClose }) => {
  const { data: categories = [] } = useCategoriesQuery();
  const updateCategoryMutation = useUpdateCategoryMutation({ onSuccess: onClose });

  const parentId = typeof category?.parent === "object" ? category?.parent?._id : category?.parent;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      parent: parentId || "none",
    },
  });

  const onSubmit = (values: FormValues) => {
    updateCategoryMutation.mutate({
      categoryId: category._id,
      name: values.name,
      description: values.description,
      parent: values.parent === "none" ? null : values.parent,
    });
  };

  // Exclude current category from parent list
  const parentOptions = categories.filter(
    (c: any) => !c.parent && c._id !== category._id
  );

  return (
    <form className="w-full space-y-4 pt-2 font-inter" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Name <span className="text-red-500">*</span>
        </label>
        <Input
          placeholder="Enter category name"
          {...register("name", { required: "Category name is required" })}
          className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Parent Category <span className="text-xs text-zinc-400 font-normal">(Leave empty for top-level)</span>
        </label>
        <Controller
          control={control}
          name="parent"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800">
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
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Description</label>
        <Textarea
          placeholder="Enter category description"
          rows={4}
          {...register("description")}
          className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
        />
      </div>

      <div className="flex items-center gap-2 mt-8 justify-end">
        <Button type="button" variant="ghost" onClick={onClose} className="dark:text-zinc-300">
          Close
        </Button>
        <Button
          type="submit"
          disabled={updateCategoryMutation.isPending}
          className="bg-primary hover:bg-primary/95 text-white"
        >
          {updateCategoryMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
};

export default UpdateCategoryForm;
