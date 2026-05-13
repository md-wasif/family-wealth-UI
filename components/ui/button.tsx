"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "blue" | "green";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: "bg-[var(--go)] text-[var(--bg)] hover:opacity-90",
      secondary: "bg-[var(--c2)] text-[var(--tx)] border border-[var(--bd)] hover:bg-[var(--bd)]",
      danger: "bg-[var(--rd)] text-[var(--bg)] hover:opacity-90",
      ghost: "bg-transparent text-[var(--dm)] border border-[var(--bd)] hover:bg-[var(--c2)]",
      blue: "bg-[var(--bl)] text-[var(--bg)] hover:opacity-90",
      green: "bg-[var(--gr)] text-[var(--bg)] hover:opacity-90",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <motion.button
        whileTap={{ scale: 0.98 }}
        disabled={isLoading || disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-semibold transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
