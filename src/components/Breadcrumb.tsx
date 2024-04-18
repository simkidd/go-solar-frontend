"use client";
import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { usePathname } from "next/navigation";

const BreadcrumbComp: React.FC<{ name: string }> = ({ name }) => {
  const pathname = usePathname();

  const segments = pathname.split("/").filter((segment) => segment);

  // Generate breadcrumbs from segments
  const breadcrumbsRender = segments.map((segment, index) => {
    // Combine segments up to the current index to get the breadcrumb path
    const breadcrumbPath = `/${segments.slice(0, index + 1).join("/")}`;
    // Use the segment as the label for the breadcrumb
    return (
      <BreadcrumbItem
        key={segment + index}
        href={breadcrumbPath}
        className={`text-gray-400 ${
          index !== segments.length - 1 ? "capitalize" : ""
        } ${index === segments.length - 1 ? "text-inherit" : ""}`}
      >
        {index === segments.length - 1 ? name : segment}
      </BreadcrumbItem>
    );
  });

  return (
    <Breadcrumbs
      separator="|"
      itemClasses={{
        separator: "px-2",
        item: "text-wrap",
      }}
    >
      <BreadcrumbItem href="/" className="text-gray-400">
        Home
      </BreadcrumbItem>
      {/* <BreadcrumbItem href={pathname}>{name}</BreadcrumbItem> */}
      {breadcrumbsRender}
    </Breadcrumbs>
  );
};

export default BreadcrumbComp;
