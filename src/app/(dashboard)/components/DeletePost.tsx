"use client";
import React, { useState } from "react";
import { Post } from "@/interfaces/post.interface";
import { useDeleteBlogPostMutation } from "@/hooks/mutations/useBlogMutations";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import AppModal from "../../../components/AppModal";

const DeletePost: React.FC<{ post: Post }> = ({ post }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AppModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title="Confirmation"
        isDismissable={false}
        hideCloseButton
      >
        <DeletePopup onClose={() => setIsOpen(false)} post={post} />
      </AppModal>
      <Button
        variant="destructive"
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        <Trash className="h-4 w-4" />
        Delete
      </Button>
    </>
  );
};

export default DeletePost;

export const DeletePopup: React.FC<{
  post: Post;
  onClose: () => void;
}> = ({ post, onClose }) => {
  const deleteBlogMutation = useDeleteBlogPostMutation({ onSuccess: onClose });

  const handleDelete = () => {
    deleteBlogMutation.mutate(post._id);
  };

  return (
    <div className="flex flex-col pt-2 font-inter">
      <p className="text-sm text-zinc-600 dark:text-zinc-300">
        Are you sure you want to delete <b>{post?.title}</b>?
      </p>
      <div className="flex items-center gap-2 mt-8 mb-4 ms-auto">
        <Button variant="ghost" onClick={onClose} className="dark:text-zinc-300">
          Cancel
        </Button>
        <Button
          variant="destructive"
          disabled={deleteBlogMutation.isPending}
          onClick={handleDelete}
        >
          {deleteBlogMutation.isPending ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  );
};
