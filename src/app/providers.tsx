"use client";

import 'react-phone-number-input/style.css'
import { ThemeProvider } from "@/components/ThemeProvider";
import { SessionProvider } from "@/context/SessionContext";
import QueryProvider from "@/providers/Queryprovider";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster richColors closeButton position="top-right" />
        </ThemeProvider>
      </QueryProvider>
    </SessionProvider>
  );
}
