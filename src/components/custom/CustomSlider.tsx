"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

interface CustomSliderProps {
  className?: string;
  min: number;
  max: number;
  value: number[];
  onValueChange?: (value: number[]) => void;
}

export const CustomSlider: React.FC<CustomSliderProps> = ({
  className,
  min,
  max,
  value,
  onValueChange,
}) => {
  const minVal = value[0] !== undefined ? value[0] : min;
  const maxVal = value[1] !== undefined ? value[1] : max;

  // Clamp values for the visual sliders
  const visualMinVal = Math.max(min, Math.min(max, minVal));
  const visualMaxVal = Math.max(min, Math.min(max, maxVal));

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), visualMaxVal - 1);
    if (onValueChange) {
      onValueChange([val, maxVal]);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), visualMinVal + 1);
    if (onValueChange) {
      onValueChange([minVal, val]);
    }
  };

  // Calculate percentage positions for active bar highlight
  const minPercent = ((visualMinVal - min) / (max - min)) * 100;
  const maxPercent = ((visualMaxVal - min) / (max - min)) * 100;

  return (
    <div className={cn("relative w-full flex flex-col items-center justify-center h-5 select-none", className)}>
      {/* Custom Track */}
      <div className="absolute left-0 right-0 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
      
      {/* Highlighted range track fill */}
      <div
        className="absolute h-1.5 bg-primary dark:bg-emerald-500 rounded-full"
        style={{
          left: `${minPercent}%`,
          right: `${100 - maxPercent}%`,
        }}
      />

      {/* Overlapping transparent range inputs */}
      <input
        type="range"
        min={min}
        max={max}
        value={visualMinVal}
        onChange={handleMinChange}
        className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none focus:outline-none z-20 
          [&::-webkit-slider-thumb]:pointer-events-auto 
          [&::-webkit-slider-thumb]:appearance-none 
          [&::-webkit-slider-thumb]:w-4 
          [&::-webkit-slider-thumb]:h-4 
          [&::-webkit-slider-thumb]:rounded-full 
          [&::-webkit-slider-thumb]:bg-primary 
          [&::-webkit-slider-thumb]:cursor-pointer 
          [&::-webkit-slider-thumb]:border-2 
          [&::-webkit-slider-thumb]:border-white 
          [&::-webkit-slider-thumb]:shadow-md 
          [&::-webkit-slider-thumb]:hover:scale-110 
          [&::-webkit-slider-thumb]:transition-transform

          [&::-moz-range-thumb]:pointer-events-auto 
          [&::-moz-range-thumb]:w-4 
          [&::-moz-range-thumb]:h-4 
          [&::-moz-range-thumb]:rounded-full 
          [&::-moz-range-thumb]:bg-primary 
          [&::-moz-range-thumb]:cursor-pointer 
          [&::-moz-range-thumb]:border-2 
          [&::-moz-range-thumb]:border-white 
          [&::-moz-range-thumb]:shadow-md 
          [&::-moz-range-thumb]:hover:scale-110 
          [&::-moz-range-thumb]:transition-transform"
      />
      <input
        type="range"
        min={min}
        max={max}
        value={visualMaxVal}
        onChange={handleMaxChange}
        className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none focus:outline-none z-20 
          [&::-webkit-slider-thumb]:pointer-events-auto 
          [&::-webkit-slider-thumb]:appearance-none 
          [&::-webkit-slider-thumb]:w-4 
          [&::-webkit-slider-thumb]:h-4 
          [&::-webkit-slider-thumb]:rounded-full 
          [&::-webkit-slider-thumb]:bg-primary 
          [&::-webkit-slider-thumb]:cursor-pointer 
          [&::-webkit-slider-thumb]:border-2 
          [&::-webkit-slider-thumb]:border-white 
          [&::-webkit-slider-thumb]:shadow-md 
          [&::-webkit-slider-thumb]:hover:scale-110 
          [&::-webkit-slider-thumb]:transition-transform

          [&::-moz-range-thumb]:pointer-events-auto 
          [&::-moz-range-thumb]:w-4 
          [&::-moz-range-thumb]:h-4 
          [&::-moz-range-thumb]:rounded-full 
          [&::-moz-range-thumb]:bg-primary 
          [&::-moz-range-thumb]:cursor-pointer 
          [&::-moz-range-thumb]:border-2 
          [&::-moz-range-thumb]:border-white 
          [&::-moz-range-thumb]:shadow-md 
          [&::-moz-range-thumb]:hover:scale-110 
          [&::-moz-range-thumb]:transition-transform"
      />
    </div>
  );
};

export default CustomSlider;
