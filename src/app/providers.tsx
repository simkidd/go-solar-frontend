"use client";

import { ThemeProvider } from "@/components/ThemeProvider";
import AuthProvider from "@/contexts/auth.context";
import BlogProvider from "@/contexts/blog.context";
import ProductProvider from "@/contexts/product.context";
import { NextUIProvider } from "@nextui-org/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NextUIProvider>
        <ProductProvider>
          <BlogProvider>
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
          </BlogProvider>
        </ProductProvider>
      </NextUIProvider>
    </AuthProvider>
  );
}
