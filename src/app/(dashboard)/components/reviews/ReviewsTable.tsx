"use client";
import { ReviewData } from "@/data/reviews";
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
  Trash2,
  Star,
  MessageSquare,
  CheckCircle,
  XCircle,
  User,
} from "lucide-react";
import React, { useState, useMemo } from "react";
import { toast } from "sonner";

export interface ReviewItem {
  id: string;
  name: string;
  role: string;
  content: string;
  isPublished: boolean;
  createdAt: string;
}

const INITIAL_REVIEWS: ReviewItem[] = ReviewData.slice(0, 6).map((r, i) => ({
  id: `rev-${i + 1}`,
  name: r.name,
  role: r.role,
  content: r.content,
  isPublished: i < 4, // first 4 published, rest pending
  createdAt: new Date(
    Date.now() - 1000 * 60 * 60 * 24 * (i + 1) * 3,
  ).toISOString(),
}));

export const ReviewsTable = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeReview, setActiveReview] = useState<ReviewItem | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    role: "Residential Customer",
    content: "",
    isPublished: true,
  });

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.content.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All"
          ? true
          : statusFilter === "Published"
            ? r.isPublished
            : !r.isPublished;

      return matchesSearch && matchesStatus;
    });
  }, [reviews, searchTerm, statusFilter]);

  const handleTogglePublish = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const next = !r.isPublished;
          toast.success(next ? "Review published!" : "Review unpublished.");
          return { ...r, isPublished: next };
        }
        return r;
      }),
    );
  };

  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.content) {
      toast.error("Please fill in the reviewer name and testimonial content");
      return;
    }

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      name: formData.name,
      role: formData.role,
      content: formData.content,
      isPublished: formData.isPublished,
      createdAt: new Date().toISOString(),
    };

    setReviews((prev) => [newRev, ...prev]);
    setIsCreateOpen(false);
    toast.success("New testimonial added!");
  };

  const handleDelete = () => {
    if (!activeReview) return;
    setReviews((prev) => prev.filter((r) => r.id !== activeReview.id));
    setIsDeleteOpen(false);
    toast.success("Review deleted");
  };

  return (
    <div className="space-y-6 font-inter">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Customer Reviews & Testimonials
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Moderate and publish verified client testimonials across the store.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-9 rounded-lg gap-1.5 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Testimonial
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-[#1a1b1e] p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search reviews by customer, content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 rounded-lg"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-2.5 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 outline-none"
          >
            <option value="All">All Reviews ({reviews.length})</option>
            <option value="Published">
              Published ({reviews.filter((r) => r.isPublished).length})
            </option>
            <option value="Pending">
              Pending ({reviews.filter((r) => !r.isPublished).length})
            </option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white dark:bg-[#1a1b1e] rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/20">
            <TableRow className="border-b border-zinc-100 dark:border-zinc-800">
              <TableHead className="font-semibold text-zinc-500 h-10 px-4">
                Customer
              </TableHead>
              <TableHead className="font-semibold text-zinc-500 h-10">
                Review Testimonial
              </TableHead>
              <TableHead className="font-semibold text-zinc-500 h-10 text-center">
                Status
              </TableHead>
              <TableHead className="font-semibold text-zinc-500 h-10 text-right px-4">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-12 text-sm text-zinc-400"
                >
                  No reviews matched your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredReviews.map((rev) => (
                <TableRow
                  key={rev.id}
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

                  {/* Status Toggle Badge */}
                  <TableCell className="text-center">
                    <button
                      onClick={() => handleTogglePublish(rev.id)}
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border cursor-pointer hover:opacity-80 transition-opacity ${
                        rev.isPublished
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40"
                          : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40"
                      }`}
                    >
                      {rev.isPublished ? "Published" : "Pending Review"}
                    </button>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right px-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTogglePublish(rev.id)}
                        className="text-xs text-zinc-600 dark:text-zinc-300 h-8"
                      >
                        {rev.isPublished ? "Unpublish" : "Approve"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setActiveReview(rev);
                          setIsDeleteOpen(true);
                        }}
                        className="h-8 w-8 text-zinc-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* CREATE MODAL */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-[#1a1b1e] border-zinc-100 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-white">
              Add Verified Testimonial
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Publish customer feedback and ratings.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveCreate} className="space-y-3 py-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Customer Name
              </label>
              <Input
                placeholder="e.g. Mrs. Blessing Alabi"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Client Role
              </label>
              <Input
                placeholder="e.g. Homeowner in Port Harcourt"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Testimonial Review
              </label>
              <textarea
                rows={3}
                placeholder="Customer's review on installation quality, solar system performance, and utility savings."
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                required
                className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900 text-xs outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-primary hover:bg-primary/90 text-white font-bold"
              >
                Save Review
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm bg-white dark:bg-[#1a1b1e] border-zinc-100 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-900 dark:text-white">
              Delete Review
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 mt-2">
              Are you sure you want to remove the review from{" "}
              <b>{activeReview?.name}</b>?
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
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewsTable;
