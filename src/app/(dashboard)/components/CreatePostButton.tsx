"use client";
import React, { useState } from "react";
import AppModal from "@/components/AppModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateBlogPostForm from "./CreateBlogPostForm";

const CreatePostButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <AppModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title="New Post"
        isDismissable={false}
        hideCloseButton
        size="2xl"
        scrollBehavior="inside"
      >
        <CreateBlogPostForm onClose={() => setIsOpen(false)} />
      </AppModal>

      <Button
        onClick={() => setIsOpen(true)}
        className="gap-2 bg-primary hover:bg-primary/95 text-white"
      >
        <Plus size={16} />
        Add Post
      </Button>
    </div>
  );
};

export default CreatePostButton;
