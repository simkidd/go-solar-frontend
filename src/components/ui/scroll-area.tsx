import * as React from "react";
import { cn } from "@/lib/utils";

export const ScrollArea = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-y-auto pr-1.5 max-h-[220px] scrollbar-thin scrollbar-thumb-zinc-250 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent transition-all duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
ScrollArea.displayName = "ScrollArea";
