"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface PageHeaderProps {
  heading: string;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  heading,
  className = "",
}) => {
  const pathname = usePathname(); // Get the current pathname

  const formatLabel = (path: string) => {
    // Replace hyphens with spaces and capitalize each word
    return path
      .replace(/-/g, " ") // Replace hyphens with spaces
      .split(" ") // Split into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(" "); // Join words with spaces
  };

  // Function to generate breadcrumb items based on the pathname
  const generateBreadcrumbs = () => {
    const paths = pathname.split("/").filter((path) => path !== ""); // Split the pathname into segments
    const breadcrumbs = [];

    // Add "Home" as the first breadcrumb
    breadcrumbs.push(
      <BreadcrumbItem key="home" href="/">
        Home
      </BreadcrumbItem>
    );

    // Generate breadcrumbs for each path segment
    let currentPath = "";
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      breadcrumbs.push(
        <BreadcrumbItem key={path} href={currentPath}>
          {formatLabel(path)}
        </BreadcrumbItem>
      );
    });

    return breadcrumbs;
  };

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
            <Breadcrumbs
              size="lg"
              itemClasses={{
                separator: "px-2 text-default-400 dark:text-default-500",
                item: "text-default-400 dark:text-default-500 data-[current=true]:text-white dark:data-[current=true]:text-white",
              }}
              separator="/"
            >
              {generateBreadcrumbs()}
            </Breadcrumbs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
