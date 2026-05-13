"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stat } from "@/components/ui/stat";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { formatCurrency } from "@/lib/utils";
import { Building2, Plus, FileText, Users, Download, Printer, Save, Gavel } from "lucide-react";
import { toast } from "sonner";

export const LLCView = () => {
  const [activeSubTab, setActiveSubTab] = useState("overview");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [agreementText, setAgreementText] = useState("");

  const llcData = {
    name: "Akhtar Holdings LLC",
    state: "Wyoming",
    ein: "XX-XXXXXXX",
    status: "Active",
    totalCapital: 850000,
  };

  const members = [
    { name: "Wasif Akhtar Private Family Trust", ownership: 98, contribution: 833000, role: "Managing Member" },
    { name: "Wasif Akhtar", ownership: 2, contribution: 17000, role: "Manager" },
  ];

  const generateAgreement = () => {
    const text = `OPERATING AGREEMENT
${llcData.name.toUpperCase()}
A ${llcData.state} Limited Liability Company
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This Operating Agreement is entered into as of January 1, 2024, by and among the members listed below.

1. FORMATION: The Company has been formed as a ${llcData.state} LLC by filing Articles of Organization with the Secretary of State.

2. PURPOSE: The purpose of the Company is to engage in any lawful business for which an LLC may be organized in ${llcData.state}, specifically holding and managing private family assets.

3. MEMBERS & CAPITAL:
${members.map(m => `- ${m.name}: ${m.ownership}% Ownership (${formatCurrency(m.contribution)} Capital)`).join('\n')}

4. MANAGEMENT: The Company shall be managed by a Manager. The initial Manager shall be ${llcData.name === "Akhtar Holdings LLC" ? "Wasif Akhtar" : "[Manager Name]"}.

5. DISTRIBUTIONS: Distributions shall be made at the discretion of the Manager in proportion to ownership interests.

6. DISSOLUTION: The Company shall dissolve upon the unanimous consent of all Members or as required by law.

IN WITNESS WHEREOF, the Members have executed this Agreement.

Signed: ___________________________
        Wasif Akhtar, Manager
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    setAgreementText(text);
    setIsPreviewOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-[var(--cy-b)] flex items-center justify-center border border-[var(--cy)]/20">
            <Building2 className="h-6 w-6 text-[var(--cy)]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[var(--wh)]">{llcData.name}</h1>
            <p className="text-[var(--mt)] text-xs font-bold tracking-widest uppercase">
              {llcData.state} LLC • EIN: {llcData.ein} • Status: {llcData.status}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={generateAgreement}>
            <Gavel className="h-4 w-4 mr-2" />
            Operating Agreement
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Stat label="Total Capital Account" value={formatCurrency(llcData.totalCapital)} color="var(--cy)" />
        <Stat label="Active Members" value={members.length.toString()} color="var(--bl)" />
        <Stat label="Annual Franchise Tax" value="$50.00" sub="Due: 2025-01-01" color="var(--rd)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Member Registry */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[var(--bl)]" />
            <h3 className="text-sm font-black uppercase tracking-widest text-[var(--wh)]">Member Registry</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--bd)]">
                  <th className="py-2 text-[9px] font-black uppercase tracking-widest text-[var(--mt)]">Member Name</th>
                  <th className="py-2 text-[9px] font-black uppercase tracking-widest text-[var(--mt)]">Role</th>
                  <th className="py-2 text-[9px] font-black uppercase tracking-widest text-[var(--mt)]">Ownership</th>
                  <th className="py-2 text-right text-[9px] font-black uppercase tracking-widest text-[var(--mt)]">Capital</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--bd)]/50">
                {members.map((m, i) => (
                  <tr key={i} className="hover:bg-[var(--c1)] transition-colors">
                    <td className="py-3 pr-4 text-xs font-bold text-[var(--tx)]">{m.name}</td>
                    <td className="py-3 pr-4">
                      <Badge type={m.role === "Managing Member" ? "info" : "success"}>{m.role}</Badge>
                    </td>
                    <td className="py-3 pr-4 text-xs font-mono font-bold text-[var(--bl)]">{m.ownership}%</td>
                    <td className="py-3 text-right text-xs font-mono font-bold text-[var(--tx)]">{formatCurrency(m.contribution)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Formation Documents */}
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-[var(--wh)]">Formation Docs</h3>
          <div className="space-y-3">
            {[
              { label: "Articles of Organization", date: "2024-01-01" },
              { label: "Wyoming Filing Receipt", date: "2024-01-02" },
              { label: "EIN Confirmation", date: "2024-01-05" },
            ].map((doc, i) => (
              <Card key={i} className="p-3 hover:border-[var(--cy)] transition-all cursor-pointer group">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-[var(--mt)] group-hover:text-[var(--cy)]" />
                    <div>
                      <p className="text-xs font-bold text-[var(--tx)]">{doc.label}</p>
                      <p className="text-[9px] text-[var(--mt)]">{doc.date}</p>
                    </div>
                  </div>
                  <Download className="h-4 w-4 text-[var(--bd2)] group-hover:text-[var(--tx)]" />
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <Modal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        title="Operating Agreement Preview"
      >
        <div className="space-y-6">
          <pre className="bg-[var(--bg)] p-6 rounded-lg border border-[var(--bd)] text-[11px] font-mono leading-relaxed text-[var(--tx)] whitespace-pre-wrap overflow-x-auto min-h-[400px]">
            {agreementText}
          </pre>
          
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setIsPreviewOpen(false)}>Edit Terms</Button>
            <Button variant="ghost"><Printer className="h-4 w-4 mr-2" /> Print</Button>
            <Button variant="blue" onClick={() => {
              toast.success("Operating Agreement filed in Vault");
              setIsPreviewOpen(false);
            }}>
              <Save className="h-4 w-4 mr-2" /> File & Sign
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LLCView;
