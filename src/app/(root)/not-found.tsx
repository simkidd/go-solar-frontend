"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="font-inter min-h-dvh flex flex-col items-center justify-center px-6 relative overflow-hidden bg-zinc-50 dark:bg-zinc-950 transition-colors">
      {/* Background decorative blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.04)_1px,_transparent_1px)] dark:bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.02)_1px,_transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
        {/* Icon */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-center">
            <FileQuestion className="h-10 w-10 text-zinc-400 dark:text-zinc-500" strokeWidth={1.5} />
          </div>
          <div className="absolute inset-0 rounded-2xl border border-zinc-300 dark:border-zinc-700/40 animate-ping opacity-20" />
        </div>

        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500 mb-3">
          Error 404
        </p>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight mb-4">
          Page Not Found
        </h1>

        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-10 max-w-sm">
          The page you&apos;re looking for doesn&apos;t exist, was moved, or the
          link may be broken.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 w-full sm:w-auto flex-1 px-5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-all duration-200 text-sm font-semibold cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full sm:w-auto flex-1 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white transition-all duration-200 text-sm font-semibold"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <p className="mt-10 text-[11px] text-zinc-400 dark:text-zinc-600">
          &copy; {new Date().getFullYear()} GoSolar Ng &mdash; All rights reserved.
        </p>
      </div>
    </div>
  );
}
