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
  const { data: catRes } = useCategoriesQuery({ page: 1, limit: 1000 });
  const categories = catRes?.categories || [];
  const updateCategoryMutation = useUpdateCategoryMutation({
    onSuccess: onClose,
  });

  const parentId =
    typeof category?.parent === "object"
      ? category?.parent?._id
      : category?.parent;

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

  const parentOptions = categories.filter(
    (c: any) => !c.parent && c._id !== category._id,
  );

  return (
    <form
      className="w-full font-inter flex flex-col gap-6 pt-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Details Section */}
      <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
        <div className="border-b border-border/60 pb-3 select-none">
          <h3 className="text-sm font-extrabold text-foreground tracking-tight">
            Category Details
          </h3>
          <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
            Configure core catalog taxonomy name, description, and hierarchy
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
            Category Name <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="e.g., Solar Panels"
            {...register("name", { required: "Category name is required" })}
            className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
          />
          {errors.name && (
            <p className="text-xs text-red-500 font-semibold mt-0.5">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
            Parent Category{" "}
            <span className="text-[10px] font-normal text-muted-foreground/60">
              (Leave empty for top-level)
            </span>
          </label>
          <Controller
            control={control}
            name="parent"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary">
                  <SelectValue placeholder="Select Parent Category (Optional)" />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-card border border-border/80">
                  <SelectItem
                    value="none"
                    className="text-xs cursor-pointer font-bold"
                  >
                    None (Top-Level Category)
                  </SelectItem>
                  {parentOptions.map((cat) => (
                    <SelectItem
                      key={cat?._id}
                      value={cat?._id}
                      className="text-xs cursor-pointer font-bold"
                    >
                      {cat?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
            Description{" "}
            <span className="text-[10px] font-normal text-muted-foreground/60">
              (Optional)
            </span>
          </label>
          <Textarea
            placeholder="Brief description of this category..."
            rows={4}
            {...register("description")}
            className="bg-muted/30 border-border rounded-xl text-xs focus-visible:ring-primary min-h-[100px] resize-none"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60 select-none">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground text-xs font-bold h-10 px-4 rounded-xl cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={updateCategoryMutation.isPending}
          className="bg-primary text-primary-foreground text-xs font-bold h-10 px-6 rounded-xl cursor-pointer shadow-xs hover:bg-primary/95 transition-all text-white"
        >
          {updateCategoryMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default UpdateCategoryForm;
