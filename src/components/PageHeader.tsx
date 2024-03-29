"use client";
import { usePathname } from "next/navigation";
import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";

const PageHeader = ({ name }: { name: string }) => {
  const pathname = usePathname();

  return (
    <div className="lg:py-28 py-10 w-full bg-gray-500">
      <div className="flex flex-col max-w-[1000px] mx-auto px-2">
        <h2 className="lg:text-5xl text-4xl font-bold mb-4">{name}</h2>
        <div>
          <Breadcrumbs
            separator="|"
            itemClasses={{
              separator: "px-2",
            }}
          >
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem href={pathname}>{name}</BreadcrumbItem>
          </Breadcrumbs>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
