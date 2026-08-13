"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import MultipleSelectChip from "@/components/MultipleSelectChip";
import { Post } from "@/interfaces/post.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";
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
    <form className="w-full font-inter flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <ScrollArea className="flex-1 max-h-[70vh]">
        <div className="space-y-4 pr-4 pt-2">

          {/* Post Details Section */}
          <div className="rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/20 p-4 space-y-4">
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
              <FileText className="h-3 w-3" /> Post Details
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter post title"
                {...register("title", { required: "Title is required" })}
                className="h-9 text-sm bg-white dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 rounded-lg focus-visible:ring-primary/30"
              />
              {errors.title && <p className="text-xs text-red-500 mt-0.5">{errors.title.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Author <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Author name"
                {...register("author", { required: "Author name is required" })}
                className="h-9 text-sm bg-white dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 rounded-lg focus-visible:ring-primary/30"
              />
              {errors.author && <p className="text-xs text-red-500 mt-0.5">{errors.author.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Tags <span className="text-[10px] font-normal text-zinc-400">(Optional)</span>
              </label>
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
          </div>

          {/* Content Section */}
          <div className="rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/20 p-4 space-y-4">
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              Content
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Body <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="Write your post content here..."
                rows={7}
                {...register("content", { required: "Content is required" })}
                className="text-sm bg-white dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 rounded-lg focus-visible:ring-primary/30 resize-none"
              />
              {errors.content && <p className="text-xs text-red-500 mt-0.5">{errors.content.message}</p>}
            </div>
          </div>

        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <Button type="button" variant="ghost" size="sm" onClick={onClose} className="h-9 text-xs dark:text-zinc-300">
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={updateBlogMutation.isPending}
          className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-9 rounded-lg gap-1.5 shadow-sm"
        >
          {updateBlogMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default UpdateBlogPostForm;
