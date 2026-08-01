"use client";
import React, { useState } from "react";
import MultipleSelectChip from "@/components/MultipleSelectChip";
import { Post, UpdatePostInput } from "@/interfaces/post.interface";
import { useBlogStore } from "@/lib/stores/blog.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const tagsList = [
  "HBL OPTIMUZ",
  "200AH/12V",
  "Inverter Battery",
  "Power Storage",
  "Energy Storage",
  "Battery Technology",
  "Lead-Acid Battery",
  "Maintenance-Free Battery",
  "Renewable Energy",
  "Energy Storage Solutions",
  "Advanced Battery Technology",
  "Lead-Acid Battery Technology",
  "Energy Efficiency",
  "Smart Energy Solutions",
  "Power Electronics",
  "Electrical Systems",
  "Renewable Energy Technologies",
  "Sustainable Living",
  "Green Technology",
  "Environmental Sustainability",
  "Clean Energy Solutions",
  "Carbon Footprint Reduction",
  "Climate Change Mitigation",
  "Product Reviews",
  "Technology Innovations",
  "Industry Trends",
  "Business Solutions",
  "Energy Management",
  "Cost Savings",
  "Economic Impact",
];

const UpdateBlogPostForm: React.FC<{
  post: Post;
  onClose: () => void;
}> = ({ post, onClose }) => {
  const { loading, updatePost } = useBlogStore();
  const [input, setInput] = useState<UpdatePostInput>({
    id: post?._id,
    title: post?.title,
    content: post?.content,
    author: post?.author,
    tags: post?.tags,
    image: post?.image,
  });
  const [imagePreview, setImagePreview] = useState<string | File>(
    input?.image || ""
  );
  const router = useRouter();

  const handleTagChange = (tags: string[]) => {
    setInput({
      ...input,
      tags: tags,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files?.length) return;
    const file = files[0];

    const extension = file.name.split(".").pop()?.toLowerCase();
    if (
      !extension ||
      (extension !== "jpg" && extension !== "jpeg" && extension !== "png")
    ) {
      alert("Please select a PNG or JPEG image file.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("Please select an image file smaller than 5MB.");
      return;
    }

    setImagePreview(file);
    setInput({
      ...input,
      image: file,
    });
  };

  const removeImage = () => {
    setInput({
      ...input,
      image: "",
    });
    setImagePreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("blogId", input.id);
    formData.append("title", input.title);
    formData.append("content", input.content);
    formData.append("author", input.author);
    formData.append("tags", JSON.stringify(input.tags));
    formData.append("blogImage", input.image as Blob);

    const config = { headers: { "Content-Type": "multipart/form-data" } };

    await updatePost(formData, config);
    onClose();
  };

  return (
    <form className="w-full font-inter space-y-4 pt-2" onSubmit={handleSubmit}>
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Title</label>
        <Input
          type="text"
          placeholder="Enter post title"
          value={input.title}
          onChange={(e) => setInput({ ...input, title: e.target.value })}
          className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Content</label>
        <Textarea
          placeholder="Enter post content here..."
          value={input.content}
          onChange={(e) => setInput({ ...input, content: e.target.value })}
          rows={8}
          className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
          required
        />
      </div>

      <div className="space-y-1.5">
        <MultipleSelectChip
          tags={tagsList}
          label="Select tags"
          selectedTags={input.tags}
          onTagChange={handleTagChange}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Author</label>
        <Input
          type="text"
          placeholder="Enter author name"
          value={input.author}
          onChange={(e) => setInput({ ...input, author: e.target.value })}
          className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Image</label>
        <div className="flex gap-3 items-center flex-wrap">
          {/* Upload Button */}
          <div className="h-20 w-20 rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-primary/50 transition-colors flex items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/10 cursor-pointer relative">
            <label htmlFor="image-update" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
              <Upload className="h-4 w-4 text-zinc-400" />
              <span className="text-xs text-zinc-400 mt-1">Upload</span>
            </label>
            <input
              type="file"
              id="image-update"
              className="hidden"
              onChange={handleImageUpload}
              accept="image/*"
            />
          </div>

          {/* Selected Image Preview */}
          {imagePreview && (
            <div className="h-20 w-20 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 relative group">
              <Image
                src={
                  typeof imagePreview === "string"
                    ? imagePreview
                    : URL.createObjectURL(imagePreview)
                }
                alt="Preview"
                className="w-full h-full object-cover"
                width={80}
                height={80}
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={removeImage}
                  className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )}
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
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
};

export default UpdateBlogPostForm;
