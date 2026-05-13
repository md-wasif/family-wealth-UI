"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Lock, Database, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function SettingsView() {
  const handleResetPin = () => {
    localStorage.removeItem("family-wealth-pin");
    sessionStorage.removeItem("fw-session");
    toast.success("Security PIN cleared. You will be asked to set it up on next login.");
    setTimeout(() => window.location.reload(), 1500);
  };

  const handleExportData = () => {
    toast.info("Preparing data export...");
    // Logic for data export would go here
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-[var(--mt)]/10 flex items-center justify-center border border-[var(--mt)]/20">
          <Settings className="h-6 w-6 text-[var(--mt)]" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-[var(--wh)]">System Settings</h1>
          <p className="text-[var(--mt)] text-xs font-bold tracking-widest uppercase">
            Security & Data Management
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security Section */}
        <Card className="p-6 space-y-6 border-[var(--go)]/20">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-[var(--go)]" />
            <h3 className="text-sm font-black uppercase tracking-widest text-[var(--wh)]">Security Access</h3>
          </div>
          <div className="space-y-4">
            <p className="text-xs text-[var(--mt)] leading-relaxed font-medium">
              Manage your 4-digit security PIN. Resetting your PIN will require you to create a new one the next time you access the Command Center.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" className="text-xs font-bold uppercase tracking-tighter h-10 px-4" onClick={handleResetPin}>
                Reset Security PIN
              </Button>
            </div>
          </div>
        </Card>

        {/* Data Section */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-[var(--bl)]" />
            <h3 className="text-sm font-black uppercase tracking-widest text-[var(--wh)]">Data Portability</h3>
          </div>
          <div className="space-y-4">
            <p className="text-xs text-[var(--mt)] leading-relaxed font-medium">
              Export your entire encrypted estate database as a JSON file for cold storage or migration.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" className="text-xs font-bold uppercase tracking-tighter h-10 px-4" onClick={handleExportData}>
                Export Master Database
              </Button>
              <Button variant="ghost" className="text-xs font-bold uppercase tracking-tighter h-10 px-4 text-[var(--rd)] border-[var(--rd)]/20">
                <Trash2 className="h-4 w-4 mr-2" />
                Wipe Local Cache
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Card className="bg-[var(--am-b)] border-[var(--am)]/20 p-4">
        <div className="flex items-start gap-3">
          <RefreshCw className="h-5 w-5 text-[var(--am)] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-black text-[var(--wh)] uppercase tracking-widest">Automatic Backups</p>
            <p className="text-[10px] text-[var(--mt)] leading-relaxed font-bold uppercase tracking-tighter">
              Your data is automatically synced to your persistent MongoDB instance in real-time. 
              Always maintain a manual JSON export in your encrypted document vault for redundancy.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
