"use client";
import { CreateCategoryInput } from "@/interfaces/product.interface";
import { useProductStore } from "@/lib/stores/product.store";
import { Button, Input, Textarea } from "@nextui-org/react";
import React, { useState } from "react";
import { toast } from "react-toastify";

const CreateCategoryForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { loading, createCategory } = useProductStore();
  const [input, setInput] = useState<CreateCategoryInput>({
    name: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (input.description === "") {
      toast.info("Description is required");
      return;
    }

    await createCategory(input);
    onClose();
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="mb-3">
        <Input
          type="text"
          label="Name"
          labelPlacement="outside"
          placeholder="Enter category name"
          value={input.name}
          onChange={(e) => setInput({ ...input, name: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <Textarea
          label="Description"
          labelPlacement="outside"
          placeholder="Enter category description"
          value={input.description}
          onChange={(e) => setInput({ ...input, description: e.target.value })}
          minRows={4}
          maxRows={8}
        />
      </div>
      <div className="flex items-center gap-2 mt-8 mb-4 justify-end">
        <Button variant="light" color="default" onPress={onClose}>
          Close
        </Button>
        <Button
          variant="solid"
          color="primary"
          type="submit"
          isDisabled={loading}
          isLoading={loading}
        >
          Create
        </Button>
      </div>
    </form>
  );
};

export default CreateCategoryForm;
