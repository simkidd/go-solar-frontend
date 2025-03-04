"use client";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import { usePathname } from "next/navigation";

const BreadcrumbsComp = () => {
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
  );
};

export default BreadcrumbsComp;
