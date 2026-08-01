import Link from "next/link";
import React from "react";
import { IconType } from "react-icons";

interface CategoryCardProps {
  name: string;
  icon: IconType;
  link: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  icon: Icon,
  link,
}) => {
  return (
    <Link href={link} className="group font-inter block">
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 shadow-xs hover:border-[#08AA08] hover:shadow-md transition-all duration-300">
        <div className="text-2xl mb-4 flex items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-850 group-hover:bg-[#08AA08]/10 group-hover:text-[#08AA08] w-12 h-12 transition-all duration-300">
          <Icon className="group-hover:scale-110 transition-transform duration-300" />
        </div>
        <p className="font-bold text-xs text-zinc-800 dark:text-zinc-200 text-center tracking-wide line-clamp-1">{name}</p>
      </div>
    </Link>
  );
};

export default CategoryCard;
