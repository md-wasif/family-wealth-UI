"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, Wallet, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";

export const CashFlowView = () => {
  const data = [
    { month: "Jan", income: 45000, expenses: 28000 },
    { month: "Feb", income: 42000, expenses: 31000 },
    { month: "Mar", income: 48000, expenses: 29000 },
    { month: "Apr", income: 52000, expenses: 35000 },
    { month: "May", income: 55000, expenses: 32000 },
    { month: "Jun", income: 61000, expenses: 34000 },
  ];

  const entities = [
    { name: "Family Trust", income: 125000, expenses: 45000, color: "var(--bl)" },
    { name: "PMA / Foundation", income: 145000, expenses: 85000, color: "var(--pu)" },
    { name: "Personal / LLC", income: 85000, expenses: 62000, color: "var(--cy)" },
  ];

  const totalMonthlyNet = data[5].income - data[5].expenses;
  const maxVal = Math.max(...data.map(d => Math.max(d.income, d.expenses)));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-[var(--wh)]">Cash Flow Analytics</h1>
          <p className="text-[var(--mt)] text-xs font-bold tracking-widest uppercase">
            Cross-Entity Liquidity & Burn Rate Monitoring
          </p>
        </div>
        <div className="flex gap-2">
          <Badge type="success">Positive Net Flow</Badge>
          <Badge type="info">6 Month Projection</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Stat label="Total Monthly Income" value={formatCurrency(data[5].income)} color="var(--gr)" icon={<ArrowUpRight className="h-3 w-3" />} />
        <Stat label="Total Monthly Expenses" value={formatCurrency(data[5].expenses)} color="var(--rd)" icon={<ArrowDownRight className="h-3 w-3" />} />
        <Stat label="Net Cash Position" value={formatCurrency(totalMonthlyNet)} color="var(--go)" icon={<Wallet className="h-3 w-3" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Chart Area */}
        <Card className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black uppercase tracking-widest text-[var(--wh)]">6-Month Trend</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--mt)] uppercase">
                <div className="h-2 w-2 rounded-full bg-[var(--gr)]" /> Income
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--mt)] uppercase">
                <div className="h-2 w-2 rounded-full bg-[var(--rd)]" /> Expenses
              </div>
            </div>
          </div>

          <div className="flex items-end justify-between h-48 gap-4 pt-4">
            {data.map((d, i) => (
              <div key={i} className="flex-1 flex gap-1 items-end h-full group relative">
                <div 
                  className="flex-1 bg-[var(--gr)]/20 border-t-2 border-[var(--gr)] rounded-t-sm transition-all duration-700 hover:bg-[var(--gr)]/40"
                  style={{ height: `${(d.income / maxVal) * 100}%` }}
                />
                <div 
                  className="flex-1 bg-[var(--rd)]/20 border-t-2 border-[var(--rd)] rounded-t-sm transition-all duration-700 hover:bg-[var(--rd)]/40"
                  style={{ height: `${(d.expenses / maxVal) * 100}%` }}
                />
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-black text-[var(--mt)] uppercase tracking-tighter">
                  {d.month}
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[var(--c2)] border border-[var(--bd)] p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 min-w-[100px]">
                  <p className="text-[9px] font-black text-[var(--mt)] uppercase mb-1">{d.month} Report</p>
                  <p className="text-xs font-mono text-[var(--gr)] font-bold">In: {formatCurrency(d.income)}</p>
                  <p className="text-xs font-mono text-[var(--rd)] font-bold">Out: {formatCurrency(d.expenses)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Entity Breakdown */}
        <div className="space-y-6">
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--wh)]">Entity Distribution</h3>
            <div className="space-y-3">
              {entities.map((entity, i) => (
                <Card key={i} className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold text-[var(--tx)]">{entity.name}</p>
                    <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: entity.color }} />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono">
                    <div className="space-y-1">
                      <p className="text-[var(--mt)] uppercase">Income</p>
                      <p className="text-[var(--gr)] font-bold">{formatCurrency(entity.income)}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[var(--mt)] uppercase">Expenses</p>
                      <p className="text-[var(--rd)] font-bold">{formatCurrency(entity.expenses)}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <Card className="bg-gradient-to-br from-[var(--bl-b)] to-transparent border-[var(--bl)]/20">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-[var(--bl)]" />
              <h4 className="text-[10px] font-black text-[var(--wh)] uppercase tracking-widest">Next Major Outflow</h4>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-[var(--tx)]">Quarterly Tax Reserve</p>
                <p className="text-[10px] text-[var(--mt)]">Due in 18 days</p>
              </div>
              <p className="text-sm font-mono font-black text-[var(--rd)]">{formatCurrency(18500)}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CashFlowView;
