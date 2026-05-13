"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stat } from "@/components/ui/stat";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, Calculator, TrendingDown, ArrowRight, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taxSchema, TaxFormValues } from "@/lib/validations/tax";

export const PersonalTaxView = () => {
  const [calculation, setCalculation] = useState<any>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TaxFormValues>({
    resolver: zodResolver(taxSchema),
    defaultValues: {
      filingStatus: "Married Filing Jointly",
      wages: 150000,
      businessIncome: 75000,
      dividends: 15000,
      capitalGains: 45000,
      otherIncome: 0,
      standardDeduction: true,
    },
  });

  const onSubmit = (data: TaxFormValues) => {
    // Mock 2024 Tax Calculation Logic
    const totalIncome = data.wages + data.businessIncome + data.dividends + data.capitalGains + data.otherIncome;
    const deduction = data.standardDeduction ? (data.filingStatus === "Married Filing Jointly" ? 29200 : 14600) : (data.itemizedDeductions || 0);
    const taxableIncome = Math.max(0, totalIncome - deduction);
    
    // Simplistic tiered tax calculation (mocked for demo)
    let estimatedTax = 0;
    if (taxableIncome > 731200) estimatedTax = taxableIncome * 0.37;
    else if (taxableIncome > 487450) estimatedTax = taxableIncome * 0.35;
    else if (taxableIncome > 201050) estimatedTax = taxableIncome * 0.32;
    else estimatedTax = taxableIncome * 0.24;

    const effectiveRate = taxableIncome > 0 ? (estimatedTax / totalIncome) * 100 : 0;

    setCalculation({
      totalIncome,
      deduction,
      taxableIncome,
      estimatedTax,
      effectiveRate,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-[var(--wh)]">Personal Tax Strategy</h1>
          <p className="text-[var(--mt)] text-xs font-bold tracking-widest uppercase">
            Form 1040 Projection & Savings Optimizer
          </p>
        </div>
        <Badge type="info">Tax Year 2024</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card className="space-y-6">
          <div className="flex items-center gap-2">
            <Calculator className="h-4 w-4 text-[var(--go)]" />
            <h3 className="text-sm font-black uppercase tracking-widest text-[var(--wh)]">Income & Deductions</h3>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[9px] font-bold tracking-widest text-[var(--mt)] uppercase">Filing Status</label>
              <select 
                {...register("filingStatus")}
                className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--bd)] rounded-md text-[var(--tx)] text-sm outline-none focus:border-[var(--go)]"
              >
                <option value="Single">Single</option>
                <option value="Married Filing Jointly">Married Filing Jointly</option>
                <option value="Married Filing Separately">Married Filing Separately</option>
                <option value="Head of Household">Head of Household</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Wages (W-2)" type="number" {...register("wages")} />
              <Input label="Business Income" type="number" {...register("businessIncome")} />
              <Input label="Dividends" type="number" {...register("dividends")} />
              <Input label="Capital Gains" type="number" {...register("capitalGains")} />
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" className="w-full">
                Calculate Strategy
              </Button>
            </div>
          </form>
        </Card>

        {/* Results / Projection */}
        <div className="space-y-6">
          {calculation ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Stat label="AGI" value={formatCurrency(calculation.totalIncome)} color="var(--tx)" />
                <Stat label="Taxable Income" value={formatCurrency(calculation.taxableIncome)} color="var(--bl)" />
              </div>
              
              <Card className="bg-gradient-to-br from-[var(--c2)] to-[var(--bg)] border-[var(--go)]/20 text-center py-8">
                <p className="text-[10px] font-black text-[var(--mt)] uppercase tracking-[0.2em] mb-2">Estimated Total Tax</p>
                <h2 className="text-4xl font-black text-[var(--go)] font-mono">{formatCurrency(calculation.estimatedTax)}</h2>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Badge type="info">Effective Rate: {calculation.effectiveRate.toFixed(1)}%</Badge>
                </div>
              </Card>

              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-[var(--gr)]" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-[var(--wh)]">AI Optimization Suggestions</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { title: "Increase PMA Contribution", save: 4500, detail: "Your current contribution is 8% of AGI. Increasing to 15% would save $4,500." },
                    { title: "Trust Asset Step-Up", save: 2800, detail: "Re-calculating cost basis for Vanguard fund could offset capital gains." },
                  ].map((opt, i) => (
                    <div key={i} className="p-3 bg-[var(--c1)] border border-[var(--bd)] rounded-lg flex justify-between items-center group cursor-pointer hover:border-[var(--gr)] transition-all">
                      <div>
                        <p className="text-xs font-bold text-[var(--tx)]">{opt.title}</p>
                        <p className="text-[10px] text-[var(--mt)] mt-0.5">{opt.detail}</p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <p className="text-xs font-mono font-bold text-[var(--gr)]">Save {formatCurrency(opt.save)}</p>
                        <ArrowRight className="h-3 w-3 text-[var(--mt)] ml-auto mt-1 group-hover:text-[var(--gr)]" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <Card className="h-full flex flex-col items-center justify-center p-12 text-center border-dashed border-[var(--bd2)]">
              <ShieldCheck className="h-12 w-12 text-[var(--bd2)] mb-4" />
              <p className="text-[var(--mt)] text-sm font-bold uppercase tracking-widest">Projection Required</p>
              <p className="text-[var(--dm)] text-xs mt-2 leading-relaxed">
                Fill out your income details on the left to generate your 2024 tax projection 
                and unlock AI optimization strategies.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalTaxView;
