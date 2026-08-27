"use client";

import 'react-phone-number-input/style.css'
import { ThemeProvider } from "@/components/ThemeProvider";
import { SessionProvider } from "@/context/SessionContext";
import QueryProvider from "@/providers/Queryprovider";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import FinancingApplyModal from "@/components/custom/FinancingApplyModal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <SessionProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Suspense fallback={null}>
            <FinancingApplyModal />
          </Suspense>
          <Toaster richColors closeButton position="top-right" />
        </ThemeProvider>
      </SessionProvider>
    </QueryProvider>
  );
}
