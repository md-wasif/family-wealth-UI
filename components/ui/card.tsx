"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  danger?: boolean;
}

export const Card = ({ className, children, danger, ...props }: CardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={cn(
        "bg-gradient-to-br from-[var(--c1)] to-[var(--c2)] border border-[var(--bd)] rounded-xl p-5 shadow-lg relative overflow-hidden",
        danger && "border-[var(--rd)] shadow-[var(--rd-b)]",
        className
      )}
      {...props}
    >
      {/* Subtle background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
