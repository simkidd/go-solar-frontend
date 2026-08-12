"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import MultipleSelectChip from "@/components/MultipleSelectChip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Upload } from "lucide-react";
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
    defaultValues: {
      title: "",
      content: "",
      author: "",
      tags: [],
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(
        Object.assign(selectedFile, {
          preview: URL.createObjectURL(selectedFile),
        })
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
    accept: { "image/jpeg": [], "image/png": [] },
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
    formData.append("author", values.author);
    formData.append("tags", JSON.stringify(values.tags || []));
    formData.append("image", file);

    createBlogMutation.mutate(formData);
  };

  return (
    <form className="w-full font-inter space-y-6 pt-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full grid lg:grid-cols-2 grid-cols-1 gap-6">
        <div className="space-y-4">
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
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Featured Image</label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl py-8 px-4 flex flex-col items-center justify-center cursor-pointer transition-all bg-zinc-50/50 dark:bg-zinc-900/10 hover:bg-zinc-100/50 ${
                isDragActive ? "border-primary bg-primary/5" : "border-zinc-200 dark:border-zinc-800"
              }`}
            >
              <input {...getInputProps()} />
              {file ? (
                <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-zinc-200">
                  <Image src={file.preview} alt="preview" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="absolute top-1 right-1 bg-white/90 text-red-600 rounded-full p-1 shadow-sm"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center space-y-1">
                  <Upload className="h-5 w-5 text-zinc-400" />
                  <p className="text-xs text-zinc-500">Drag & drop or browse image</p>
                </div>
              )}
            </div>
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
        </div>
      </div>

      <div className="flex items-center gap-2 mt-8 justify-end">
        <Button type="button" variant="ghost" onClick={onClose} className="dark:text-zinc-300">
          Close
        </Button>
        <Button
          type="submit"
          disabled={createBlogMutation.isPending}
          className="bg-primary hover:bg-primary/95 text-white"
        >
          {createBlogMutation.isPending ? "Publishing..." : "Publish Post"}
        </Button>
      </div>
    </form>
  );
};

export default CreateBlogPostForm;
