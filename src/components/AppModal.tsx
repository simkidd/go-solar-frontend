"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MProps {
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full" | string;
  scrollBehavior?: "normal" | "inside" | string;
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
    <Dialog 
      open={isOpen} 
      onOpenChange={onOpenChange}
    >
      <DialogContent 
        className={`${maxWidthClass} w-full dark:bg-[#222327] dark:border-zinc-800 p-6 flex flex-col`}
        onPointerDownOutside={(e) => {
          if (!isDismissable) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-bold dark:text-white leading-none">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div 
          className={`flex-1 pr-1 ${
            scrollBehavior === "inside" 
              ? "overflow-y-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800" 
              : ""
          }`}
        >
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppModal;
