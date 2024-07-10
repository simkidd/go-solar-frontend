"use client";
import MultipleSelectChip from "@/components/MultipleSelectChip";
import { CreatePostInput } from "@/interfaces/post.interface";
import { useBlogStore } from "@/lib/stores/blog.store";
import { Button, Input, Textarea } from "@nextui-org/react";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { GrCloudUpload } from "react-icons/gr";
import { toast } from "react-toastify";

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
    <div key={file.name} className="relative m-2 w-28 h-28">
      <Image
        src={file.preview}
        alt={file.name}
        className="w-full h-full object-cover rounded-lg"
        width={80}
        height={80}
        onLoad={() => {
          URL.revokeObjectURL(file.preview);
        }}
      />
      <button
        type="button"
        className="absolute top-1 right-1 bg-white text-red-600 rounded-full p-1"
        onClick={() => {
          setFile(null);
          setInput((prevInput) => ({
            ...prevInput,
            image: "",
          }));
        }}
      >
        <Trash2 size={16} />
      </button>
    </div>
  ) : null;

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
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
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="flex flex-col">
        <div className="mb-3">
          <Input
            type="text"
            label="Title"
            labelPlacement="outside"
            placeholder="Enter post title"
            value={input.title}
            onChange={(e) => setInput({ ...input, title: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <Textarea
            label="Content"
            labelPlacement="outside"
            placeholder="Enter post content here..."
            value={input.content}
            onChange={(e) => setInput({ ...input, content: e.target.value })}
            minRows={8}
            maxRows={15}
          />
        </div>

        <div className="mb-3">
          <MultipleSelectChip
            tags={tagsList}
            label="Tags"
            selectedTags={input.tags}
            onTagChange={handleTagChange}
          />
        </div>

        <div></div>
        <div className="mb-3">
          <Input
            type="text"
            label="Author"
            labelPlacement="outside"
            placeholder="Enter author name"
            value={input.author}
            onChange={(e) => setInput({ ...input, author: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="" className="">
            Images
          </label>
          <div
            {...getRootProps({
              className:
                "w-full h-40 border-dashed border-1 border-gray-300 dark:border-gray-700 p-4 rounded-lg mt-1 cursor-pointer flex items-center justify-center bg-[#f4f4f5] dark:bg-[#27272A]",
            })}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the file here ...</p>
            ) : file ? (
              thumb
            ) : (
              <div className="flex flex-col items-center">
                <GrCloudUpload size={50} />
                <p className="text-sm">
                  Drag & drop a file here, or click to select a file
                </p>
                <em className="text-[12px]">(Only 1 image allowed)</em>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-8 mb-4 justify-end">
          <Button variant="light" color="default" onPress={onClose}>
            Close
          </Button>
          <Button
            variant="solid"
            color="primary"
            type="submit"
            isDisabled={loading}
            isLoading={loading}
          >
            Create
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CreateBlogPostForm;
