"use client";

import React from "react";
import useCartStore from "@/lib/stores/cart.store";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PackageComponent } from "@/data/packages";

interface PkgDetails {
  id: string;
  name: string;
  price: number;
  slug: string;
  desc: string;
  spec: string;
  inverterRange: string;
  constituents: PackageComponent[];
}

const AddToCartBtn = ({ pkg }: { pkg: PkgDetails }) => {
  const { addItem, cartItems } = useCartStore();
  const router = useRouter();

  const handleAddToCart = () => {
    let addedCount = 0;
    pkg.constituents.forEach((item) => {
      // Check if this sub-product is already in the cart
      const exists = cartItems.some((cartItem) => cartItem.product._id === item.id);
      if (!exists) {
        addItem({
          product: {
            _id: item.id,
            name: item.name,
            slug: item.slug,
            price: item.price,
            description: `Part of the ${pkg.name}`,
            images: [],
            brand: "GoSolar",
            category: {
              _id: `cat-${item.categorySlug}`,
              name: item.categoryName,
              slug: item.categorySlug,
              description: `System category for ${item.categoryName}`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            additionalInfo: "Included inside packages installation configuration.",
            quantityInStock: 10,
            withinLocationDeliveryFee: 15000,
            outsideLocationDeliveryFee: 35000,
            isPublished: true,
            isDeleted: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            currentOffer: null as any,
            datasheet: [],
            showDatasheet: false,
          },
          qty: item.qty,
          deliveryFee: 15000,
        });
        addedCount++;
      }
    });

    if (addedCount > 0) {
      toast.success(`Added ${addedCount} package components to your cart! 🛒`);
    } else {
      toast.info("Package components are already in your cart.");
    }
  };

  const handleOrderSetup = () => {
    pkg.constituents.forEach((item) => {
      const exists = cartItems.some((cartItem) => cartItem.product._id === item.id);
      if (!exists) {
        addItem({
          product: {
            _id: item.id,
            name: item.name,
            slug: item.slug,
            price: item.price,
            description: `Part of the ${pkg.name}`,
            images: [],
            brand: "GoSolar",
            category: {
              _id: `cat-${item.categorySlug}`,
              name: item.categoryName,
              slug: item.categorySlug,
              description: `System category for ${item.categoryName}`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            additionalInfo: "Included inside packages installation configuration.",
            quantityInStock: 10,
            withinLocationDeliveryFee: 15000,
            outsideLocationDeliveryFee: 35000,
            isPublished: true,
            isDeleted: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            currentOffer: null as any,
            datasheet: [],
            showDatasheet: false,
          },
          qty: item.qty,
          deliveryFee: 15000,
        });
      }
    });
    router.push("/checkout");
  };

  return (
    <div className="space-y-3.5 pt-2">
      <Button
        onClick={handleAddToCart}
        className="w-full bg-[#08AA08] hover:bg-[#079907] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl h-11 shadow-sm flex items-center justify-center gap-2"
      >
        <ShoppingCart className="h-4 w-4" />
        Add Package Components to Cart
      </Button>

      <div className="flex gap-2">
        <Button
          onClick={handleOrderSetup}
          variant="outline"
          className="flex-1 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold rounded-xl h-11 text-xs"
        >
          Buy Now
        </Button>
        <a href="/contact-us" className="flex-1">
          <Button
            variant="outline"
            className="w-full border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold rounded-xl h-11 text-xs"
          >
            Talk to Expert
          </Button>
        </a>
      </div>
    </div>
  );
};

export default AddToCartBtn;
