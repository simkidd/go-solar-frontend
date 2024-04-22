"use client";
import { useBlog } from "@/contexts/blog.context";
import { Post, UpdatePostInput } from "@/interfaces/post.interface";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { GrCloudUpload } from "react-icons/gr";
import { HiXMark } from "react-icons/hi2";

const UpdateBlogPostForm: React.FC<{ post: Post }> = ({ post }) => {
  const { loading, updatePost } = useBlog();
  const [input, setInput] = useState<UpdatePostInput>({
    id: post?._id,
    title: post?.title,
    content: post?.content,
    author: post?.author,
    tags: post?.tags,
    image: post?.image,
  });
  const [imagePreview, setImagePreview] = useState<string | File>("");
  const [newTag, setNewTag] = useState("");
  const router = useRouter();

  const handleAddTag = () => {
    if (newTag.trim() !== "") {
      const newTags = newTag
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== "");
      const updatedTags = Array.from(new Set([...input.tags, ...newTags])); // Convert Set to array
      // const stringifiedTags = JSON.stringify(updatedTags);
      // setStringifiedTags(stringifiedTags); // Save the stringified tags

      setInput({
        ...input,
        tags: updatedTags,
      });
      setNewTag("");
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setInput((tagInput) => ({
      ...tagInput,
      tags: tagInput.tags.filter((tag) => tag !== tagToDelete),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
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
  console.log("first", input.image);

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
    formData.append("blogImage", input.image);

    // const config = { headers: { "Content-Type": "multipart/form-data" } };

    await updatePost(formData);
    setTimeout(() => {
      router.refresh();
      router.back();
    }, 300);
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div>
        <div className="mb-3">
          <label htmlFor="title">Post title</label>
          <input
            type="text"
            id="title"
            className="w-full border focus:outline-none focus:border-primary focus:border h-10 py-2 px-3 bg-transparent mt-1"
            value={input?.title}
            onChange={(e) => setInput({ ...input, title: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description">Content</label>
          <textarea
            name=""
            id="description"
            className="w-full border focus:outline-none focus:border-primary focus:border h-10 py-2 px-3 bg-transparent min-h-56 mt-1 resize-none"
            value={input?.content}
            onChange={(e) => setInput({ ...input, content: e.target.value })}
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="title">Tags</label>
          <div className="relative w-full mt-1">
            <input
              type="text"
              id="title"
              className="w-full border focus:outline-none focus:border-primary focus:border h-10 py-2 px-3 bg-transparent pr-10"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              type="button"
              className="bg-primary text-white absolute top-[50%] -translate-y-[50%] right-2"
              onClick={handleAddTag}
            >
              <Plus />
            </button>
          </div>
          <div className="flex gap-1 mt-1 flex-wrap items-center">
            {input?.tags?.map((tag, i) => (
              <span
                key={i}
                className="bg-primary text-white rounded-md pl-2 py-[0.5px] text-sm overflow-hidden flex items-center"
              >
                {tag}
                <button
                  type="button"
                  className=" ml-2 px-1"
                  onClick={() => handleDeleteTag(tag)}
                >
                  <HiXMark />
                </button>
              </span>
            ))}
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="title">Author</label>
          <input
            type="text"
            id="title"
            className="w-full border focus:outline-none focus:border-primary focus:border h-10 py-2 px-3 bg-transparent mt-1"
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
            {input?.image && (
              <div className="size-20 overflow-hidden rounded relative group">
                <Image
                  src={input?.image as string || imagePreview as string}
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

        <div className="flex items-center gap-4 mt-8">
          <button
            type="submit"
            className="bg-primary text-white px-6 py-2 "
          >
            {loading ? "Loading..." : "Save Post"}
          </button>
          <button
            type="button"
            className="px-6 py-2"
            onClick={() => router.back()}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default UpdateBlogPostForm;
