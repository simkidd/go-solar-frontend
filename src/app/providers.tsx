"use client";

import { ThemeProvider } from "@/components/ThemeProvider";
import { SessionProvider } from "@/context/SessionContext";
import QueryProvider from "@/providers/Queryprovider";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <HeroUIProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <ToastContainer
              autoClose={2000}
              hideProgressBar={false}
              closeOnClick
              pauseOnHover
              theme="dark"
            />
            <ToastProvider placement="top-center" />
          </ThemeProvider>
        </HeroUIProvider>
      </QueryProvider>
    </SessionProvider>
  );
}
