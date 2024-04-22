"use client";
import { useProduct } from "@/contexts/product.context";
import React, { useState } from "react";
import { CreateCategoryInput } from "@/interfaces/product.interface";

const CreateCategoryForm = () => {
  const { loading, createCategory } = useProduct();
  const [input, setInput] = useState<CreateCategoryInput>({
    name: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createCategory(input);
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
      <button className="bg-primary text-white px-6 py-2">
        {loading ? "Loading..." : "Add category"}
      </button>
    </form>
  );
};

export default CreateCategoryForm;
