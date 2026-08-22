"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import MultipleSelectChip from "@/components/MultipleSelectChip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, ImageIcon, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useCreateBlogPostMutation } from "@/hooks/mutations/useBlogMutations";
import RichTextEditor from "@/components/RichTextEditor";
import { Switch } from "@/components/ui/switch";

interface FileWithPreview extends File {
  preview: string;
}

const tagsList = [
  "Solar Energy",
  "Batteries",
  "Inverters",
  "Solar Installation",
  "Maintenance",
  "Buying Guides",
  "Renewable Energy",
];

interface FormValues {
  title: string;
  content: string;
  author: string;
  tags: string[];
  excerpt?: string;
  isPublished?: boolean;
}

const CreateBlogPostForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const createBlogMutation = useCreateBlogPostMutation({ onSuccess: onClose });
  const [file, setFile] = useState<FileWithPreview | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { title: "", content: "", author: "", tags: [], excerpt: "", isPublished: true },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(
        Object.assign(selectedFile, {
          preview: URL.createObjectURL(selectedFile),
        }),
      );
    }
  }, []);

  useEffect(() => {
    return () => {
      if (file) URL.revokeObjectURL(file.preview);
    };
  }, [file]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    multiple: false,
  });

  const onSubmit = (values: FormValues) => {
    if (!file) {
      toast.error("Please upload a featured image");
      return;
    }
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("content", values.content);
    formData.append("excerpt", values.excerpt || "");
    formData.append("author", values.author);
    formData.append("tags", JSON.stringify(values.tags || []));
    formData.append("isPublished", String(values.isPublished ?? true));
    formData.append("image", file);
    createBlogMutation.mutate(formData);
  };

  return (
    <form
      className="w-full font-inter flex flex-col gap-5 pt-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Card 1: Editorial Information */}
      <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
        <div className="border-b border-border/60 pb-3 select-none">
          <h3 className="text-sm font-extrabold text-foreground tracking-tight">
            Editorial Information
          </h3>
          <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
            Specify editorial details like title, author, and category tags
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
            Post Title <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="e.g., Guide to Choosing Solar Battery Storage"
            {...register("title", { required: "Title is required" })}
            className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
          />
          {errors.title && (
            <span className="text-[11px] font-bold text-red-500 mt-0.5 block">
              {errors.title.message}
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
            Short Excerpt / Summary <span className="text-[10px] font-normal text-muted-foreground/60">(Optional)</span>
          </label>
          <Textarea
            placeholder="Write a brief summary of the post for card listings and SEO..."
            rows={2}
            {...register("excerpt")}
            className="bg-muted/30 border-border rounded-xl text-xs focus-visible:ring-primary resize-none min-h-[60px]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
            Author <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Author name"
            {...register("author", { required: "Author name is required" })}
            className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
          />
          {errors.author && (
            <span className="text-[11px] font-bold text-red-500 mt-0.5 block">
              {errors.author.message}
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
            Category Tags
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

        <div className="flex items-center gap-3 pt-3">
          <Controller
            control={control}
            name="isPublished"
            render={({ field }) => (
              <Switch
                id="isPublished"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <label
            htmlFor="isPublished"
            className="text-xs font-bold text-zinc-700 dark:text-zinc-300 select-none cursor-pointer"
          >
            Publish Immediately (Visible to users)
          </label>
        </div>
      </div>

      {/* Card 2: Post Content & Media */}
      <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
        <div className="border-b border-border/60 pb-3 select-none">
          <h3 className="text-sm font-extrabold text-foreground tracking-tight">
            Post Content & Media
          </h3>
          <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
            Write article content and upload a featured cover image
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
            Content Body <span className="text-red-500">*</span>
          </label>
          <Controller
            control={control}
            name="content"
            rules={{ required: "Content is required" }}
            render={({ field }) => (
              <RichTextEditor
                value={field.value || ""}
                onChange={field.onChange}
                placeholder="Write your post content here..."
                className="overflow-hidden rounded-xl border border-border"
              />
            )}
          />
          {errors.content && (
            <span className="text-[11px] font-bold text-red-500 mt-0.5 block">
              {errors.content.message}
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
            Featured Cover Image <span className="text-red-500">*</span>
          </label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl py-6 px-4 flex flex-col items-center justify-center cursor-pointer transition-all bg-muted/10 dark:bg-zinc-900/10 ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-border/80 hover:bg-muted/20"
            }`}
          >
            <input {...getInputProps()} />
            {file ? (
              <div className="relative w-36 aspect-video rounded-xl overflow-hidden border border-border">
                <Image
                  src={file.preview}
                  alt="preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="absolute top-1.5 right-1.5 bg-black/75 hover:bg-black text-white hover:text-red-400 rounded-full p-1 transition-colors cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center space-y-1.5">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <p className="text-xs font-semibold text-zinc-650 dark:text-zinc-300">
                  {isDragActive
                    ? "Drop image here..."
                    : "Drag & drop or click to browse"}
                </p>
                <p className="text-[10px] text-muted-foreground/60">
                  PNG, JPG or WebP supported
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/60">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-10 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={createBlogMutation.isPending}
          className="bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider rounded-xl h-10 px-6 shadow-sm cursor-pointer"
        >
          {createBlogMutation.isPending ? "Publishing..." : "Publish Post"}
        </Button>
      </div>
    </form>
  );
};

export default CreateBlogPostForm;
