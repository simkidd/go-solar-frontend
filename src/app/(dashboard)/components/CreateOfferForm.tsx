"use client";
import React, { useState } from "react";
import { CreateOfferInput, OfferType } from "@/interfaces/product.interface";
import { useProductStore } from "@/lib/stores/product.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const CreateOfferForm: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const { loading, createOffer } = useProductStore();
  const [input, setInput] = useState<CreateOfferInput>({
    name: "",
    description: "",
    type: OfferType.PercentageOff,
    percentageOff: 0,
    priceSlash: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createOffer(input);
    onClose();
  };

  return (
    <form className="w-full font-inter space-y-4 pt-2" onSubmit={handleSubmit}>
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Title</label>
        <Input
          type="text"
          placeholder="Enter offer name"
          value={input.name}
          onChange={(e) => setInput({ ...input, name: e.target.value })}
          className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Description</label>
        <Textarea
          placeholder="Enter offer description"
          value={input.description}
          onChange={(e) => setInput({ ...input, description: e.target.value })}
          rows={4}
          className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Percentage Off (%)</label>
          <div className="relative">
            <Input
              type="number"
              placeholder="Enter percentage off"
              value={input.percentageOff || ""}
              onChange={(e) => setInput({ ...input, percentageOff: Number(e.target.value) })}
              disabled={input.type !== OfferType.PercentageOff}
              className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800 pr-8"
              required
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">%</span>
          </div>
        </div>
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
          {loading ? "Creating..." : "Create"}
        </Button>
      </div>
    </form>
  );
};

export default CreateOfferForm;
