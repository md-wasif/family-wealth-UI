"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stat } from "@/components/ui/stat";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Modal } from "@/components/ui/modal";
import { formatCurrency, generateId } from "@/lib/utils";
import { Heart, Plus, FileText, Download, Printer, Save, Users, Target } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { donationSchema, DonationFormValues } from "@/lib/validations/pma";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const PMAView = () => {
  const [activeSubTab, setActiveSubTab] = useState("overview");
  const [isAddingDonation, setIsAddingDonation] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [certText, setCertText] = useState("");
  const [donations, setDonations] = useState([
    { id: "don-1", donor: "Wasif Akhtar", amount: 25000, date: "2024-05-12", bucket: "Religious", type: "Cash", certNo: "D-8A2K9" },
    { id: "don-2", donor: "Family Trust", amount: 120000, date: "2024-04-30", bucket: "Charitable", type: "Asset", certNo: "D-3F5N2" },
  ]);

  const pmaData = {
    name: "Akhtar Family Foundation",
    ein: "XX-XXXXXXX",
    type: "§508(c)(1)(A)",
    established: "2024-02-10",
    totalDonations: donations.reduce((sum, d) => sum + d.amount, 0),
  };

  const buckets = [
    { name: "Religious", color: "var(--go)" },
    { name: "Educational", color: "var(--bl)" },
    { name: "Wellness", color: "var(--cy)" },
    { name: "Charitable", color: "var(--pu)" },
    { name: "Family Welfare", color: "var(--gr)" },
    { name: "Operations", color: "var(--mt)" },
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      bucket: "Religious",
      type: "Cash",
    },
  });

  const onAddDonation = async (data: DonationFormValues) => {
    const certNo = `D-${generateId().toUpperCase().slice(0, 5)}`;
    const newDonation = { ...data, id: generateId(), certNo };
    
    // Generate Certificate Text
    const text = `CERTIFICATE OF DONATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${pmaData.name}
A §508(c)(1)(A) Tax-Exempt Religious Organization
EIN: ${pmaData.ein}

Certificate Number: ${certNo}
Date of Donation: ${data.date}

DONOR: ${data.donor}

DONATION DETAILS:
Type: ${data.type}
Amount: ${formatCurrency(data.amount)}
Mission Bucket: ${data.bucket}

TAX DEDUCTIBILITY STATEMENT:
This organization is a §508(c)(1)(A) tax-exempt religious organization. 
No goods or services were provided in exchange for this contribution. 
This contribution may be deductible to the extent allowed by law.

Authorized by: Wasif Akhtar
Date: ${new Date().toLocaleDateString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    setCertText(text);
    setIsPreviewOpen(true);
    setDonations(prev => [newDonation, ...prev]);
    setIsAddingDonation(false);
    reset();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-[var(--pu-b)] flex items-center justify-center border border-[var(--pu)]/20">
            <Heart className="h-6 w-6 text-[var(--pu)]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[var(--wh)]">{pmaData.name}</h1>
            <p className="text-[var(--mt)] text-xs font-bold tracking-widest uppercase">
              EIN: {pmaData.ein} • Type: {pmaData.type} • Est: {pmaData.established}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Users className="h-4 w-4 mr-2" />
            Members
          </Button>
          <Button size="sm" variant="blue" onClick={() => setIsAddingDonation(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Donation
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Stat label="Total Donations YTD" value={formatCurrency(pmaData.totalDonations)} color="var(--pu)" />
        <Stat label="Ministry Net Position" value={formatCurrency(98500)} color="var(--gr)" />
        <Stat label="Active Mission Buckets" value="6" color="var(--bl)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bucket Allocation */}
        <Card className="lg:col-span-1 space-y-4">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-[var(--go)]" />
            <h3 className="text-sm font-black uppercase tracking-widest text-[var(--wh)]">Mission Buckets</h3>
          </div>
          <div className="space-y-4">
            {buckets.map((bucket) => {
              const amount = donations.filter(d => d.bucket === bucket.name).reduce((sum, d) => sum + d.amount, 0);
              const percentage = pmaData.totalDonations > 0 ? (amount / pmaData.totalDonations) * 100 : 0;
              
              return (
                <div key={bucket.name} className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-[var(--mt)]">{bucket.name}</span>
                    <span style={{ color: bucket.color }}>{formatCurrency(amount)}</span>
                  </div>
                  <Progress value={percentage} color={bucket.color} />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Donation Registry */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black uppercase tracking-widest text-[var(--wh)]">Donation Registry</h3>
            <span className="text-[10px] font-bold text-[var(--mt)] uppercase tracking-widest">{donations.length} Entries</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--bd)]">
                  <th className="py-2 text-[9px] font-black uppercase tracking-widest text-[var(--mt)]">Donor</th>
                  <th className="py-2 text-[9px] font-black uppercase tracking-widest text-[var(--mt)]">Bucket</th>
                  <th className="py-2 text-[9px] font-black uppercase tracking-widest text-[var(--mt)]">Amount</th>
                  <th className="py-2 text-right text-[9px] font-black uppercase tracking-widest text-[var(--mt)]">Cert #</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--bd)]/50">
                {donations.map((d) => (
                  <tr key={d.id} className="group hover:bg-[var(--c1)] transition-colors">
                    <td className="py-3 pr-4">
                      <p className="text-xs font-bold text-[var(--tx)]">{d.donor}</p>
                      <p className="text-[9px] text-[var(--mt)]">{d.date}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge type="info">{d.bucket}</Badge>
                    </td>
                    <td className="py-3 pr-4 text-xs font-mono font-bold text-[var(--gr)]">
                      {formatCurrency(d.amount)}
                    </td>
                    <td className="py-3 text-right">
                      <span className="text-[10px] font-mono text-[var(--dm)] group-hover:text-[var(--go)] cursor-pointer">
                        {d.certNo}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Add Donation Modal */}
      <Modal 
        isOpen={isAddingDonation} 
        onClose={() => setIsAddingDonation(false)} 
        title="Record Foundation Donation"
      >
        <form onSubmit={handleSubmit(onAddDonation)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Donor Name" {...register("donor")} error={errors.donor?.message} />
            <Input label="Amount ($)" type="number" step="0.01" {...register("amount")} error={errors.amount?.message} />
            <Input label="Date" type="date" {...register("date")} error={errors.date?.message} />
            
            <div className="space-y-1.5">
              <label className="block text-[9px] font-bold tracking-widest text-[var(--mt)] uppercase">Mission Bucket</label>
              <select 
                {...register("bucket")}
                className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--bd)] rounded-md text-[var(--tx)] text-sm outline-none focus:border-[var(--go)]"
              >
                {buckets.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[9px] font-bold tracking-widest text-[var(--mt)] uppercase">Payment Type</label>
              <select 
                {...register("type")}
                className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--bd)] rounded-md text-[var(--tx)] text-sm outline-none focus:border-[var(--go)]"
              >
                {["Cash", "Check", "Wire", "Crypto", "Asset"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <Input label="Goods/Services Provided" placeholder="None" {...register("goodsServices")} />
          </div>
          
          <div className="pt-4 space-y-3">
            <Button type="submit" variant="blue" className="w-full" isLoading={isSubmitting}>
              Generate Donation Certificate
            </Button>
            <p className="text-[10px] text-[var(--mt)] text-center leading-relaxed uppercase tracking-tighter">
              A §508(c)(1)(A) donation certificate will be auto-generated and filed 
              in the vault upon confirmation.
            </p>
          </div>
        </form>
      </Modal>

      {/* Certificate Preview Modal */}
      <Modal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        title="Donation Certificate Generated"
      >
        <div className="space-y-6">
          <pre className="bg-[var(--bg)] p-6 rounded-lg border border-[var(--bd)] text-[11px] font-mono leading-relaxed text-[var(--tx)] whitespace-pre-wrap overflow-x-auto min-h-[400px]">
            {certText}
          </pre>
          
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setIsPreviewOpen(false)}>Close</Button>
            <Button variant="ghost"><Printer className="h-4 w-4 mr-2" /> Print</Button>
            <Button variant="blue" onClick={() => {
              toast.success("Certificate downloaded");
              setIsPreviewOpen(false);
            }}>
              <Download className="h-4 w-4 mr-2" /> Download PDF
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PMAView;
