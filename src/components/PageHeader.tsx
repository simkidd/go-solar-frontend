"use client";
import { usePathname } from "next/navigation";
import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";

const PageHeader = ({ name }: { name: string }) => {
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
        className={`text-gray-400 ${index !== segments.length - 1 ? "capitalize" : ""} ${index === segments.length - 1 ? "text-inherit" : ""}`}
      >
        {index === segments.length - 1 ? name : segment}
      </BreadcrumbItem>
    );
  });

  return (
    <div className="lg:py-28 py-10 w-full bg-gray-500">
      <div className="container mx-auto px-2">
        <div className="flex flex-col max-w-[1100px] mx-auto px-2">
          <h2 className="lg:text-5xl text-4xl font-bold mb-4">{name}</h2>
          <div>
            <Breadcrumbs
              separator="|"
              itemClasses={{
                separator: "px-2",
                item: "text-wrap",
              }}
            >
              <BreadcrumbItem href="/" className="text-gray-400">Home</BreadcrumbItem>
              {/* <BreadcrumbItem href={pathname}>{name}</BreadcrumbItem> */}
              {breadcrumbsRender}
            </Breadcrumbs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
