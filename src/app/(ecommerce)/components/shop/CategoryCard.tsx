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
    <Link href={link} className="group font-inter block ">
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-card border border-border/80 hover:border-primary/20 hover:shadow-md hover:shadow-primary/[0.01] transition-all duration-300">
        <div className="text-xl mb-3 flex items-center justify-center rounded-xl bg-muted group-hover:bg-primary/10 group-hover:text-primary w-11 h-11 transition-all duration-300 text-muted-foreground">
          <Icon className="group-hover:scale-105 transition-transform duration-300" />
        </div>
        <p className="font-black text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors text-center line-clamp-1">
          {name}
        </p>
      </div>
    </Link>
  );
};

export default CategoryCard;
