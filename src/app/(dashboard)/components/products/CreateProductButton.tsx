"use client";
import React, { useState } from "react";
import AppModal from "@/components/AppModal";
import { Button } from "@/components/ui/button";
import CreateProductForm from "./CreateProductForm";
import { Plus } from "lucide-react";

const CreateProductButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <AppModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title="New Product"
        isDismissable={false}
        hideCloseButton
        size="4xl"
        scrollBehavior="inside"
      >
        <CreateProductForm onClose={() => setIsOpen(false)} />
      </AppModal>

      <Button
        onClick={() => setIsOpen(true)}
        className="gap-2 bg-primary hover:bg-primary/95 text-white"
      >
        <Plus size={16} />
        Add Product
      </Button>
    </div>
  );
};

export default CreateProductButton;
