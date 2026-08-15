"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MProps {
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  size?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "full";
  scrollBehavior?: "normal" | "inside";
  isDismissable?: boolean;
  hideCloseButton?: boolean;
}

const AppModal: React.FC<MProps> = ({
  children,
  isOpen,
  onOpenChange,
  title,
  size = "md",
  scrollBehavior = "normal",
  isDismissable = true,
  hideCloseButton = false,
}) => {
  // Map size prop to Tailwind max-width classes
  const sizeClasses: Record<string, string> = {
    xs: "max-w-xs",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    full: "max-w-[95vw]",
  };

  const maxWidthClass = sizeClasses[size] || "max-w-md";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${maxWidthClass} w-full dark:bg-[#222327] dark:border-zinc-800 flex p-0 flex-col`}
        onPointerDownOutside={(e) => {
          if (!isDismissable) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader className=" p-6 pb-2">
          <DialogTitle className="text-xl font-bold dark:text-white leading-none">
            {title}
          </DialogTitle>
        </DialogHeader>
        {scrollBehavior === "inside" ? (
          <ScrollArea className="flex-1 max-h-[80vh] px-6 pb-4">
            {children}
          </ScrollArea>
        ) : (
          <div className="flex-1">{children}</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AppModal;
