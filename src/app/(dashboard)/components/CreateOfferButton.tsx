"use client";
import React, { useState } from "react";
import AppModal from "@/components/AppModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateOfferForm from "./CreateOfferForm";

const CreateOfferButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <AppModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title="Create Offer"
        isDismissable={false}
        hideCloseButton
        size="xl"
        scrollBehavior="inside"
      >
        <CreateOfferForm onClose={() => setIsOpen(false)} />
      </AppModal>

      <Button
        onClick={() => setIsOpen(true)}
        className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-9 rounded-lg gap-1.5 shadow-sm"
      >
        <Plus className="h-4 w-4" />
        Add Offer
      </Button>
    </div>
  );
};

export default CreateOfferButton;
