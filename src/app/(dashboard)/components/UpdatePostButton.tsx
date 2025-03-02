"use client";
import AppModal from "@/components/AppModal";
import { Post } from "@/interfaces/post.interface";
import { Button, useDisclosure } from "@heroui/react";
import React from "react";
import UpdateBlogPostForm from "./UpdateBlogPostForm";
import { Edit } from "lucide-react";

const UpdatePostButton: React.FC<{ post: Post }> = ({ post }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <div>
      <AppModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Update Post"
        isDismissable={false}
        hideCloseButton
        size="2xl"
        scrollBehavior="inside"
      >
        <UpdateBlogPostForm onClose={onClose} post={post} />
      </AppModal>

      <Button
        variant="solid"
        color="primary"
        type="submit"
        startContent={<Edit size={16} />}
        onPress={onOpen}
      >
        Update
      </Button>
    </div>
  );
};

export default UpdatePostButton;
