"use client";
import React, { useState } from "react";
import { Banner } from "@/interfaces/banner.interface";
import { useAllBannersAdminQuery } from "@/hooks/queries/useBannersQuery";
import {
  useDeleteBannerMutation,
  useToggleBannerStatusMutation,
} from "@/hooks/mutations/useBannerMutations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import Image from "next/image";
import AppModal from "@/components/AppModal";
import CreateBannerForm from "./CreateBannerForm";
import UpdateBannerForm from "./UpdateBannerForm";

const getPlacementLabel = (placement?: string) => {
  switch (placement) {
    case "storefront_hero":
      return "Hero Slider";
    case "storefront_promo_strip":
      return "Grid Strip";
    case "storefront_promo_card":
      return "Featured Card";
    default:
      return "Hero Slider";
  }
};

const BannersTable = () => {
  const { data: banners = [], isLoading, refetch } = useAllBannersAdminQuery();

  const deleteBannerMutation = useDeleteBannerMutation();
  const toggleStatusMutation = useToggleBannerStatusMutation();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deletingBanner, setDeletingBanner] = useState<Banner | null>(null);

  const handleDelete = () => {
    if (deletingBanner) {
      deleteBannerMutation.mutate(deletingBanner._id, {
        onSuccess: () => setDeletingBanner(null),
      });
    }
  };

  return (
    <div className="w-full space-y-6 font-inter">
      {/* Modals */}
      <AppModal
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Create Storefront Banner"
        size="3xl"
        scrollBehavior="inside"
        isDismissable={false}
        hideCloseButton
      >
        <CreateBannerForm onClose={() => setIsCreateOpen(false)} />
      </AppModal>

      {editingBanner && (
        <AppModal
          isOpen={Boolean(editingBanner)}
          onOpenChange={(open) => !open && setEditingBanner(null)}
          title="Edit Storefront Banner"
          size="3xl"
          scrollBehavior="inside"
          isDismissable={false}
          hideCloseButton
        >
          <UpdateBannerForm
            banner={editingBanner}
            onClose={() => setEditingBanner(null)}
          />
        </AppModal>
      )}

      {deletingBanner && (
        <AppModal
          isOpen={Boolean(deletingBanner)}
          onOpenChange={(open) => !open && setDeletingBanner(null)}
          title="Delete Banner Confirmation"
        >
          <div className="space-y-4 pt-2">
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              Are you sure you want to delete banner &ldquo;
              <b>{deletingBanner.title}</b>&rdquo;? This will immediately remove
              it from the storefront carousel.
            </p>
            <div className="flex items-center justify-end gap-2 pt-4">
              <Button
                variant="ghost"
                onClick={() => setDeletingBanner(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={deleteBannerMutation.isPending}
                onClick={handleDelete}
                className="text-xs"
              >
                {deleteBannerMutation.isPending
                  ? "Deleting..."
                  : "Delete Banner"}
              </Button>
            </div>
          </div>
        </AppModal>
      )}

      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Storefront Banners
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Manage the hero promotional carousel slides on the customer shop
            page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-2 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 h-9 rounded-lg text-xs"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>

          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-9 rounded-lg gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Banner
          </Button>
        </div>
      </div>

      {/* Banners List Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card
              key={i}
              className="overflow-hidden border-zinc-150 dark:border-zinc-800 dark:bg-[#1a1b1e]"
            >
              <Skeleton className="w-full aspect-[21/9]" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : banners.length === 0 ? (
        <Card className="border-dashed border-2 border-zinc-200 dark:border-zinc-800 dark:bg-[#1a1b1e]/40">
          <CardContent className="p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#08AA08]/10 text-[#08AA08] flex items-center justify-center mx-auto">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                No custom banners created yet
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
                The storefront is currently showing standard fallback solar
                slides. Add your first custom banner to showcase seasonal sales,
                packages, or tools!
              </p>
            </div>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="bg-[#08AA08] hover:bg-[#079907] text-white font-bold text-xs gap-2 rounded-xl"
            >
              <Plus className="h-4 w-4" />
              Create First Banner
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <Card
              key={banner._id}
              className="overflow-hidden border border-zinc-150 dark:border-zinc-800 bg-white dark:bg-[#1a1b1e] shadow-xs group"
            >
              {/* Visual Banner Preview */}
              <div className="relative w-full aspect-[21/9] bg-zinc-950 overflow-hidden">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

                {/* Top badges & status */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-[#08AA08] text-white shadow-xs">
                      <Sparkles className="h-2.5 w-2.5" />
                      {banner.badge || "Highlight"}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md border border-white/10 select-none">
                      {getPlacementLabel(banner.placement)}
                    </span>
                  </div>

                  <Badge
                    variant={banner.isActive ? "default" : "secondary"}
                    className={
                      banner.isActive
                        ? "bg-emerald-500 hover:bg-emerald-600 text-[10px]"
                        : "bg-zinc-700 text-zinc-300 text-[10px]"
                    }
                  >
                    {banner.isActive ? "Live on Store" : "Draft / Inactive"}
                  </Badge>
                </div>

                {/* Bottom Overlay Title & Subtitle */}
                <div className="absolute bottom-3 left-3 right-3 space-y-1">
                  <h3 className="text-sm sm:text-base font-extrabold text-white line-clamp-1">
                    {banner.title}
                  </h3>
                  {banner.subtitle && (
                    <p className="text-xs text-zinc-300 line-clamp-1">
                      {banner.subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Controls Footer */}
              <CardContent className="p-4 flex items-center justify-between gap-3 border-t border-zinc-100 dark:border-zinc-850">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={banner.isActive}
                      onCheckedChange={() =>
                        toggleStatusMutation.mutate(banner._id)
                      }
                      disabled={toggleStatusMutation.isPending}
                    />
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      {banner.isActive ? "Active" : "Hidden"}
                    </span>
                  </div>

                  {banner.ctaLink && (
                    <a
                      href={banner.ctaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 ml-2"
                    >
                      {banner.ctaText || "Link"}{" "}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingBanner(banner)}
                    className="h-8 px-2.5 text-xs gap-1.5 border-zinc-200 dark:border-zinc-800"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeletingBanner(banner)}
                    className="h-8 px-2.5 text-xs gap-1.5"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BannersTable;
