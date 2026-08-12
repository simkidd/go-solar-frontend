"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import MultipleSelectChip from "@/components/MultipleSelectChip";
import { Post } from "@/interfaces/post.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateBlogPostMutation } from "@/hooks/mutations/useBlogMutations";

const tagsList = [
  "Inverter Battery",
  "Solar Panels",
  "Power Storage",
  "Energy Storage",
  "Battery Technology",
  "Lithium Battery",
  "Renewable Energy",
  "Energy Storage Solutions",
  "Hybrid Inverters",
  "Clean Energy Solutions",
  "Carbon Footprint Reduction",
  "Smart Energy Solutions",
  "Product Reviews",
  "Industry Trends",
];

interface FormValues {
  title: string;
  content: string;
  author: string;
  tags: string[];
}

const UpdateBlogPostForm: React.FC<{
  post: Post;
  onClose: () => void;
}> = ({ post, onClose }) => {
  const updateBlogMutation = useUpdateBlogPostMutation({ onSuccess: onClose });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      author: post?.author || "",
      tags: post?.tags || [],
    },
  });

  const onSubmit = (values: FormValues) => {
    if (!post?._id) return;
    updateBlogMutation.mutate({
      id: post._id,
      title: values.title,
      content: values.content,
      author: values.author,
      tags: values.tags,
    });
  };

  return (
    <form className="w-full font-inter space-y-4 pt-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Title <span className="text-red-500">*</span>
        </label>
        <Input
          placeholder="Enter post title"
          {...register("title", { required: "Title is required" })}
          className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
        />
        {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Author <span className="text-red-500">*</span>
        </label>
        <Input
          placeholder="Author name"
          {...register("author", { required: "Author name is required" })}
          className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
        />
        {errors.author && <p className="text-xs text-red-500">{errors.author.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Tags</label>
        <Controller
          control={control}
          name="tags"
          render={({ field }) => (
            <MultipleSelectChip
              tags={tagsList}
              label="Select Tags"
              selectedTags={field.value || []}
              onTagChange={field.onChange}
            />
          )}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Content <span className="text-red-500">*</span>
        </label>
        <Textarea
          placeholder="Enter post content"
          rows={6}
          {...register("content", { required: "Content is required" })}
          className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
        />
        {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
      </div>

      <div className="flex items-center gap-2 mt-8 justify-end">
        <Button type="button" variant="ghost" onClick={onClose} className="dark:text-zinc-300">
          Close
        </Button>
        <Button
          type="submit"
          disabled={updateBlogMutation.isPending}
          className="bg-primary hover:bg-primary/95 text-white"
        >
          {updateBlogMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default UpdateBlogPostForm;
