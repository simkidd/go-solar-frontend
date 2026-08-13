"use client";
import React, { useState } from "react";
import AppModal from "@/components/AppModal";
import { Button } from "@/components/ui/button";
import CreateCategoryForm from "./CreateCategoryForm";
import { Plus } from "lucide-react";

const CreateCategoryButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <AppModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title="New Category"
        isDismissable={false}
        hideCloseButton
      >
        <CreateCategoryForm onClose={() => setIsOpen(false)} />
      </AppModal>

      <Button
        onClick={() => setIsOpen(true)}
        className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-9 rounded-lg gap-1.5 shadow-sm"
      >
        <Plus className="h-4 w-4" />
        Add Category
      </Button>
    </div>
  );
};

export default CreateCategoryButton;
