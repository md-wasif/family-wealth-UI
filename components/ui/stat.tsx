"use client";

import React from "react";
import { motion } from "framer-motion";

interface StatProps {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  icon?: React.ReactNode;
}

export const Stat = ({ label, value, sub, color, icon }: StatProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="bg-gradient-to-br from-[var(--c1)] to-[var(--c2)] border border-[var(--bd)] rounded-xl p-5 flex-1 min-w-[160px] shadow-lg relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="relative z-10">
        <div className="text-[10px] text-[var(--mt)] uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
          {icon && <span className="text-[var(--mt)]">{icon}</span>}
          {label}
        </div>
        <div
          className="text-2xl font-black font-mono tracking-tight"
          style={{ color: color || "var(--go)" }}
        >
          {value}
        </div>
        {sub && <div className="text-[10px] text-[var(--dm)] mt-0.5 font-medium">{sub}</div>}
      </div>
    </motion.div>
  );
};
