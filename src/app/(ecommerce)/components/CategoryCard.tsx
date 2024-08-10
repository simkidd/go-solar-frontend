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
    <Link href={link} className="group">
      <div className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-[#f1f1f1] dark:border-[#2a2b2f] group-hover:border-primary group-hover:border-2 transition-colors duration-300 ease-in-out">
        <div className="text-3xl mb-4 flex items-center justify-center rounded-full bg-[#f1f1f1] dark:bg-[#2a2b2f] w-14 h-14">
          <Icon />
        </div>
        <p className="font-medium text-sm">{name}</p>
      </div>
    </Link>
  );
};

export default CategoryCard;
