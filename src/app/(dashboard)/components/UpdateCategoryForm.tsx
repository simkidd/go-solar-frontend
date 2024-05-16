"use client";
import { Category, UpdateCategoryInput } from "@/interfaces/product.interface";
import { useProductStore } from "@/lib/stores/product.store";
import { Button } from "@nextui-org/react";
import React, { useState } from "react";

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

    await updateCategory(input);
    onClose();
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="title">Category name</label>
        <input
          type="text"
          id="title"
          className="w-full border focus:outline-none focus:border-primary focus:border h-10 py-2 px-3 bg-transparent mt-1"
          value={input?.name}
          onChange={(e) => setInput({ ...input, name: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="description">Category description</label>
        <textarea
          name=""
          id="description"
          className="w-full border focus:outline-none focus:border-primary focus:border h-10 py-2 px-3 bg-transparent min-h-20 mt-1 resize-none"
          value={input?.description}
          onChange={(e) => setInput({ ...input, description: e.target.value })}
        ></textarea>
      </div>
      <div className="flex items-center gap-2 mt-8 mb-4 justify-end">
        <Button
          variant="light"
          color="default"
          className="rounded-md"
          onPress={onClose}
        >
          Close
        </Button>
        <Button
          variant="solid"
          color="primary"
          type="submit"
          className="rounded-md "
          isDisabled={loading}
          isLoading={loading}
        >
          Save
        </Button>
      </div>
    </form>
  );
};

export default UpdateCategoryForm;
