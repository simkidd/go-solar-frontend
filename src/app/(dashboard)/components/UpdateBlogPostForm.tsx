"use client";
import MultipleSelectChip from "@/components/MultipleSelectChip";
import { Post, UpdatePostInput } from "@/interfaces/post.interface";
import { useBlogStore } from "@/lib/stores/blog.store";
import { Button, Input, Textarea } from "@nextui-org/react";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { GrCloudUpload } from "react-icons/gr";
import { HiXMark } from "react-icons/hi2";
import NovelEditor from "./NovelEditor";

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
  // const [newTag, setNewTag] = useState("");
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

    // Check if the file type is PNG or JPEG
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (
      !extension ||
      (extension !== "jpg" && extension !== "jpeg" && extension !== "png")
    ) {
      alert("Please select a PNG or JPEG image file.");
      return;
    }

    // Check if the file size exceeds 5MB
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      alert("Please select an image file smaller than 5MB.");
      return;
    }

    setImagePreview(file);

    setInput({
      ...input,
      image: file,
    });

    // const reader = new FileReader();

    // reader.onloadend = () => {
    //   const imagePreviewUrl = reader.result as string;
    //   setImagePreview(imagePreviewUrl);
    //   setInput({
    //     ...input,
    //     image: reader.result as string,
    //   });
    // };
    // reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setInput({
      ...input,
      image: "",
    });

    // Clear the image preview
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
    <form className="w-full" onSubmit={handleSubmit}>
      <div>
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
          {/* <Textarea
            label="Content"
            labelPlacement="outside"
            placeholder="Enter post content here..."
            value={input.content}
            onChange={(e) => setInput({ ...input, content: e.target.value })}
            minRows={8}
            maxRows={15}
          /> */}

          <NovelEditor
            content={input.content}
            setContent={(content) => setInput({ ...input, content })}
          />
        </div>
        <div className="mb-3">
          <MultipleSelectChip
            tags={tagsList}
            label="Select tags"
            selectedTags={input.tags}
            onTagChange={handleTagChange}
          />
        </div>

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
          <div className="flex gap-2 flex-wrap mt-1">
            {/* upload button */}
            <div
              className="size-20 overflow-hidden rounded border hover:bg-gray-400 "
              style={{ transition: "background .3s ease" }}
            >
              <label htmlFor="image" className="cursor-pointer">
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <GrCloudUpload size={20} />
                  <span className="text-sm">Upload</span>
                </div>
              </label>
              <input
                type="file"
                id="image"
                className="hidden"
                onChange={handleImageUpload}
                accept="image/*"
              />
            </div>

            {/* selected image */}
            {imagePreview && (
              <div className="size-20 overflow-hidden rounded relative group">
                <Image
                  src={
                    typeof imagePreview === "string"
                      ? imagePreview
                      : URL.createObjectURL(imagePreview)
                  }
                  alt=""
                  className="w-full h-full object-cover"
                  width={80}
                  height={80}
                />
                <div
                  className="bg-[#2424243a] w-full h-full absolute top-0 left-0 flex group-hover:opacity-100 opacity-0"
                  style={{ transition: "opacity .3s ease" }}
                >
                  <button
                    className="mt-auto ml-[50%] -translate-x-1/2 mb-1 text-white bg-danger p-1 rounded"
                    onClick={removeImage}
                    type="button"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
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
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};

export default UpdateBlogPostForm;
