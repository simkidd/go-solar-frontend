"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldX, ArrowLeft, Home } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-dvh bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center px-6 relative overflow-hidden transition-colors">
      {/* Background decorative blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-200/40 dark:bg-red-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.04)_1px,_transparent_1px)] dark:bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.02)_1px,_transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* Card */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
        {/* Icon */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 rounded-2xl bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center justify-center">
            <ShieldX className="h-10 w-10 text-red-500 dark:text-red-400" strokeWidth={1.5} />
          </div>
          {/* Ping animation */}
          <div className="absolute inset-0 rounded-2xl border border-red-300 dark:border-red-500/20 animate-ping opacity-30" />
        </div>

        {/* Error code */}
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-red-500/80 dark:text-red-400/80 mb-3">
          Error 401
        </p>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight mb-4">
          Access Denied
        </h1>

        {/* Description */}
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-10 max-w-sm">
          You don&apos;t have the required permissions to view this page. If you
          believe this is a mistake, please contact your administrator.
        </p>

        {/* Actions */}
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

        {/* Footer note */}
        <p className="mt-10 text-[11px] text-zinc-400 dark:text-zinc-600">
          &copy; {new Date().getFullYear()} GoSolar &mdash; All rights reserved.
        </p>
      </div>
    </div>
  );
}

