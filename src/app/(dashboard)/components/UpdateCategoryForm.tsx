"use client";
import React, { useState } from "react";
import { Category, UpdateCategoryInput } from "@/interfaces/product.interface";
import { useProductStore } from "@/lib/stores/product.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const UpdateCategoryForm: React.FC<{
  category: Category;
  onClose: () => void;
}> = ({ category, onClose }) => {
  const { loading, updateCategory } = useProductStore();
  const [input, setInput] = useState<UpdateCategoryInput>({
    categoryId: category?._id,
    name: category?.name,
    description: category?.description,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (input.description === "") {
      toast.info("Description is required");
      return;
    }

    await updateCategory(input);
    onClose();
  };

  return (
    <form className="w-full space-y-4 pt-2 font-inter" onSubmit={handleSubmit}>
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Name</label>
        <Input
          type="text"
          placeholder="Enter category name"
          value={input.name}
          onChange={(e) => setInput({ ...input, name: e.target.value })}
          className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
          required
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Description</label>
        <Textarea
          placeholder="Enter category description"
          value={input.description}
          onChange={(e) => setInput({ ...input, description: e.target.value })}
          rows={4}
          className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
          required
        />
      </div>
      <div className="flex items-center gap-2 mt-8 justify-end">
        <Button type="button" variant="ghost" onClick={onClose} className="dark:text-zinc-300">
          Close
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary/95 text-white"
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
};

export default UpdateCategoryForm;
