"use client";

import { ThemeProvider } from "@/components/ThemeProvider";
import AuthGuard from "@/guards/AuthGuard";
import { NextUIProvider } from "@nextui-org/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <NextUIProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
              <ToastContainer
                autoClose={2000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                theme="dark"
              />
            </ThemeProvider>
      </NextUIProvider>
    </AuthGuard>
  );
}
