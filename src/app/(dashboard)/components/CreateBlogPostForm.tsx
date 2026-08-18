"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import MultipleSelectChip from "@/components/MultipleSelectChip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, ImageIcon, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useCreateBlogPostMutation } from "@/hooks/mutations/useBlogMutations";

interface FileWithPreview extends File {
  preview: string;
}

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

const CreateBlogPostForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const createBlogMutation = useCreateBlogPostMutation({ onSuccess: onClose });
  const [file, setFile] = useState<FileWithPreview | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { title: "", content: "", author: "", tags: [] },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(Object.assign(selectedFile, { preview: URL.createObjectURL(selectedFile) }));
    }
  }, []);

  useEffect(() => {
    return () => { if (file) URL.revokeObjectURL(file.preview); };
  }, [file]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    multiple: false,
  });

  const onSubmit = (values: FormValues) => {
    if (!file) { toast.error("Please upload a featured image"); return; }
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("content", values.content);
    formData.append("author", values.author);
    formData.append("tags", JSON.stringify(values.tags || []));
    formData.append("image", file);
    createBlogMutation.mutate(formData);
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

          {/* Featured Image Section */}
          <div className="rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/20 p-4 space-y-3">
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
              <ImageIcon className="h-3 w-3" /> Featured Image
            </p>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl py-8 px-4 flex flex-col items-center justify-center cursor-pointer transition-all bg-white dark:bg-zinc-900/30 ${
                isDragActive ? "border-primary bg-primary/5" : "border-zinc-200 dark:border-zinc-800"
              }`}
            >
              <input {...getInputProps()} />
              {file ? (
                <div className="relative w-36 h-24 rounded-lg overflow-hidden border border-zinc-200">
                  <Image src={file.preview} alt="preview" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="absolute top-1 right-1 bg-white/90 text-red-600 rounded-full p-1 shadow-sm"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center space-y-1.5">
                  <Upload className="h-5 w-5 text-zinc-400" />
                  <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                    {isDragActive ? "Drop image here..." : "Drag & drop or click to browse"}
                  </p>
                  <p className="text-[10px] text-zinc-400">PNG, JPG or WebP supported</p>
                </div>
              )}
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
          disabled={createBlogMutation.isPending}
          className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-9 rounded-lg gap-1.5 shadow-sm"
        >
          {createBlogMutation.isPending ? "Publishing..." : "Publish Post"}
        </Button>
      </div>
    </form>
  );
};

export default CreateBlogPostForm;
