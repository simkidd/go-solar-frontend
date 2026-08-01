"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

interface CustomSliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  min: number;
  max: number;
  value: number[];
  onValueChange?: (value: number[]) => void;
}

export const CustomSlider = React.forwardRef<HTMLInputElement, CustomSliderProps>(
  ({ className, min, max, value, onValueChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Number(e.target.value);
      if (onValueChange) {
        onValueChange([val]);
      }
    };

    return (
      <div className="w-full flex items-center gap-3">
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          value={value[0]}
          onChange={handleChange}
          className={cn(
            "w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#08AA08] focus:outline-none focus:ring-2 focus:ring-emerald-500",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

CustomSlider.displayName = "CustomSlider";
export default CustomSlider;
