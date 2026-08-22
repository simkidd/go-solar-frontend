"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileQuestion, ArrowLeft, ShoppingBag } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="w-full font-inter min-h-[70vh] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
            <FileQuestion className="h-9 w-9 text-zinc-400 dark:text-zinc-500" strokeWidth={1.5} />
          </div>
        </div>

        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500 mb-2">
          Error 404
        </p>

        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-3">
          Page Not Found
        </h1>

        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Go Back
          </button>
          <Link
            href="/shop"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white transition-all text-xs font-semibold"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
