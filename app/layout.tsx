import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Family Wealth Command Center",
  description: "Complete Estate Management Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          inter.variable,
          mono.variable,
          "min-h-screen bg-[var(--bg)] text-[var(--tx)] antialiased"
        )}
      >
        <Providers>
          {children}
        </Providers>
        <Toaster theme="dark" position="top-right" richColors />
      </body>
    </html>
  );
}
