import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-[9px] font-bold tracking-widest text-[var(--mt)] uppercase">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full px-3 py-2 bg-[var(--bg)] border border-[var(--bd)] rounded-md text-[var(--tx)] text-sm outline-none transition-all focus:border-[var(--go)] disabled:bg-[var(--c2)] disabled:cursor-not-allowed placeholder:text-[var(--mt)]",
            error && "border-[var(--rd)]",
            className
          )}
          {...props}
        />
        {error && <p className="text-[10px] text-[var(--rd)]">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
