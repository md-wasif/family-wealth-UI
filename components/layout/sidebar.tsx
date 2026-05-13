"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  User, 
  FileEdit, 
  Shield, 
  Mail, 
  GanttChart, 
  PieChart, 
  Building2, 
  Heart, 
  Umbrella, 
  ArrowUpRight, 
  Home, 
  Sun, 
  Building, 
  Layers, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  TrendingUp, 
  Files, 
  Calendar, 
  Users, 
  RotateCcw, 
  Sparkles, 
  Phone, 
  BookOpen, 
  Zap, 
  History, 
  AlertTriangle, 
  Settings,
  Scale
} from "lucide-react";

const NAV_ITEMS = [
  { id: "dash", label: "Dashboard", icon: LayoutDashboard },
  { id: "profile", label: "Client Profile", icon: User },
  { id: "docbuilder", label: "Doc Builder", icon: FileEdit },
  { id: "trust", label: "Trust", icon: Shield },
  { id: "demand", label: "Demand Notes", icon: Mail },
  { id: "gov", label: "Governance", icon: Scale },
  { id: "portfolio", label: "Portfolio", icon: PieChart },
  { id: "llc", label: "LLC", icon: Building2 },
  { id: "pma", label: "Foundation", icon: Heart },
  { id: "insurance", label: "Insurance", icon: Umbrella },
  { id: "annuity", label: "Annuities", icon: ArrowUpRight },
  { id: "realestate", label: "Real Estate", icon: Home },
  { id: "retirement", label: "Retirement", icon: Sun },
  { id: "banking", label: "Banking", icon: Building },
  { id: "debtmgr", label: "Debt", icon: Layers },
  { id: "personaltax", label: "1040 Personal", icon: DollarSign },
  { id: "tax", label: "1041 Trust", icon: FileText },
  { id: "taxsavings", label: "Tax Savings", icon: CheckCircle },
  { id: "cashflow", label: "Cash Flow", icon: TrendingUp },
  { id: "billpay", label: "Bill Pay", icon: DollarSign }, // Reusing icon for billpay
  { id: "compliance", label: "Compliance", icon: Shield },
  { id: "pl", label: "P&L", icon: FileText },
  { id: "docs", label: "Documents", icon: Files },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "contacts", label: "Contacts", icon: Users },
  { id: "succession", label: "Succession", icon: RotateCcw },
  { id: "ai", label: "AI Advisor", icon: Sparkles },
  { id: "clientcalls", label: "Client Calls", icon: Phone },
  { id: "opsmanual", label: "Ops Manual", icon: BookOpen },
  { id: "pricing", label: "Plan Overview", icon: Zap },
  { id: "log", label: "Audit Log", icon: History },
  { id: "alerts", label: "Alerts", icon: AlertTriangle },
  { id: "settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  return (
    <aside className="w-64 bg-[var(--c1)] border-r border-[var(--bd)] flex flex-col overflow-y-auto">
      <div className="p-6 border-b border-[var(--bd)] shrink-0">
        <h1 className="text-sm font-black tracking-[0.2em] text-[var(--go)] uppercase">
          Family Wealth
        </h1>
        <p className="text-[9px] font-bold text-[var(--mt)] mt-1 tracking-widest uppercase">
          Command Center v4.0
        </p>
      </div>
      
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto custom-scrollbar">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-100",
              activeTab === item.id
                ? "bg-[var(--go-g)] text-[var(--go)] border-l-2 border-[var(--go)]"
                : "text-[var(--dm)] hover:bg-[var(--c2)] hover:text-[var(--tx)] border-l-2 border-transparent"
            )}
          >
            <item.icon className={cn("h-4 w-4 shrink-0", activeTab === item.id ? "text-[var(--go)]" : "text-[var(--mt)]")} />
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="p-4 mt-auto border-t border-[var(--bd)] bg-[var(--bg)]/50 shrink-0">
        <div className="flex items-center gap-3 px-2">
          <div className="h-8 w-8 rounded-full bg-[var(--go)] flex items-center justify-center text-[var(--bg)] font-black text-xs">
            WA
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[var(--tx)] truncate">Wasif Akhtar</p>
            <p className="text-[9px] text-[var(--mt)] font-semibold uppercase tracking-wider">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
