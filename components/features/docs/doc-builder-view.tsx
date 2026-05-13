"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Sparkles, CheckCircle2, Download, Mail } from "lucide-react";
import { toast } from "sonner";

const FORMATION_DOCS = [
  { id: "indenture", label: "Trust Indenture Declaration", type: "TRUST" },
  { id: "articles", label: "Articles of Association", type: "PMA" },
  { id: "bylaws", label: "Foundation Bylaws", type: "PMA" },
  { id: "agreement", label: "Trust-PMA Agreement", type: "BOTH" },
];

const TRANSACTIONAL_DOCS = [
  { id: "bos_ind", label: "Bill of Sale - Ind to Trust" },
  { id: "bos_biz", label: "Bill of Sale - Biz to Trust" },
  { id: "qcd", label: "Quitclaim Deed" },
  { id: "wd", label: "Warranty Deed" },
  { id: "don_cert", label: "Donation Certificate" },
];

export const DocBuilderView = () => {
  const [generatedDocs, setGeneratedDocs] = useState<string[]>(["indenture"]);
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  const handleGenerate = (id: string, label: string) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: `Generating ${label}...`,
        success: () => {
          setGeneratedDocs((prev) => [...prev, id]);
          return `${label} generated and filed!`;
        },
        error: "Failed to generate document.",
      }
    );
  };

  const handleBulkGenerate = () => {
    setIsBulkLoading(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 3000)),
      {
        loading: "Running AI formation sequence...",
        success: () => {
          setGeneratedDocs(FORMATION_DOCS.map(d => d.id));
          setIsBulkLoading(false);
          return "All formation documents generated!";
        },
        error: () => {
          setIsBulkLoading(false);
          return "Bulk generation failed.";
        }
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-[var(--pu-b)] flex items-center justify-center border border-[var(--pu)]/20">
            <FileText className="h-6 w-6 text-[var(--pu)]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[var(--wh)]">AI Document Builder</h1>
            <p className="text-[var(--dm)] text-xs font-bold tracking-widest uppercase">
              Formation Documents & Transactional Legal Suite
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Email Client
          </Button>
          <Button 
            size="sm" 
            variant="blue" 
            onClick={handleBulkGenerate}
            isLoading={isBulkLoading}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Bulk Generate
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <Card className="border-[var(--go)]/20 bg-gradient-to-br from-[var(--go-g)] to-transparent">
        <div className="flex gap-4">
          <Sparkles className="h-5 w-5 text-[var(--go)] shrink-0" />
          <div className="space-y-1">
            <h3 className="text-sm font-black text-[var(--wh)] uppercase tracking-widest">Intelligent Automation</h3>
            <p className="text-xs text-[var(--tx)] leading-relaxed">
              The builder auto-populates all legal templates using your Client Profile data. 
              Formation documents are locked after one-time generation to preserve legal integrity.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formation Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-black text-[var(--wh)] uppercase tracking-wider">Formation Documents</h2>
            <Badge type="info">ONE-TIME</Badge>
          </div>
          <div className="grid gap-3">
            {FORMATION_DOCS.map((doc) => {
              const isGenerated = generatedDocs.includes(doc.id);
              return (
                <Card 
                  key={doc.id}
                  className={cn(
                    "group relative overflow-hidden transition-all",
                    isGenerated ? "border-[var(--gr)]/30" : "hover:border-[var(--go)]"
                  )}
                >
                  <div className="flex justify-between items-center relative z-10">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={cn("text-sm font-bold", isGenerated ? "text-[var(--gr)]" : "text-[var(--wh)]")}>
                          {doc.label}
                        </p>
                        {isGenerated && <CheckCircle2 className="h-3 w-3 text-[var(--gr)]" />}
                      </div>
                      <p className="text-[10px] text-[var(--mt)] font-bold tracking-tighter uppercase mt-1">
                        Category: {doc.type} Document
                      </p>
                    </div>
                    {isGenerated ? (
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-[10px] h-8">View</Button>
                      </div>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-[10px] h-8"
                        onClick={() => handleGenerate(doc.id, doc.label)}
                      >
                        Generate
                      </Button>
                    )}
                  </div>
                  {isGenerated && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--gr-b)] to-transparent pointer-events-none" />
                  )}
                </Card>
              );
            })}
          </div>
        </section>

        {/* Transactional Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-black text-[var(--wh)] uppercase tracking-wider">Transactional Suite</h2>
            <Badge type="success">REPEATABLE</Badge>
          </div>
          <div className="grid gap-3">
            {TRANSACTIONAL_DOCS.map((doc) => (
              <Card 
                key={doc.id}
                className="hover:border-[var(--bl)] transition-all cursor-pointer group"
                onClick={() => handleGenerate(doc.id, doc.label)}
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm font-bold text-[var(--wh)] group-hover:text-[var(--bl)] transition-colors">
                    {doc.label}
                  </p>
                  <Plus className="h-4 w-4 text-[var(--mt)] group-hover:text-[var(--bl)]" />
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DocBuilderView;
