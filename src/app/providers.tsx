"use client";

import AuthProvider from "@/contexts/auth.context";
import BlogProvider from "@/contexts/blog.context";
import ProductProvider from "@/contexts/product.context";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NextUIProvider>
        <ProductProvider>
          <BlogProvider>
            <NextThemesProvider attribute="class" defaultTheme="dark">
              {children}
              <ToastContainer
                autoClose={2000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                theme="dark"
              />
            </NextThemesProvider>
          </BlogProvider>
        </ProductProvider>
      </NextUIProvider>
    </AuthProvider>
  );
}
