"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal = ({ isOpen, onClose, title, children, className }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      <div 
        className={cn(
          "relative w-full max-w-3xl bg-[var(--c1)] border border-[var(--bd)] rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300",
          className
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--bd)]">
          <h2 className="text-sm font-black text-[var(--wh)] uppercase tracking-widest">{title}</h2>
          <button onClick={onClose} className="text-[var(--mt)] hover:text-[var(--wh)] transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
