"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import LogoIcon from "@/assets/gosolar-logo-icon.svg";

export interface LogoProps {
  href?: string | null;
  size?: "sm" | "md" | "lg" | number;
  showText?: boolean;
  className?: string;
  textClassName?: string;
  iconClassName?: string;
  onClick?: () => void;
  priority?: boolean;
}

const sizeMap = {
  sm: { iconSize: 28, textSize: "text-base", mt: "mt-1" },
  md: { iconSize: 34, textSize: "text-lg", mt: "mt-1.5" },
  lg: { iconSize: 42, textSize: "text-xl", mt: "mt-2" },
};

export const Logo: React.FC<LogoProps> = ({
  href = "/",
  size = "md",
  showText = true,
  className = "",
  textClassName = "",
  iconClassName = "",
  onClick,
  priority = false,
}) => {
  const isNamedSize = typeof size === "string" && size in sizeMap;
  const config = isNamedSize
    ? sizeMap[size as keyof typeof sizeMap]
    : {
        iconSize: typeof size === "number" ? size : 34,
        textSize: "text-lg",
        mt: "mt-1.5",
      };

  const content = (
    <div className={`flex items-center gap-2 shrink-0 ${className}`}>
      <Image
        src={LogoIcon}
        alt="GoSolar Logo"
        width={config.iconSize}
        height={config.iconSize}
        className={`object-contain ${iconClassName}`}
        style={{ height: "auto" }}
        priority={priority}
      />
      {showText && (
        <span
          className={`font-bold tracking-tight text-zinc-900 dark:text-white ${config.textSize} ${config.mt} ${textClassName}`}
        >
          GoSolar <span className="text-primary">Ng</span>
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className="inline-flex shrink-0">
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
