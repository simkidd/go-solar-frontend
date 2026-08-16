"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Package,
  Sparkles,
  Truck,
  Tag,
  Layers,
  RefreshCw,
  Trash2,
  Edit2,
  Plus,
  ImageOff,
} from "lucide-react";
import Image from "next/image";
import { Product } from "@/interfaces/product.interface";
import {
  getProductById,
  deleteProduct,
  updateProduct,
} from "@/lib/api/products";
import { addToOffer, getOffers } from "@/lib/api/offers";
import { formatCurrency } from "@/utils/helpers";
import { PRODUCT_KEYS } from "@/hooks/queries/useProductsQuery";
import { Button } from "@/components/ui/button";
import AppModal from "@/components/AppModal";
import UpdateProductForm from "./UpdateProductForm";
import UpdateProductImage from "./UpdateProductImage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SingleProductSkeleton from "./SingleProductSkeleton";

const SingleProductComp: React.FC<{ id: string }> = ({ id }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  // ── States ──
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState("");

  // ── Product query ──
  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useQuery<Product>({
    queryKey: ["getProductById", id],
    queryFn: async () => getProductById(id),
  });

  // ── Offers query (for linking campaigns) ──
  const { data: offers = [], isLoading: offersLoading } = useQuery({
    queryKey: ["alloffers"],
    queryFn: async () => getOffers(),
    enabled: isOfferOpen, // only load when campaign modal opens
  });

  // ── Mutations ──
  const togglePublishMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: (data) => {
      toast.success(
        data?.product?.isPublished ? "Product Published" : "Product Drafted",
      );
      queryClient.invalidateQueries({ queryKey: ["getProductById", id] });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      setIsPublishOpen(false);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to update visibility";
      toast.error(message);
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: (data) => {
      toast.success(data?.message || "Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      setIsDeleteOpen(false);
      router.push("/dashboard/products");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to delete product";
      toast.error(message);
    },
  });

  const addToOfferMutation = useMutation({
    mutationFn: addToOffer,
    onSuccess: (data) => {
      toast.success(data.message || "Added to campaign successfully");
      queryClient.invalidateQueries({ queryKey: ["getProductById", id] });
      setIsOfferOpen(false);
      setSelectedOffer("");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to link campaign";
      toast.error(message);
    },
  });

  if (isLoading) {
    return <SingleProductSkeleton />;
  }

  if (isError || !product) {
    notFound();
  }

  const calculateNewPrice = (price: number, percentageOff: number) => {
    return price - (price * percentageOff) / 100;
  };

  const basePrice =
    product?.discountPrice && product.discountPrice > 0
      ? product.discountPrice
      : product?.price;

  const newPrice =
    product?.currentOffer?.isActive &&
    product?.currentOffer?.percentageOff !== undefined
      ? calculateNewPrice(basePrice, product?.currentOffer?.percentageOff)
      : basePrice;

  const hasOffer =
    product?.currentOffer?.isActive && product?.currentOffer?.percentageOff;

  return (
    <div className="w-full font-inter space-y-6">
      {/* ── Modals & Dialog Cockpit ── */}

      {/* 1. Edit details modal */}
      <AppModal
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        title="Update Product"
        isDismissable={false}
        hideCloseButton
        size="5xl"
        scrollBehavior="inside"
      >
        <UpdateProductForm
          onClose={() => setIsEditOpen(false)}
          product={product}
        />
      </AppModal>

      {/* 2. Publish toggle confirmation dialog */}
      <Dialog open={isPublishOpen} onOpenChange={setIsPublishOpen}>
        <DialogContent className="sm:max-w-[420px] bg-card border border-border/80 rounded-2xl select-none">
          <DialogHeader>
            <DialogTitle className="text-foreground font-extrabold text-base">
              {product?.isPublished ? "Draft Product" : "Publish Product"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-2 leading-relaxed font-semibold">
              Are you sure you want to change the status of{" "}
              <b>{product?.name}</b> to{" "}
              <b>{product?.isPublished ? "Draft" : "Published"}</b>? This will
              immediately toggle its storefront visibility.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsPublishOpen(false)}
              className="text-xs font-semibold rounded-xl h-10 px-5 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted/30"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={togglePublishMutation.isPending}
              onClick={() => {
                togglePublishMutation.mutate({
                  productId: product._id,
                  isPublished: !product.isPublished,
                });
              }}
              className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold h-10 px-5 rounded-xl cursor-pointer"
            >
              {togglePublishMutation.isPending
                ? "Updating..."
                : `Yes, ${product?.isPublished ? "Draft" : "Publish"}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. Delete confirmation dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[420px] bg-card border border-border/80 rounded-2xl select-none">
          <DialogHeader>
            <DialogTitle className="text-foreground font-extrabold text-base">
              Delete Product
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-2 leading-relaxed font-semibold">
              Are you sure you want to delete <b>{product?.name}</b>? This
              action cannot be undone and will permanently remove this item from
              catalog databases.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsDeleteOpen(false)}
              className="text-xs font-semibold rounded-xl h-10 px-5 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted/30"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={deleteProductMutation.isPending}
              onClick={() => {
                deleteProductMutation.mutate(product._id);
              }}
              className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold h-10 px-5 rounded-xl cursor-pointer"
            >
              {deleteProductMutation.isPending ? "Deleting..." : "Yes, Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. Add to campaign offer dialog */}
      <Dialog open={isOfferOpen} onOpenChange={setIsOfferOpen}>
        <DialogContent className="sm:max-w-[420px] bg-card border border-border/80 rounded-2xl select-none">
          <DialogHeader>
            <DialogTitle className="text-foreground font-extrabold text-base">
              Link Campaign Offer
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-5 font-inter text-xs pt-1 select-none">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none block">
                Select Discount Offer Campaign
              </label>
              <Select value={selectedOffer} onValueChange={setSelectedOffer}>
                <SelectTrigger className="bg-muted/30 border-border rounded-xl text-xs h-10 focus:ring-primary">
                  <SelectValue
                    placeholder={
                      offersLoading ? "Loading offers..." : "Select an offer"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-card border border-border/80">
                  {offers
                    .filter((o: any) => o?.isActive)
                    .map((offer: any) => (
                      <SelectItem
                        key={offer._id}
                        value={offer._id}
                        className="cursor-pointer font-semibold text-xs"
                      >
                        {offer.name} ({offer.percentageOff}% off)
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-4 flex gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOfferOpen(false)}
              className="text-xs font-semibold rounded-xl h-10 px-5 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted/30"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={addToOfferMutation.isPending || !selectedOffer}
              onClick={() => {
                addToOfferMutation.mutate({
                  offer: selectedOffer,
                  products: [product._id],
                });
              }}
              className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold h-10 px-5 rounded-xl cursor-pointer"
            >
              {addToOfferMutation.isPending ? "Linking..." : "Add to Offer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Navigation Breadcrumb ── */}
      <div className="flex items-center justify-between select-none">
        <Link
          href="/dashboard/products"
          className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          Back to products
        </Link>

        <button
          onClick={() => refetch()}
          className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
          title="Refresh Details"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* ── Page Hero Title & Control Actions ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none pb-4 border-b border-border/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-extrabold text-foreground tracking-tight">
              {product?.name}
            </h2>
            {product?.isPublished ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Published
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-zinc-500/10 text-zinc-500 border border-zinc-500/20">
                Draft
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground font-semibold">
            Product Code:{" "}
            <span className="font-mono text-[10px] select-all bg-muted/65 px-1.5 py-0.5 rounded text-foreground uppercase">
              {product?.productCode || `GSL-${product?._id.slice(-6).toUpperCase()}`}
            </span>
          </p>
        </div>

        {/* Unified Cockpit Actions bar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            onClick={() => setIsPublishOpen(true)}
            className="text-xs font-semibold h-9 px-4 rounded-xl border-border text-muted-foreground hover:text-foreground cursor-pointer hover:bg-muted/30"
          >
            {product?.isPublished ? "Set as Draft" : "Publish"}
          </Button>

          <Button
            variant="outline"
            onClick={() => setIsOfferOpen(true)}
            className="text-xs font-semibold h-9 px-4 rounded-xl border-border text-muted-foreground hover:text-foreground cursor-pointer hover:bg-muted/30 gap-1.5"
          >
            <Plus size={13} /> Add to Campaign
          </Button>

          <Button
            variant="outline"
            onClick={() => setIsDeleteOpen(true)}
            className="text-xs font-semibold h-9 px-4 rounded-xl border-red-200 dark:border-red-950 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer gap-1.5"
          >
            <Trash2 size={13} /> Delete Product
          </Button>

          <Button
            onClick={() => setIsEditOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold h-9 px-4 rounded-xl cursor-pointer shadow-xs gap-1.5"
          >
            <Edit2 size={13} /> Edit Product
          </Button>
        </div>
      </div>

      {/* ── 2:1 Shopify-style Layout split ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left Column: Primary Content (2/3) ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Description details */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4 shadow-xs">
            <div className="border-b border-border/60 pb-3 select-none">
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                Description
              </h3>
              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                Product specifications, features and marketing notes
              </p>
            </div>

            <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line select-text">
              {product?.description ||
                "No description provided for this product."}
            </div>
          </div>

          {/* Card 2: Image Showcase */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4 shadow-xs">
            <div className="border-b border-border/60 pb-3 flex items-center justify-between select-none">
              <div>
                <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                  Product Images
                </h3>
                <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                  Storefront gallery thumbnails
                </p>
              </div>
              <UpdateProductImage product={product} />
            </div>

            <div className="w-full pt-2">
              {product?.images && product.images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {product.images.map((img) => (
                    <div
                      key={img.public_id}
                      className="relative aspect-square rounded-xl overflow-hidden border border-border/60 bg-muted/20"
                    >
                      <Image
                        src={img.url}
                        alt="Product thumbnail"
                        fill
                        sizes="(max-w-768px) 50vw, 20vw"
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full py-8 rounded-xl bg-muted/10 border border-dashed border-border flex flex-col items-center justify-center gap-2 select-none">
                  <ImageOff className="w-6 h-6 text-muted-foreground/45" />
                  <p className="text-xs font-semibold text-muted-foreground">No images uploaded</p>
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Technical Specifications Datasheet */}
          {product?.showDatasheet &&
            product?.datasheet &&
            product.datasheet.length > 0 && (
              <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4 shadow-xs">
                <div className="border-b border-border/60 pb-3 select-none">
                  <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                    Technical datasheet
                  </h3>
                  <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                    Parameters shown on the product detail page
                  </p>
                </div>

                <div className="border border-border/60 rounded-xl overflow-hidden divide-y divide-border/50 select-text">
                  {product.datasheet.map((spec, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-3 text-xs p-3.5 hover:bg-muted/10 transition-colors"
                    >
                      <span className="font-semibold text-muted-foreground uppercase text-[9px] tracking-wider col-span-1">
                        {spec.key}
                      </span>
                      <span className="font-bold text-foreground col-span-2 pl-4">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* ── Right Column: Metadata & Controls (1/3) ── */}
        <div className="space-y-6">
          {/* Card 4: Inventory & Stock */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4 shadow-xs">
            <div className="border-b border-border/60 pb-3 flex items-center gap-2 select-none">
              <Package className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                Stock Level
              </h3>
            </div>

            <div className="pt-1">
              {product?.quantityInStock > 0 ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-semibold select-none">
                    <span
                      className={
                        product.quantityInStock < 10
                          ? "text-amber-500 font-bold"
                          : "text-emerald-500 font-bold"
                      }
                    >
                      {product.quantityInStock < 10
                        ? "Low stock threshold"
                        : "In stock"}
                    </span>
                    <span className="font-bold text-foreground">
                      {product.quantityInStock} units available
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden select-none">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        product.quantityInStock < 10
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{
                        width: `${Math.min((product.quantityInStock / 60) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-red-500/10 text-red-500 p-3.5 rounded-xl border border-red-500/20 text-xs font-bold text-center select-none">
                  Sold Out / Out of Stock
                </div>
              )}
            </div>
          </div>

          {/* Card 5: Pricing details */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4 shadow-xs">
            <div className="border-b border-border/60 pb-3 flex items-center gap-2 select-none">
              <Tag className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                Pricing
              </h3>
            </div>

            <div className="space-y-3 pt-1 select-none">
              <div>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">
                  Current Selling Price
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="font-black text-2xl text-primary">
                    {formatCurrency(newPrice, "NGN")}
                  </span>
                  {newPrice < product.price && (
                    <span className="line-through text-muted-foreground/60 text-sm font-semibold">
                      {formatCurrency(product.price, "NGN")}
                    </span>
                  )}
                </div>
              </div>

              <div className="border-t border-border/60 pt-3 space-y-2 text-xs">
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                    Regular Retail Price:
                  </span>
                  <span className="font-bold text-foreground">
                    {formatCurrency(product.price, "NGN")}
                  </span>
                </div>
                {product.discountPrice && product.discountPrice > 0 ? (
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                      Base Discount Price:
                    </span>
                    <span className="font-bold text-foreground">
                      {formatCurrency(product.discountPrice, "NGN")}
                    </span>
                  </div>
                ) : null}
              </div>

              {hasOffer && (
                <div className="bg-amber-500/10 text-amber-500 p-3 rounded-xl border border-amber-500/20 space-y-0.5">
                  <div className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    <p className="text-[10px] font-black uppercase tracking-wider">
                      {product?.currentOffer?.name}
                    </p>
                  </div>
                  <p className="text-[10px] font-semibold text-amber-600">
                    Active discount campaign applied (
                    {product?.currentOffer?.percentageOff}% off)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Card 6: Delivery & Logistics */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4 shadow-xs">
            <div className="border-b border-border/60 pb-3 flex items-center gap-2 select-none">
              <Truck className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                Delivery &amp; Logistics
              </h3>
            </div>

            <div className="space-y-3.5 pt-1 text-xs select-text">
              <div className="flex justify-between items-center py-0.5">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                  Shipping tier:
                </span>
                <span className="font-bold text-foreground capitalize">
                  {product?.shippingClass?.replace("_", " ") || "Standard"}
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                  Local city delivery:
                </span>
                <span className="font-bold text-foreground">
                  {formatCurrency(
                    product?.withinLocationDeliveryFee || 0,
                    "NGN",
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                  Interstate delivery:
                </span>
                <span className="font-bold text-foreground">
                  {formatCurrency(
                    product?.outsideLocationDeliveryFee || 0,
                    "NGN",
                  )}
                </span>
              </div>

              {product?.additionalInfo && (
                <div className="border-t border-border/60 pt-3 mt-1 text-[10px] text-muted-foreground/80 leading-relaxed font-semibold">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Additional details:
                  </p>
                  {product.additionalInfo}
                </div>
              )}
            </div>
          </div>

          {/* Card 7: Classification */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4 shadow-xs">
            <div className="border-b border-border/60 pb-3 flex items-center gap-2 select-none">
              <Layers className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                Classification
              </h3>
            </div>

            <div className="space-y-3.5 pt-1 text-xs select-text">
              <div className="flex justify-between items-center py-0.5">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                  Category shelf:
                </span>
                <span className="font-bold text-foreground">
                  {product?.category?.name || "Uncategorized"}
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                  Brand vendor:
                </span>
                <span className="font-bold text-foreground">
                  {product?.brand || "Generic"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProductComp;
export { SingleProductComp };
