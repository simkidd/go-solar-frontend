"use client";
import React, { useCallback, useEffect, useState } from "react";
import MultipleSelectChip from "@/components/MultipleSelectChip";
import { CreatePostInput } from "@/interfaces/post.interface";
import { useBlogStore } from "@/lib/stores/blog.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface FileWithPreview extends File {
  preview: string;
}

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

const CreateBlogPostForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { loading, createPost } = useBlogStore();
  const [input, setInput] = useState<CreatePostInput>({
    title: "",
    content: "",
    author: "",
    tags: [],
    image: "",
  });
  const [file, setFile] = useState<FileWithPreview | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 1) {
      toast.info("You can only upload one image");
      return;
    }

    const newFile = Object.assign(acceptedFiles[0], {
      preview: URL.createObjectURL(acceptedFiles[0]),
    });

    setFile(newFile);
    setInput((prevInput) => ({
      ...prevInput,
      image: newFile,
    }));
  }, []);

  const thumb = file ? (
    <div key={file.name} className="relative w-28 h-28 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
      <Image
        src={file.preview}
        alt={file.name}
        className="w-full h-full object-cover"
        width={112}
        height={112}
        onLoad={() => {
          URL.revokeObjectURL(file.preview);
        }}
      />
      <button
        type="button"
        className="absolute top-1 right-1 bg-white/90 text-red-600 rounded-full p-1 shadow-sm"
        onClick={() => {
          setFile(null);
          setInput((prevInput) => ({
            ...prevInput,
            image: "",
          }));
        }}
      >
        <Trash2 size={14} />
      </button>
    </div>
  ) : null;

  useEffect(() => {
    return () => {
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
    };
  }, [file]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    multiple: false,
  });

  const handleTagChange = (tags: string[]) => {
    setInput({
      ...input,
      tags,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", input.title);
    formData.append("content", input.content);
    formData.append("author", input.author);
    formData.append("tags", JSON.stringify(input.tags));
    formData.append("blogImage", input.image as Blob);

    const config = { headers: { "Content-Type": "multipart/form-data" } };

    await createPost(formData, config);

    if (!input.title || !input.content || !input.tags || !input.author) {
      return;
    } else {
      onClose();
    }
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
          label="Tags"
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
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Feature Image</label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl py-10 px-4 flex flex-col items-center justify-center cursor-pointer transition-all bg-zinc-50/50 dark:bg-zinc-900/10 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/10 ${
            isDragActive ? "border-primary bg-primary/5" : "border-zinc-200 dark:border-zinc-800"
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-primary text-sm font-medium">Drop the file here ...</p>
          ) : file ? (
            thumb
          ) : (
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <Upload className="h-5 w-5 text-zinc-400" />
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Drag & drop image here, or <span className="text-primary font-medium">browse</span>
              </p>
              <p className="text-xs text-zinc-400">(Only 1 image allowed)</p>
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
          {loading ? "Creating..." : "Create"}
        </Button>
      </div>
    </form>
  );
};

export default CreateBlogPostForm;
