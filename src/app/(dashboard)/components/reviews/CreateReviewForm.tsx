"use client";

import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Film, Trash2, UploadCloud } from "lucide-react";

export interface CreateReviewInput {
  name: string;
  role: string;
  content: string;
  videoUrl?: string;
  videoFile?: File;
}

interface CreateReviewFormProps {
  onSubmit: (data: CreateReviewInput) => void;
  onCancel: () => void;
  isPending: boolean;
}

export default function CreateReviewForm({
  onSubmit,
  onCancel,
  isPending,
}: CreateReviewFormProps) {
  const [videoType, setVideoType] = useState<"link" | "upload">("link");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      role: "Residential Customer",
      content: "",
      videoUrl: "",
    },
  });

  // watch values to dynamically validate content
  const watchedVideoUrl = watch("videoUrl");

  // react-dropzone configuration
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".mov", ".webm", ".mpeg", ".avi"],
    },
    maxFiles: 1,
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
  };

  const handleFormSubmit = (values: any) => {
    const data: any = {
      name: values.name,
      role: values.role,
      content: values.content,
    };

    if (videoType === "link" && values.videoUrl) {
      data.videoUrl = values.videoUrl;
    } else if (videoType === "upload" && selectedFile) {
      data.videoFile = selectedFile;
    }

    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="w-full font-inter flex flex-col gap-6 pt-2"
    >
      <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4 text-left">
        <div className="border-b border-border/60 pb-3 ">
          <h3 className="text-sm font-extrabold text-foreground tracking-tight">
            Testimonial Details
          </h3>
          <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
            Configure reviewer name, client role, and testimonial content
            details
          </p>
        </div>

        {/* Customer Name */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block ">
            Customer Name <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="e.g. Mrs. Blessing Alabi"
            {...register("name", { required: "Reviewer name is required" })}
            className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
          />
          {errors.name && (
            <span className="text-[11px] font-bold text-red-500 mt-0.5 block">
              {errors.name.message}
            </span>
          )}
        </div>

        {/* Client Role */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block ">
            Client Role
          </label>
          <Input
            placeholder="e.g. Homeowner in Port Harcourt"
            {...register("role")}
            className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
          />
        </div>

        {/* Review Text */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block ">
            Testimonial Review{" "}
            <span className="text-[9px] font-bold text-muted-foreground/60">
              (Optional if video testimonial provided)
            </span>
          </label>
          <textarea
            rows={4}
            placeholder="Customer's review on installation quality, solar system performance, and utility savings."
            {...register("content", {
              validate: (value) => {
                if (videoType === "upload" && selectedFile) return true;
                if (videoType === "link" && watchedVideoUrl) return true;
                return value.trim() !== ""
                  ? true
                  : "Either written testimonial text or a video testimonial is required";
              },
            })}
            className="w-full p-3 rounded-xl border border-border bg-muted/30 text-xs min-h-[100px] resize-none outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.content && (
            <span className="text-[11px] font-bold text-red-500 mt-0.5 block">
              {errors.content.message}
            </span>
          )}
        </div>

        {/* Video Testimonial Toggle */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block ">
            Video Testimonial (Optional)
          </label>

          <div className="flex gap-2 p-1 bg-muted/40 border border-border/80 rounded-xl max-w-xs ">
            <button
              type="button"
              onClick={() => setVideoType("link")}
              className={`flex-1 py-1.5 text-[10px] font-extrabold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                videoType === "link"
                  ? "bg-white dark:bg-zinc-800 text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              YouTube Link
            </button>
            <button
              type="button"
              onClick={() => setVideoType("upload")}
              className={`flex-1 py-1.5 text-[10px] font-extrabold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                videoType === "upload"
                  ? "bg-white dark:bg-zinc-800 text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Upload Video
            </button>
          </div>

          {videoType === "link" ? (
            <Input
              placeholder="e.g. https://www.youtube.com/watch?v=..."
              {...register("videoUrl")}
              className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
            />
          ) : (
            <div className="space-y-2">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-border/80 bg-muted/20 hover:border-primary/50 hover:bg-muted/30"
                }`}
              >
                <input {...getInputProps()} />

                {selectedFile ? (
                  <div className="flex items-center justify-between bg-card border border-border/60 p-3 rounded-xl max-w-md mx-auto">
                    <div className="flex items-center gap-2.5 truncate">
                      <Film className="h-4.5 w-4.5 text-primary shrink-0" />
                      <div className="text-left truncate">
                        <p className="text-xs font-bold text-foreground truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-semibold">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="text-red-500 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-955/15 h-8 w-8 p-0 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <UploadCloud className="h-8 w-8 text-muted-foreground mx-auto" />
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-foreground">
                        Drag & drop your testimonial video
                      </p>
                      <p className="text-[10px] text-muted-foreground font-semibold">
                        or click to browse files
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-[9px] text-muted-foreground font-semibold ">
                Supported formats: MP4, MOV, WEBM, AVI (Max 50MB)
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground text-xs font-bold h-10 px-4 rounded-xl cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isPending}
          className="bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider rounded-xl h-10 px-6 shadow-sm cursor-pointer"
        >
          {isPending ? "Saving..." : "Save Review"}
        </Button>
      </div>
    </form>
  );
}
