"use client";
import React from "react";
import { cn } from "@/lib/utils";
import BreadcrumbsComp from "./BreadcrumbsComp";

interface PageHeaderProps {
  heading: string;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ heading, className = "" }) => {
  return (
    <div
      className={cn("w-full bg-gray-500 py-10 lg:py-36 relative", className)}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/40 z-10" />
      <div className="container mx-auto px-2 z-10 drop-shadow-md relative mt-28">
        <div className="mx-auto flex max-w-[1100px] flex-col px-2">
          <h2
            className="mb-4 text-4xl font-bold capitalize lg:text-5xl"
            aria-label={heading}
          >
            {heading}
          </h2>
          <div>
            <BreadcrumbsComp />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
