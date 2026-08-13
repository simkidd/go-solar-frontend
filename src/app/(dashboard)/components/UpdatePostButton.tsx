"use client";
import React, { useState } from "react";
import AppModal from "@/components/AppModal";
import { Post } from "@/interfaces/post.interface";
import { Button } from "@/components/ui/button";
import UpdateBlogPostForm from "./UpdateBlogPostForm";
import { Edit } from "lucide-react";

const UpdatePostButton: React.FC<{ post: Post }> = ({ post }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <AppModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title="Update Post"
        isDismissable={false}
        hideCloseButton
        size="2xl"
        scrollBehavior="inside"
      >
        <UpdateBlogPostForm onClose={() => setIsOpen(false)} post={post} />
      </AppModal>

      <Button
        onClick={() => setIsOpen(true)}
        className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-9 rounded-lg gap-1.5 shadow-sm"
      >
        <Edit className="h-4 w-4" />
        Update
      </Button>
    </div>
  );
};

export default UpdatePostButton;
