import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  type: "critical" | "warning" | "info" | "success";
  children: React.ReactNode;
}

export const Badge = ({ type, children }: BadgeProps) => {
  const styles = {
    critical: "text-[var(--rd)] bg-[var(--rd-b)]",
    warning: "text-[var(--am)] bg-[var(--am-b)]",
    info: "text-[var(--bl)] bg-[var(--bl-b)]",
    success: "text-[var(--gr)] bg-[var(--gr-b)]",
  };

  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest",
        styles[type]
      )}
    >
      {children}
    </span>
  );
};

