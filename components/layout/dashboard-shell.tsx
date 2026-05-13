"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Sidebar } from "@/components/layout/sidebar";
import { AnimatePresence, motion } from "framer-motion";

// Dynamically import heavy views for performance
const DashboardView = dynamic(() => import("@/components/features/dashboard/dashboard-view"));
const TrustView = dynamic(() => import("@/components/features/trust/trust-view"));
const DocBuilderView = dynamic(() => import("@/components/features/docs/doc-builder-view"));
const PMAView = dynamic(() => import("@/components/features/pma/pma-view"));
const PersonalTaxView = dynamic(() => import("@/components/features/tax/personal-tax-view"));
const CashFlowView = dynamic(() => import("@/components/features/financial/cash-flow-view"));
const AIAdvisorView = dynamic(() => import("@/components/features/ai/ai-advisor-view"));
const VaultView = dynamic(() => import("@/components/features/vault/vault-view"));
const LLCView = dynamic(() => import("@/components/features/llc/llc-view"));
const ComplianceView = dynamic(() => import("@/components/features/compliance/compliance-view"));
const AuditLogView = dynamic(() => import("@/components/features/audit/audit-log-view"));
const SettingsView = dynamic(() => import("@/components/features/settings/settings-view"));

export default function DashboardShell() {
  const [activeTab, setActiveTab] = useState("dash");

  const renderContent = () => {
    switch (activeTab) {
      case "dash": return <DashboardView />;
      case "trust": return <TrustView />;
      case "docbuilder": return <DocBuilderView />;
      case "pma": return <PMAView />;
      case "personaltax": return <PersonalTaxView />;
      case "portfolio": return <CashFlowView />;
      case "ai": return <AIAdvisorView />;
      case "docs": return <VaultView />;
      case "llc": return <LLCView />;
      case "compliance": return <ComplianceView />;
      case "log": return <AuditLogView />;
      case "settings": return <SettingsView />;
      // Placeholders for remaining build.jsx modules
      case "profile":
      case "demand":
      case "gov":
      case "insurance":
      case "annuity":
      case "realestate":
      case "retirement":
      case "banking":
      case "debtmgr":
      case "tax":
      case "taxsavings":
      case "cashflow":
      case "billpay":
      case "pl":
      case "calendar":
      case "contacts":
      case "succession":
      case "clientcalls":
      case "opsmanual":
      case "pricing":
      case "alerts":
        return (
          <div className="flex flex-col items-center justify-center h-[70vh] text-[var(--mt)] py-20">
            <h2 className="text-xl font-bold uppercase tracking-widest">{activeTab}</h2>
            <p className="text-sm mt-2 font-mono text-[var(--go)]">Module architecture under migration...</p>
            <div className="mt-8 p-4 border border-[var(--bd)] rounded-xl bg-[var(--c1)] max-w-md text-center">
              <p className="text-xs text-[var(--dm)] leading-relaxed">
                The {activeTab} logic is being ported from build.jsx with enhanced Next.js 14 features and persistent database support.
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-[var(--mt)] py-20">
            <h2 className="text-xl font-bold uppercase tracking-widest">{activeTab}</h2>
            <p className="text-sm mt-2">Module not found.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-y-auto relative bg-[var(--bg)] custom-scrollbar">
        <div className="w-full px-4 md:px-10 py-6 md:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.3, ease: "circOut" }}
              className="space-y-6"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
