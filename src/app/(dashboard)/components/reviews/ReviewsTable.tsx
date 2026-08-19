"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Trash2,
  MessageSquare,
  CheckCircle,
  XCircle,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import AppModal from "@/components/AppModal";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAllReviewsQuery,
  REVIEW_KEYS,
} from "@/hooks/queries/useReviewsQuery";
import {
  useCreateReviewMutation,
  useToggleReviewPublishMutation,
  useDeleteReviewMutation,
} from "@/hooks/mutations/useReviewMutations";

export const ReviewsTable = () => {
  const { data: reviews = [], isLoading, refetch } = useAllReviewsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPublishConfirmOpen, setIsPublishConfirmOpen] = useState(false);
  const [activeReview, setActiveReview] = useState<any | null>(null);

  // Mutations
  const createMutation = useCreateReviewMutation({
    onSuccess: () => {
      setIsCreateOpen(false);
      reset();
    },
  });
  const togglePublishMutation = useToggleReviewPublishMutation();
  const deleteMutation = useDeleteReviewMutation();

  // react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      role: "Residential Customer",
      content: "",
    },
  });

  const filteredReviews = useMemo(() => {
    return reviews.filter((r: any) => {
      const matchesSearch =
        r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.content?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All"
          ? true
          : statusFilter === "Published"
            ? r.isPublished
            : !r.isPublished;

      return matchesSearch && matchesStatus;
    });
  }, [reviews, searchTerm, statusFilter]);

  const handleTogglePublish = () => {
    if (!activeReview) return;
    togglePublishMutation.mutate(activeReview._id, {
      onSuccess: () => {
        setIsPublishConfirmOpen(false);
        setActiveReview(null);
      },
    });
  };

  const handleSaveCreate = (values: any) => {
    createMutation.mutate({
      name: values.name,
      role: values.role,
      content: values.content,
    });
  };

  const handleDelete = () => {
    if (!activeReview) return;
    deleteMutation.mutate(activeReview._id, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        setActiveReview(null);
      },
    });
  };

  return (
    <div className="w-full space-y-5 font-inter">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
        <div>
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2 tracking-tight">
            <MessageSquare className="h-5 w-5 text-primary" />
            Customer Reviews & Testimonials
          </h2>
          <p className="text-xs text-muted-foreground font-semibold mt-0.5">
            Moderate and publish verified client testimonials across the store.
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
            onClick={() => {
              reset();
              setIsCreateOpen(true);
            }}
            className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-9 rounded-lg gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Testimonial
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 bg-card text-card-foreground p-5 rounded-2xl border border-border/80 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              placeholder="Search reviews by customer, content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(searchTerm || statusFilter !== "All") && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                }}
                className="text-red-500 hover:text-red-600 hover:bg-red-50/50 dark:hover:bg-red-950/10 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Reset
              </Button>
            )}

            {/* Status Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-border text-xs font-semibold rounded-xl h-10 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted/30"
                >
                  {statusFilter === "All" ? "All Statuses" : statusFilter}
                  <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40 rounded-xl bg-card border border-border/80">
                <DropdownMenuItem
                  onClick={() => setStatusFilter("All")}
                  className="cursor-pointer text-xs font-bold"
                >
                  All Statuses
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatusFilter("Published")}
                  className="cursor-pointer text-xs font-bold"
                >
                  Published
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatusFilter("Pending")}
                  className="cursor-pointer text-xs font-bold"
                >
                  Pending
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] text-muted-foreground border-t border-border/60 pt-3 select-none font-bold uppercase tracking-wider">
          <span>Total {filteredReviews.length} reviews moderated</span>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-card text-card-foreground rounded-2xl border border-border/80 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/80">
              <TableHead className="font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12 select-none px-4">
                Customer
              </TableHead>
              <TableHead className="font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12 select-none">
                Review Testimonial
              </TableHead>
              <TableHead className="font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12 select-none text-center">
                Status
              </TableHead>
              <TableHead className="font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12 select-none text-right px-4">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32">
                  <div className="space-y-2 flex flex-col justify-center items-center py-8">
                    <Skeleton className="h-5 w-4/5" />
                    <Skeleton className="h-5 w-3/5" />
                    <Skeleton className="h-5 w-4/5" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredReviews.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-12 text-sm text-zinc-400"
                >
                  No reviews matched your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredReviews.map((rev: any) => (
                <TableRow
                  key={rev._id}
                  className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 border-b border-zinc-100 dark:border-zinc-800 last:border-b-0"
                >
                  {/* Customer & Role */}
                  <TableCell className="px-4 py-3.5">
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-white text-sm">
                        {rev.name}
                      </p>
                      <p className="text-xs text-zinc-400 mt-0.5">{rev.role}</p>
                    </div>
                  </TableCell>

                  {/* Content snippet */}
                  <TableCell className="max-w-md">
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2 leading-relaxed">
                      "{rev.content}"
                    </p>
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell className="text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                        rev.isPublished
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40"
                          : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40"
                      }`}
                    >
                      {rev.isPublished ? "Published" : "Pending Review"}
                    </span>
                  </TableCell>

                  {/* Actions */}
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
                        className="w-36 rounded-xl bg-card border border-border/80"
                      >
                        <DropdownMenuItem
                          onClick={() => {
                            setActiveReview(rev);
                            setIsPublishConfirmOpen(true);
                          }}
                          className="cursor-pointer text-xs font-bold"
                        >
                          {rev.isPublished ? (
                            <span className="flex items-center">
                              <XCircle className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                              Unpublish
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <CheckCircle className="h-3.5 w-3.5 mr-2 text-primary" />
                              Approve
                            </span>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="border-border/60" />
                        <DropdownMenuItem
                          onClick={() => {
                            setActiveReview(rev);
                            setIsDeleteOpen(true);
                          }}
                          className="cursor-pointer text-xs font-bold text-rose-600 focus:text-rose-600 focus:bg-rose-50/50 dark:focus:bg-rose-950/20"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          Delete Review
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

      {/* CREATE MODAL */}
      <AppModal
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Add Verified Testimonial"
        size="lg"
      >
        <form
          onSubmit={handleSubmit(handleSaveCreate)}
          className="w-full font-inter flex flex-col gap-6 pt-2"
        >
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
            <div className="border-b border-border/60 pb-3 select-none">
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                Testimonial Details
              </h3>
              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                Configure reviewer name, client role, and testimonial content details
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block select-none">
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

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block select-none">
                Client Role
              </label>
              <Input
                placeholder="e.g. Homeowner in Port Harcourt"
                {...register("role")}
                className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block select-none">
                Testimonial Review <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Customer's review on installation quality, solar system performance, and utility savings."
                {...register("content", {
                  required: "Testimonial content is required",
                })}
                className="w-full p-3 rounded-xl border border-border bg-muted/30 text-xs min-h-[100px] resize-none outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.content && (
                <span className="text-[11px] font-bold text-red-500 mt-0.5 block">
                  {errors.content.message}
                </span>
              )}
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
              {createMutation.isPending ? "Saving..." : "Save Review"}
            </Button>
          </div>
        </form>
      </AppModal>

      {/* PUBLISH / UNPUBLISH CONFIRMATION */}
      <Dialog open={isPublishConfirmOpen} onOpenChange={setIsPublishConfirmOpen}>
        <DialogContent className="max-w-sm bg-card border border-border/80 rounded-2xl select-none">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-foreground">
              {activeReview?.isPublished ? "Unpublish Review" : "Publish Review"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-2 leading-relaxed">
              {activeReview?.isPublished ? (
                <>
                  This will hide the testimonial from <b>{activeReview?.name}</b> on the
                  public storefront. You can re-publish it anytime.
                </>
              ) : (
                <>
                  This will make the testimonial from <b>{activeReview?.name}</b> visible
                  on the public storefront.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPublishConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleTogglePublish}
              disabled={togglePublishMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl px-5 cursor-pointer"
            >
              {togglePublishMutation.isPending
                ? "Updating..."
                : activeReview?.isPublished
                  ? "Yes, Unpublish"
                  : "Yes, Publish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm bg-card border border-border/80 rounded-2xl select-none">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-foreground">
              Delete Testimonial
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Are you sure you want to remove the testimonial from{" "}
              <b>{activeReview?.name}</b>? This action cannot be undone.
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

export default ReviewsTable;
