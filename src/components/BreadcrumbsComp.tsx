"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BreadcrumbsComp = () => {
  const pathname = usePathname();

  const formatLabel = (path: string) => {
    return path
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const paths = pathname.split("/").filter((path) => path !== "");

  return (
    <nav className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm font-semibold text-zinc-400 dark:text-zinc-500">
      <Link href="/" className="hover:text-white transition-colors">
        Home
      </Link>
      {paths.map((path, index) => {
        const currentPath = `/${paths.slice(0, index + 1).join("/")}`;
        const isLast = index === paths.length - 1;
        return (
          <React.Fragment key={path}>
            <span className="text-zinc-500 select-none">/</span>
            {isLast ? (
              <span className="text-white font-bold select-none">{formatLabel(path)}</span>
            ) : (
              <Link href={currentPath} className="hover:text-white transition-colors">
                {formatLabel(path)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default BreadcrumbsComp;
