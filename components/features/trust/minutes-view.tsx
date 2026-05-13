"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { formatCurrency } from "@/lib/utils";
import { FileText, Printer, Download, Save, History, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const MinutesView = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [minutesText, setMinutesText] = useState("");
  const [history, setHistory] = useState([
    { id: 1, date: "2024-03-31", type: "Quarterly Meeting", status: "FILED" },
    { id: 2, date: "2023-12-31", type: "Annual Meeting", status: "FILED" },
  ]);

  // This would ideally pull from a global state or API
  const generateMinutes = () => {
    const today = new Date().toLocaleDateString();
    const text = `TRUST MEETING MINUTES
Wasif Akhtar Private Family Trust
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Date: ${today}
Type: Regular Quarterly Meeting
Location: Private Office / Virtual
Called to Order: 10:00 AM

ATTENDANCE:
Trustees Present: Wasif Akhtar, [Successor Name]
Protector: [Protector Name]

FINANCIAL REPORT:
Total Assets (Cost Basis): ${formatCurrency(8400000)}
Demand Note Balance: ${formatCurrency(4200000)}
Current Cash Position: ${formatCurrency(1250000)}

BOARD RESOLUTIONS:
1. RESOLVED, that the Board of Trustees has reviewed all asset transfers 
   since the last meeting and confirms they were executed at cost basis 
   with corresponding Demand Notes issued.
   
2. RESOLVED, that all discretionary draws against Demand Notes were 
   reviewed and found to be in compliance with the Trust Indenture.

OLD BUSINESS:
[No outstanding items from previous meetings]

NEW BUSINESS:
- Review of upcoming tax deadlines
- Planning for foundation contribution (60% AGI target)

ADJOURNMENT:
Meeting adjourned at 11:30 AM.
Next meeting: 2024-09-30

Recorded by: ___________________________
Approved by: ___________________________`;

    setMinutesText(text);
    setIsPreviewOpen(true);
  };

  const handleFile = () => {
    toast.success("Minutes recorded and filed in Document Vault");
    setHistory(prev => [{ id: Date.now(), date: new Date().toISOString().split('T')[0], type: "Quarterly Meeting", status: "FILED" }, ...prev]);
    setIsPreviewOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm font-black text-[var(--wh)] uppercase tracking-widest">Meeting Minutes</h2>
          <p className="text-[10px] text-[var(--mt)] font-bold tracking-tighter mt-1 uppercase">
            Quarterly Compliance & Governance Trail
          </p>
        </div>
        <Button size="sm" onClick={generateMinutes}>
          <FileText className="h-4 w-4 mr-2" />
          Generate Minutes
        </Button>
      </div>

      <Card className="bg-gradient-to-br from-[var(--go-g)] to-transparent border-[var(--go)]/20">
        <div className="flex gap-4">
          <div className="h-10 w-10 rounded-lg bg-[var(--go)]/10 flex items-center justify-center shrink-0">
            <History className="h-5 w-5 text-[var(--go)]" />
          </div>
          <div>
            <h3 className="text-xs font-black text-[var(--wh)] uppercase tracking-widest mb-1">Compliance Requirement</h3>
            <p className="text-[11px] text-[var(--tx)] leading-relaxed">
              Minutes must be recorded at least quarterly to maintain the administrative integrity of the Trust. 
              The system auto-populates the financial section based on your current Asset Registry and Ledger.
            </p>
          </div>
        </div>
      </Card>

      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-[var(--mt)] uppercase tracking-[0.2em]">Filing History</h3>
        <div className="grid gap-3">
          {history.map((item) => (
            <Card key={item.id} className="hover:border-[var(--bd2)] transition-colors">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded bg-[var(--c2)] flex items-center justify-center">
                    <FileText className="h-4 w-4 text-[var(--mt)]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--tx)]">{item.type}</p>
                    <p className="text-[10px] text-[var(--mt)]">{item.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge type="success">
                    <CheckCircle2 className="h-2 w-2 mr-1 inline" />
                    {item.status}
                  </Badge>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Modal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        title="Preview Meeting Minutes"
      >
        <div className="space-y-6">
          <pre className="bg-[var(--bg)] p-6 rounded-lg border border-[var(--bd)] text-[11px] font-mono leading-relaxed text-[var(--tx)] whitespace-pre-wrap overflow-x-auto min-h-[400px]">
            {minutesText}
          </pre>
          
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setIsPreviewOpen(false)}>Edit</Button>
            <Button variant="ghost"><Printer className="h-4 w-4 mr-2" /> Print</Button>
            <Button variant="blue" onClick={handleFile}><Save className="h-4 w-4 mr-2" /> File Document</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
