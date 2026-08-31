"use client";
import React from "react";
import Image from "next/image";
import LogoIcon from "@/assets/gosolar-logo-icon.svg";

const LoadingSpinner = () => {
  return (
    <div className="w-full min-h-dvh flex flex-col items-center justify-center bg-linear-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950  transition-colors duration-300">
      <div className="flex flex-col items-center">
        {/* Glow container for Logo */}
        <div className="relative flex items-center justify-center w-28 h-28 rounded-full bg-white dark:bg-zinc-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-zinc-200/50 dark:border-zinc-800/50">
          {/* Animated gradient spinning rings */}
          <div className="absolute -inset-1 rounded-full border border-emerald-500/10 dark:border-emerald-400/5"></div>

          {/* Main spinning orbit ring */}
          <div className="absolute -inset-2.5 rounded-full border-2 border-transparent border-t-emerald-500 border-r-emerald-500/30 animate-spin [animation-duration:1.5s]"></div>

          {/* Secondary slower counter-spinning ring */}
          <div className="absolute -inset-4 rounded-full border border-transparent border-b-emerald-600/40 border-l-emerald-600/10 animate-spin [animation-direction:reverse] [animation-duration:2.5s]"></div>

          {/* Glowing pulse ring in the background */}
          <div className="absolute inset-2 rounded-full bg-emerald-500/5 dark:bg-emerald-400/5 animate-ping [animation-duration:2s]"></div>

          {/* Logo container with scale pulsing */}
          <div className="relative flex items-center justify-center w-20 h-20 bg-zinc-50 dark:bg-zinc-950 rounded-full border border-zinc-100 dark:border-zinc-900 shadow-inner animate-pulse">
            <Image
              src={LogoIcon}
              alt="Go Solar Logo"
              width={44}
              height={44}
              className="object-contain drop-shadow-[0_2px_8px_rgba(8,170,8,0.15)]"
              priority
            />
          </div>
        </div>

        {/* Text Area */}
        <div className="mt-8 flex flex-col items-center space-y-1.5 text-center">
          <span className="font-dmsans text-lg font-bold tracking-widest bg-linear-to-r from-emerald-600 via-green-500 to-emerald-600 dark:from-emerald-400 dark:via-green-400 dark:to-emerald-400 bg-clip-text text-transparent uppercase">
            Go Solar
          </span>
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-medium tracking-wide text-zinc-500 dark:text-zinc-400">
              Powering your workspace
            </span>
            {/* Pulsing loading dots */}
            <span className="flex space-x-1 items-center justify-center h-2">
              <span className="w-1 h-1 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-bounce"></span>
              <span className="w-1 h-1 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
              <span className="w-1 h-1 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
