"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  Briefcase,
  MapPin,
  Calendar,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  ImageIcon,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useMemo, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import AppModal from "@/components/AppModal";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjectsQuery } from "@/hooks/queries/useProjectsQuery";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "@/hooks/mutations/useProjectMutations";

export const ProjectsTable = () => {
  const { data: projects = [], isLoading, refetch } = useProjectsQuery();
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [activeProject, setActiveProject] = useState<any | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Image upload state (up to 5 images)
  const MAX_IMAGES = 5;
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    const remaining = MAX_IMAGES - imageFiles.length;
    const toAdd = acceptedFiles.slice(0, remaining);
    if (toAdd.length === 0) return;

    setImageFiles((prev) => [...prev, ...toAdd]);
    setImagePreviews((prev) => [
      ...prev,
      ...toAdd.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const {
    getRootProps: getCreateRootProps,
    getInputProps: getCreateInputProps,
    isDragActive: isCreateDragActive,
    open: openCreateDropzone,
  } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    noClick: true,
    noKeyboard: true,
  });

  const {
    getRootProps: getEditRootProps,
    getInputProps: getEditInputProps,
    isDragActive: isEditDragActive,
    open: openEditDropzone,
  } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    noClick: true,
    noKeyboard: true,
  });

  // Mutations
  const createMutation = useCreateProjectMutation({
    onSuccess: () => {
      setIsCreateOpen(false);
      reset();
      setImageFiles([]);
      setImagePreviews([]);
    },
  });
  const updateMutation = useUpdateProjectMutation({
    onSuccess: () => {
      setIsEditOpen(false);
      setActiveProject(null);
      setImageFiles([]);
      setImagePreviews([]);
    },
  });
  const deleteMutation = useDeleteProjectMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      location: "Port Harcourt",
      date: "August 2026",
      desc: "Complete hybrid solar installation designed for reliable power backup.",
      inverter: "5 kVA",
      pv: "6 kWp",
      battery: "10 kWh",
    },
  });

  const filteredProjects = useMemo(() => {
    return projects.filter((p: any) => {
      const query = searchTerm.toLowerCase();
      return (
        p.title?.toLowerCase().includes(query) ||
        p.location?.toLowerCase().includes(query) ||
        p.specs?.inverter?.toLowerCase().includes(query)
      );
    });
  }, [projects, searchTerm]);

  const handleRemoveImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearImages = () => {
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleOpenCreate = () => {
    reset({
      title: "",
      location: "Port Harcourt",
      date: "August 2026",
      desc: "Complete hybrid solar installation designed for reliable power backup.",
      inverter: "5 kVA",
      pv: "6 kWp",
      battery: "10 kWh",
    });
    setImageFiles([]);
    setImagePreviews([]);
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (p: any) => {
    setActiveProject(p);
    reset({
      title: p.title,
      location: p.location,
      date: p.date,
      desc: p.desc,
      inverter: p.specs?.inverter || "5 kVA",
      pv: p.specs?.pv || "6 kWp",
      battery: p.specs?.battery || "10 kWh",
    });
    setImageFiles([]);
    setImagePreviews([]);
    setIsEditOpen(true);
  };

  const buildFormData = (values: any): FormData => {
    const fd = new FormData();
    fd.append("title", values.title);
    fd.append("location", values.location);
    fd.append("date", values.date);
    fd.append("desc", values.desc);
    fd.append("specs[inverter]", values.inverter);
    fd.append("specs[pv]", values.pv);
    fd.append("specs[battery]", values.battery);
    // Append each image file under the "images" key (matches backend fields config)
    imageFiles.forEach((file) => fd.append("images", file));
    return fd;
  };

  const handleSaveCreate = (values: any) => {
    createMutation.mutate(buildFormData(values));
  };

  const handleSaveEdit = (values: any) => {
    if (!activeProject) return;
    updateMutation.mutate({
      id: activeProject._id,
      formData: buildFormData(values),
    });
  };

  const handleDelete = () => {
    if (!activeProject) return;
    deleteMutation.mutate(activeProject._id, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        setActiveProject(null);
      },
    });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="w-full space-y-5 font-inter">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
        <div>
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2 tracking-tight">
            <Briefcase className="h-5 w-5 text-primary" />
            Installation Projects & Case Studies
          </h2>
          <p className="text-xs text-muted-foreground font-semibold mt-0.5">
            Manage completed residential & commercial installations shown on the
            public projects portfolio.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-2 border-border text-muted-foreground hover:text-foreground h-9 rounded-xl text-xs font-semibold cursor-pointer hover:bg-muted/30"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            onClick={handleOpenCreate}
            className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-9 rounded-lg gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Completed Project
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 bg-card text-card-foreground p-5 rounded-2xl border border-border/80 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              placeholder="Search projects by title, location, capacity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
            />
          </div>
          {searchTerm && (
            <Button
              variant="ghost"
              onClick={() => setSearchTerm("")}
              className="text-red-500 hover:text-red-600 hover:bg-red-50/50 dark:hover:bg-red-950/10 text-xs font-semibold rounded-xl cursor-pointer"
            >
              Reset
            </Button>
          )}
        </div>

        <div className="flex justify-between items-center text-[10px] text-muted-foreground border-t border-border/60 pt-3 select-none font-bold uppercase tracking-wider">
          <span>Showing {filteredProjects.length} completed installations</span>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-card text-card-foreground rounded-2xl border border-border/80 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/80">
              <TableHead className="font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12 select-none px-4">
                Project & Location
              </TableHead>
              <TableHead className="font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12 select-none">
                System Sizing Specs
              </TableHead>
              <TableHead className="font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12 select-none">
                Completion Date
              </TableHead>
              <TableHead className="font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12 select-none">
                Highlights & Proof
              </TableHead>
              <TableHead className="font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12 select-none text-right px-4">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32">
                  <div className="space-y-2 flex flex-col justify-center items-center py-8">
                    <Skeleton className="h-5 w-4/5" />
                    <Skeleton className="h-5 w-3/5" />
                    <Skeleton className="h-5 w-4/5" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-12 text-sm text-zinc-400"
                >
                  No projects matched your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects.map((proj: any) => (
                <TableRow
                  key={proj._id}
                  className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 border-b border-zinc-100 dark:border-zinc-800 last:border-b-0"
                >
                  {/* Title & Location */}
                  <TableCell className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      {proj.image && (
                        <div className="relative h-10 w-14 rounded-lg overflow-hidden border border-border/60 shrink-0">
                          <Image
                            src={proj.image}
                            alt={proj.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-white text-sm">
                          {proj.title}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                          <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                          <span>{proj.location}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* System Sizing Specs */}
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className="text-[10px] font-bold px-2 py-0 border-primary/30 text-primary bg-primary/5"
                        >
                          {proj.specs?.inverter}
                        </Badge>
                        <span className="text-xs text-zinc-600 dark:text-zinc-300 font-semibold">
                          {proj.specs?.pv} PV • {proj.specs?.battery} Battery
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Completion Date */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                      <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                      <span>{proj.date}</span>
                    </div>
                  </TableCell>

                  {/* Highlights Count */}
                  <TableCell>
                    <button
                      onClick={() => {
                        setActiveProject(proj);
                        setIsViewOpen(true);
                      }}
                      className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-primary transition-colors flex items-center gap-1 underline underline-offset-2"
                    >
                      {proj.highlights?.length || 0} case study points
                      <Eye className="h-3.5 w-3.5 text-zinc-400" />
                    </button>
                  </TableCell>

                  {/* Actions Dropdown */}
                  <TableCell className="text-right px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg cursor-pointer hover:bg-muted"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-44 rounded-xl bg-card border border-border/80"
                      >
                        <DropdownMenuItem
                          asChild
                          className="cursor-pointer text-xs font-bold"
                        >
                          <Link
                            href={`/projects/${proj.slug || proj._id}`}
                            target="_blank"
                            className="flex items-center gap-2"
                          >
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            <span>Preview Public Page</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setActiveProject(proj);
                            setIsViewOpen(true);
                          }}
                          className="cursor-pointer text-xs font-bold"
                        >
                          <Eye className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>View Case Study</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleOpenEdit(proj)}
                          className="cursor-pointer text-xs font-bold"
                        >
                          <Pencil className="h-4 w-4 mr-2 text-primary" />
                          <span>Edit Project</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="border-border/60" />
                        <DropdownMenuItem
                          onClick={() => {
                            setActiveProject(proj);
                            setIsDeleteOpen(true);
                          }}
                          className="cursor-pointer text-xs font-bold text-rose-600 focus:text-rose-600 focus:bg-rose-50/50 dark:focus:bg-rose-950/20"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          <span>Delete Project</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* VIEW CASE STUDY MODAL */}
      <AppModal
        isOpen={isViewOpen}
        onOpenChange={setIsViewOpen}
        title={activeProject?.title || "Case Study Details"}
        size="lg"
        scrollBehavior="inside"
      >
        {activeProject && (
          <div className="space-y-4 py-2 text-sm">
            {/* Project Image */}
            {activeProject.image && (
              <div className="relative w-full h-48 rounded-xl overflow-hidden border border-border/60">
                <Image
                  src={activeProject.image}
                  alt={activeProject.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="bg-muted/30 p-4 rounded-xl border border-border text-xs">
              <p className="font-semibold text-muted-foreground mb-1">
                {activeProject.location} • Completed {activeProject.date}
              </p>
              <p className="font-medium text-foreground leading-relaxed">
                {activeProject.desc}
              </p>
              <div className="flex flex-wrap gap-4 mt-3 font-bold text-primary">
                <span>Inverter: {activeProject.specs?.inverter}</span>
                <span>Solar PV: {activeProject.specs?.pv}</span>
                <span>Battery: {activeProject.specs?.battery}</span>
              </div>
            </div>

            {/* Highlights */}
            {activeProject.highlights?.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Installation Highlights
                </p>
                <ul className="space-y-1 text-xs">
                  {activeProject.highlights.map((hl: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-foreground font-semibold"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Powered Appliances */}
            {activeProject.powers?.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Supported Customer Load
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {activeProject.powers.map((pwr: string, i: number) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="text-[11px] py-0.5 rounded-lg border-border"
                    >
                      {pwr}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end pt-4 border-t border-border/60">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsViewOpen(false)}
                className="text-muted-foreground hover:text-foreground text-xs font-bold h-10 px-4 rounded-xl cursor-pointer"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </AppModal>

      {/* CREATE MODAL */}
      <AppModal
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Add Completed Project"
        size="2xl"
        scrollBehavior="inside"
      >
        <form
          onSubmit={handleSubmit(handleSaveCreate)}
          className="w-full font-inter flex flex-col gap-6 pt-2"
        >
          {/* Details Card */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
            <div className="border-b border-border/60 pb-3 select-none">
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                Project Information
              </h3>
              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                Showcase solar installation specifications, date, and project
                description
              </p>
            </div>

            {/* Multi-Image Upload */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block select-none">
                  Project Photos{" "}
                  <span className="text-muted-foreground/60 font-semibold normal-case tracking-normal">
                    ({imagePreviews.length}/{MAX_IMAGES})
                  </span>
                </label>
                {imagePreviews.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearImages}
                    className="text-[10px] text-red-500 hover:text-red-600 font-bold cursor-pointer"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div
                {...getCreateRootProps()}
                className={`border-2 border-dashed rounded-2xl p-4 transition-colors ${
                  isCreateDragActive
                    ? "border-primary bg-primary/5"
                    : "border-border bg-muted/10 hover:bg-muted/20"
                }`}
              >
                <input {...getCreateInputProps()} />

                {imagePreviews.length === 0 ? (
                  <div
                    onClick={openCreateDropzone}
                    className="flex flex-col items-center justify-center py-6 cursor-pointer select-none"
                  >
                    <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-xs font-semibold text-foreground">
                      Drag & drop photos here, or{" "}
                      <span className="text-primary underline">browse</span>
                    </span>
                    <span className="text-[10px] text-muted-foreground/60 mt-1">
                      Up to {MAX_IMAGES} images (JPG, PNG, WEBP)
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-5 gap-2">
                    {imagePreviews.map((src, i) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded-xl overflow-hidden border border-border/60 group"
                      >
                        <Image
                          src={src}
                          alt={`Preview ${i + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(i);
                          }}
                          className="absolute top-1 right-1 bg-black/60 text-white p-0.5 rounded-full hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        {i === 0 && (
                          <span className="absolute bottom-1 left-1 bg-primary/80 text-white text-[8px] font-bold px-1 rounded select-none">
                            Cover
                          </span>
                        )}
                      </div>
                    ))}
                    {imagePreviews.length < MAX_IMAGES && (
                      <div
                        onClick={openCreateDropzone}
                        className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors"
                      >
                        <Plus className="h-5 w-5 text-muted-foreground mb-1" />
                        <span className="text-[9px] font-semibold text-muted-foreground text-center leading-tight">
                          Add Photo
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground/60 font-medium">
                First image is the cover. JPG, PNG, WEBP up to 5MB each.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block select-none">
                Project Title <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. 5kVA Residential Duplex Solar"
                {...register("title", {
                  required: "Project title is required",
                })}
                className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
              />
              {errors.title && (
                <span className="text-[11px] font-bold text-red-500 mt-0.5 block">
                  {errors.title.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block select-none">
                  Location <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g. Port Harcourt - GRA"
                  {...register("location", {
                    required: "Location is required",
                  })}
                  className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
                />
                {errors.location && (
                  <span className="text-[11px] font-bold text-red-500 mt-0.5 block">
                    {errors.location.message}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block select-none">
                  Date Completed
                </label>
                <Input
                  placeholder="e.g. August 2026"
                  {...register("date")}
                  className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block select-none">
                  Inverter
                </label>
                <Input
                  placeholder="5 kVA"
                  {...register("inverter")}
                  className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block select-none">
                  Solar PV
                </label>
                <Input
                  placeholder="6 kWp"
                  {...register("pv")}
                  className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block select-none">
                  Battery
                </label>
                <Input
                  placeholder="10 kWh"
                  {...register("battery")}
                  className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block select-none">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Brief summary of client requirements and system performance."
                {...register("desc")}
                className="w-full p-3 rounded-xl border border-border bg-muted/30 text-xs min-h-[80px] resize-none outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsCreateOpen(false)}
              className="text-muted-foreground hover:text-foreground text-xs font-bold h-10 px-4 rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={createMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider rounded-xl h-10 px-6 shadow-sm cursor-pointer"
            >
              {createMutation.isPending ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </AppModal>

      {/* EDIT MODAL */}
      <AppModal
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        title={`Edit — ${activeProject?.title}`}
        size="2xl"
      >
        <form
          onSubmit={handleSubmit(handleSaveEdit)}
          className="w-full font-inter flex flex-col gap-6 pt-2"
        >
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
            <div className="border-b border-border/60 pb-3 select-none">
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                Project Information
              </h3>
              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                Update project details. Upload a new image to replace the
                current one.
              </p>
            </div>

            {/* Multi-Image Upload (Edit) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block select-none">
                  Project Photos{" "}
                  <span className="text-muted-foreground/60 font-semibold normal-case tracking-normal">
                    ({imagePreviews.length}/{MAX_IMAGES})
                  </span>
                </label>
                {imagePreviews.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearImages}
                    className="text-[10px] text-red-500 hover:text-red-600 font-bold cursor-pointer"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div
                {...getEditRootProps()}
                className={`border-2 border-dashed rounded-2xl p-4 transition-colors ${
                  isEditDragActive
                    ? "border-primary bg-primary/5"
                    : "border-border bg-muted/10 hover:bg-muted/20"
                }`}
              >
                <input {...getEditInputProps()} />

                {imagePreviews.length === 0 &&
                (!activeProject?.images ||
                  activeProject.images.length === 0) ? (
                  <div
                    onClick={openEditDropzone}
                    className="flex flex-col items-center justify-center py-6 cursor-pointer select-none"
                  >
                    <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-xs font-semibold text-foreground">
                      Drag & drop photos here, or{" "}
                      <span className="text-primary underline">browse</span>
                    </span>
                    <span className="text-[10px] text-muted-foreground/60 mt-1">
                      Up to {MAX_IMAGES} images (JPG, PNG, WEBP)
                    </span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Show existing server images when no new ones selected */}
                    {imagePreviews.length === 0 &&
                      activeProject?.images?.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-wider select-none">
                            Current Photos
                          </p>
                          <div className="grid grid-cols-5 gap-2">
                            {(activeProject.images as string[]).map(
                              (src: string, i: number) => (
                                <div
                                  key={i}
                                  className="relative aspect-square rounded-xl overflow-hidden border border-border/60"
                                >
                                  <Image
                                    src={src}
                                    alt={`Existing ${i + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                  {i === 0 && (
                                    <span className="absolute bottom-1 left-1 bg-primary/80 text-white text-[8px] font-bold px-1 rounded select-none">
                                      Cover
                                    </span>
                                  )}
                                </div>
                              ),
                            )}
                            <div
                              onClick={openEditDropzone}
                              className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors"
                            >
                              <Pencil className="h-5 w-5 text-muted-foreground mb-1" />
                              <span className="text-[9px] font-semibold text-muted-foreground text-center leading-tight">
                                Replace All
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                    {/* New image thumbnails */}
                    {(imagePreviews.length > 0 ||
                      !activeProject?.images ||
                      activeProject.images.length === 0) && (
                      <div>
                        {activeProject?.images?.length > 0 && (
                          <p className="text-[10px] font-bold text-emerald-600 mb-1.5 uppercase tracking-wider select-none">
                            New Photos (Will Replace Current)
                          </p>
                        )}
                        <div className="grid grid-cols-5 gap-2">
                          {imagePreviews.map((src, i) => (
                            <div
                              key={i}
                              className="relative aspect-square rounded-xl overflow-hidden border border-border/60 group"
                            >
                              <Image
                                src={src}
                                alt={`Preview ${i + 1}`}
                                fill
                                className="object-cover"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveImage(i);
                                }}
                                className="absolute top-1 right-1 bg-black/60 text-white p-0.5 rounded-full hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              {i === 0 && (
                                <span className="absolute bottom-1 left-1 bg-emerald-500/85 text-white text-[8px] font-bold px-1 rounded select-none">
                                  New Cover
                                </span>
                              )}
                            </div>
                          ))}
                          {imagePreviews.length < MAX_IMAGES && (
                            <div
                              onClick={openEditDropzone}
                              className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors"
                            >
                              <Plus className="h-5 w-5 text-muted-foreground mb-1" />
                              <span className="text-[9px] font-semibold text-muted-foreground text-center leading-tight">
                                Add Photo
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground/60 font-medium">
                Uploading new photos will replace all existing ones. First image
                becomes the cover.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block select-none">
                Project Title <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. 5kVA Residential Duplex Solar"
                {...register("title", {
                  required: "Project title is required",
                })}
                className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
              />
              {errors.title && (
                <span className="text-[11px] font-bold text-red-500 mt-0.5 block">
                  {errors.title.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block select-none">
                  Location <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g. Port Harcourt - GRA"
                  {...register("location", {
                    required: "Location is required",
                  })}
                  className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
                />
                {errors.location && (
                  <span className="text-[11px] font-bold text-red-500 mt-0.5 block">
                    {errors.location.message}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block select-none">
                  Date Completed
                </label>
                <Input
                  placeholder="e.g. August 2026"
                  {...register("date")}
                  className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block select-none">
                  Inverter
                </label>
                <Input
                  placeholder="5 kVA"
                  {...register("inverter")}
                  className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block select-none">
                  Solar PV
                </label>
                <Input
                  placeholder="6 kWp"
                  {...register("pv")}
                  className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block select-none">
                  Battery
                </label>
                <Input
                  placeholder="10 kWh"
                  {...register("battery")}
                  className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block select-none">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Brief summary of client requirements and system performance."
                {...register("desc")}
                className="w-full p-3 rounded-xl border border-border bg-muted/30 text-xs min-h-[80px] resize-none outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsEditOpen(false)}
              className="text-muted-foreground hover:text-foreground text-xs font-bold h-10 px-4 rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={updateMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider rounded-xl h-10 px-6 shadow-sm cursor-pointer"
            >
              {updateMutation.isPending ? "Saving..." : "Save Project"}
            </Button>
          </div>
        </form>
      </AppModal>

      {/* DELETE MODAL */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm bg-card border border-border/80 rounded-2xl select-none">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-foreground">
              Delete Project
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Are you sure you want to remove <b>{activeProject?.title}</b>?
              This will permanently remove it from the public portfolio.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectsTable;
