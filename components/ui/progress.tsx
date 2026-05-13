import React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number; // 0 to 100
  className?: string;
  color?: string;
}

export const Progress = ({ value, className, color }: ProgressProps) => {
  const percentage = Math.min(Math.max(value, 0), 100);
  
  return (
    <div className={cn("w-full bg-[var(--bg)] rounded-full h-2 overflow-hidden", className)}>
      <div
        className="h-full transition-all duration-500 ease-out rounded-full"
        style={{
          width: `${percentage}%`,
          backgroundColor: color || "var(--go)",
        }}
      />
    </div>
  );
};
