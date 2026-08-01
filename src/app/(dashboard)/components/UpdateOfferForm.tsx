"use client";
import React, { useState } from "react";
import {
  Offer,
  OfferType,
  UpdateOfferInput,
} from "@/interfaces/product.interface";
import { useProductStore } from "@/lib/stores/product.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const UpdateOfferForm: React.FC<{
  onClose: () => void;
  existingOffer?: Offer;
}> = ({ onClose, existingOffer }) => {
  const { loading, updateOffer } = useProductStore();
  const [input, setInput] = useState<UpdateOfferInput>({
    name: existingOffer?.name || "",
    description: existingOffer?.description || "",
    type: existingOffer?.type as OfferType,
    percentageOff: existingOffer?.percentageOff || 0,
    priceSlash: existingOffer?.priceSlash || 0,
    isActive: existingOffer?.isActive,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateOffer(input, existingOffer?._id as string);
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

      {/* Switch Toggle */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          role="switch"
          aria-checked={input.isActive}
          onClick={() => setInput({ ...input, isActive: !input.isActive })}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
            input.isActive ? "bg-primary" : "bg-zinc-200 dark:bg-zinc-850"
          }`}
        >
          <span
            className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${
              input.isActive ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Activate Offer
        </span>
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

export default UpdateOfferForm;
