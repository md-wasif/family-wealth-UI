"use client";

import React from "react";
import { Stat } from "@/components/ui/stat";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, cn } from "@/lib/utils";
import { 
  Shield, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Activity, 
  AlertTriangle,
  Zap,
  FileText,
  Heart,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Star,
  Sun,
  Home,
  Layers,
  CheckCircle
} from "lucide-react";

export const DashboardView = () => {
  // Mock data - In a real app, this would come from an API via Prisma/SWR
  const stats = {
    netWorth: 12500000,
    trustAssets: 8400000,
    demandNotes: 4200000,
    remNotes: 3800000,
    portfolioVal: 1250000,
    insuranceFace: 5000000,
    insuranceCash: 450000,
    trustInc: 125000,
    llcNet: 85000,
    foundationDon: 45000,
    annuityVal: 320000,
    agi: 245000,
    donationLimit: 147000,
    taxSavings: 145000,
    retirement: 850000,
    reEquity: 2100000,
    reValue: 3500000,
    totalDebt: 1400000,
    monthlyDebt: 8500,
    rentalInc: 120000,
  };

  const alerts = [
    { id: 1, type: "critical", message: "Demand Note #402 balance below 10%", entity: "TRUST" },
    { id: 2, type: "warning", message: "Annual meeting minutes overdue", entity: "FOUNDATION" },
    { id: 3, type: "info", message: "Quarterly tax estimate due in 14 days", entity: "PERSONAL" },
  ];

  const totalNotes = stats.demandNotes;
  const remNotes = stats.remNotes;
  const totalDraws = totalNotes - remNotes;
  const drawPercentage = (totalDraws / totalNotes) * 100;

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <Button size="sm" variant="blue" className="shrink-0"><Zap className="mr-2 h-3 w-3" /> Quick Draw</Button>
        <Button size="sm" variant="secondary" className="shrink-0"><Plus className="mr-2 h-3 w-3" /> Record Expense</Button>
        <Button size="sm" variant="secondary" className="shrink-0"><Plus className="mr-2 h-3 w-3" /> Record Donation</Button>
        <Button size="sm" variant="secondary" className="shrink-0"><Plus className="mr-2 h-3 w-3" /> Record Income</Button>
        <Button size="sm" variant="blue" className="shrink-0"><FileText className="mr-2 h-3 w-3" /> Auto-Generate Trust Minutes</Button>
        <Button size="sm" variant="blue" className="shrink-0"><FileText className="mr-2 h-3 w-3" /> Auto-Generate Foundation Minutes</Button>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-[var(--go)]" />
          <h2 className="text-sm font-black text-[var(--wh)] uppercase tracking-wider">Estate Overview</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat 
            label="Trust Assets" 
            value={formatCurrency(stats.trustAssets)} 
            sub="12 Assets Registered" 
            color="var(--go)"
            icon={<Shield className="h-3 w-3" />}
          />
          <Stat 
            label="Demand Note Balance" 
            value={formatCurrency(stats.remNotes)} 
            color={stats.remNotes < stats.demandNotes * 0.1 ? "var(--rd)" : "var(--gr)"}
            icon={<ArrowUpRight className="h-3 w-3" />}
          />
          <Stat 
            label="Portfolio" 
            value={formatCurrency(stats.portfolioVal)} 
            color="var(--pu)"
            icon={<PieChart className="h-3 w-3" />}
          />
          <Stat 
            label="Insurance" 
            value={formatCurrency(stats.insuranceFace)} 
            sub={`Cash: ${formatCurrency(stats.insuranceCash)}`}
            color="var(--bl)"
            icon={<ShieldCheck className="h-3 w-3" />}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat 
            label="Trust Income YTD" 
            value={formatCurrency(stats.trustInc)} 
            color="var(--gr)"
          />
          <Stat 
            label="LLC Net" 
            value={formatCurrency(stats.llcNet)} 
            color="var(--cy)"
          />
          <Stat 
            label="Foundation" 
            value={formatCurrency(stats.foundationDon)} 
            color="var(--bl)"
            icon={<Heart className="h-3 w-3" />}
          />
          <Stat 
            label="Annuities" 
            value={formatCurrency(stats.annuityVal)} 
            color="var(--am)"
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[var(--bl)]" />
          <h2 className="text-sm font-black text-[var(--wh)] uppercase tracking-wider">Personal & Tax</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat 
            label="Personal AGI" 
            value={formatCurrency(stats.agi)} 
            sub={`W-2: ${formatCurrency(stats.agi * 0.8)}`}
            color="var(--cy)"
            icon={<DollarSign className="h-3 w-3" />}
          />
          <Stat 
            label="60% AGI Limit" 
            value={formatCurrency(stats.donationLimit)} 
            sub={`Donated: ${formatCurrency(stats.foundationDon)}`}
            color={stats.foundationDon > stats.donationLimit ? "var(--rd)" : "var(--gr)"}
            icon={<CheckCircle className="h-3 w-3" />}
          />
          <Stat 
            label="Tax Savings" 
            value={formatCurrency(stats.taxSavings)} 
            sub="Cumulative"
            color="var(--gr)"
            icon={<Star className="h-3 w-3" />}
          />
          <Stat 
            label="Retirement" 
            value={formatCurrency(stats.retirement)} 
            color="var(--bl)"
            icon={<Sun className="h-3 w-3" />}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat 
            label="Real Estate Equity" 
            value={formatCurrency(stats.reEquity)} 
            sub={`Value: ${formatCurrency(stats.reValue)}`}
            color="var(--am)"
            icon={<Home className="h-3 w-3" />}
          />
          <Stat 
            label="Total Debt" 
            value={formatCurrency(stats.totalDebt)} 
            sub={`${formatCurrency(stats.monthlyDebt)}/mo`}
            color="var(--rd)"
            icon={<Layers className="h-3 w-3" />}
          />
          <Stat 
            label="Full Net Worth" 
            value={formatCurrency(stats.netWorth)} 
            color="var(--go)"
            icon={<TrendingUp className="h-3 w-3" />}
          />
          <Stat 
            label="Rental Income" 
            value={formatCurrency(stats.rentalInc)} 
            sub="Annual"
            color="var(--gr)"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="space-y-4">
            <h2 className="text-sm font-black text-[var(--wh)] uppercase tracking-wider">Demand Note Capacity</h2>
            <Card>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-[var(--dm)] font-bold uppercase tracking-widest">
                  <span>{formatCurrency(totalDraws)} used</span>
                  <span>{formatCurrency(remNotes)} remaining</span>
                </div>
                <div className="h-2 w-full bg-[var(--bg)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[var(--go)] transition-all duration-500" 
                    style={{ width: `${drawPercentage}%` }}
                  />
                </div>
              </div>
            </Card>
          </section>

          <Card className="min-h-[200px] flex flex-col items-center justify-center border-dashed border-[var(--bd2)] bg-transparent">
            <Activity className="h-8 w-8 text-[var(--bd2)] mb-3" />
            <p className="text-[10px] font-black text-[var(--mt)] uppercase tracking-[0.2em]">Net Worth Projection</p>
            <p className="text-[var(--dm)] text-[10px] mt-1 italic">Historical data visualization coming soon</p>
          </Card>
        </div>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[var(--rd)]" />
            <h2 className="text-sm font-black text-[var(--wh)] uppercase tracking-wider">Active Alerts</h2>
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className={cn(
                "p-4 border rounded-lg space-y-2 transition-all hover:translate-x-1",
                alert.type === "critical" ? "bg-[var(--rd-b)] border-[var(--rd)]/30" : 
                alert.type === "warning" ? "bg-[var(--am-b)] border-[var(--am)]/30" : 
                "bg-[var(--bl-b)] border-[var(--bl)]/30"
              )}>
                <div className="flex items-center justify-between">
                  <Badge type={alert.type as any}>{alert.type}</Badge>
                  <span className="text-[9px] font-bold text-[var(--mt)] uppercase tracking-tighter">{alert.entity}</span>
                </div>
                <p className="text-xs text-[var(--tx)] leading-relaxed font-medium">{alert.message}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardView;
