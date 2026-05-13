"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stat } from "@/components/ui/stat";
import { formatCurrency, generateId } from "@/lib/utils";
import { Shield, Plus, ArrowDownCircle, ArrowUpCircle, FileText, Search, Filter, MoreVertical } from "lucide-react";
import { AssetForm } from "./asset-form";
import { DemandNotesView } from "./demand-notes-view";
import { MinutesView } from "./minutes-view";
import { AssetFormValues } from "@/lib/validations/trust";
import { TrustAsset } from "@/types";

export const TrustView = () => {
  const [activeSubTab, setActiveSubTab] = useState("overview");
  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [assets, setAssets] = useState<TrustAsset[]>([
    { id: "1", description: "123 Main St (Rental)", costBasis: 450000, coa: "#126", dateAcquired: "2024-05-10" },
    { id: "2", description: "Vanguard Index Fund", costBasis: 125000, coa: "#160", dateAcquired: "2024-04-15" },
    { id: "3", description: "Family Vehicle (Ford F-150)", costBasis: 55000, coa: "#140", dateAcquired: "2024-03-22" },
  ]);

  // Mock data
  const trustData = {
    name: "Wasif Akhtar Private Family Trust",
    ein: "XX-XXXXXXX",
    situs: "Alabama",
    established: "2024-01-15",
    totalAssets: assets.reduce((sum, a) => sum + a.costBasis, 0),
    noteBalance: 4200000, // This would be calculated from demand notes
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "assets", label: "Asset Registry" },
    { id: "notes", label: "Demand Notes" },
    { id: "governance", label: "Governance" },
    { id: "minutes", label: "Minutes" },
  ];

  const handleAddAsset = (values: AssetFormValues) => {
    const newAsset: TrustAsset = {
      id: generateId(),
      ...values,
    };
    setAssets((prev) => [newAsset, ...prev]);
    setIsAddingAsset(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-[var(--go-g)] flex items-center justify-center border border-[var(--go)]/20">
            <Shield className="h-6 w-6 text-[var(--go)]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[var(--wh)]">{trustData.name}</h1>
            <p className="text-[var(--mt)] text-xs font-bold tracking-widest uppercase">
              EIN: {trustData.ein} • Situs: {trustData.situs} • Est: {trustData.established}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Indenture
          </Button>
          <Button size="sm" onClick={() => {
            setActiveSubTab("assets");
            setIsAddingAsset(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Button>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex gap-1 p-1 bg-[var(--c2)] border border-[var(--bd)] rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
              activeSubTab === tab.id
                ? "bg-[var(--go)] text-[var(--bg)] shadow-sm"
                : "text-[var(--dm)] hover:text-[var(--tx)] hover:bg-[var(--c1)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeSubTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Stat label="Total Assets (Cost Basis)" value={formatCurrency(trustData.totalAssets)} color="var(--bl)" />
            <Stat label="Demand Note Balance" value={formatCurrency(trustData.noteBalance)} color="var(--gr)" />
            <Stat label="Annual Trust Net Income" value={formatCurrency(125000)} color="var(--cy)" />
            
            <Card className="lg:col-span-2 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-[var(--wh)]">Recent Activity</h3>
              <div className="space-y-2">
                {assets.slice(0, 3).map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-3 bg-[var(--bg)]/50 border border-[var(--bd)] rounded-lg">
                    <div className="flex items-center gap-3">
                      <ArrowUpCircle className="h-5 w-5 text-[var(--gr)]" />
                      <div>
                        <p className="text-xs font-bold text-[var(--tx)]">Asset Registered</p>
                        <p className="text-[10px] text-[var(--mt)]">{asset.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono font-bold text-[var(--gr)]">
                        +{formatCurrency(asset.costBasis)}
                      </p>
                      <p className="text-[9px] text-[var(--mt)] font-semibold">{asset.dateAcquired}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-[var(--wh)]">Compliance Status</h3>
              <div className="space-y-3">
                {[
                  { label: "Trust Indenture", status: "Active" },
                  { label: "EIN Registration", status: "Verified" },
                  { label: "Board Minutes", status: "Current" },
                  { label: "Beneficiary Reports", status: "Pending" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs border-b border-[var(--bd)] pb-2 last:border-0">
                    <span className="text-[var(--dm)]">{item.label}</span>
                    <span className={`font-bold ${item.status === "Pending" ? "text-[var(--am)]" : "text-[var(--gr)]"}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="w-full mt-4">Run Compliance Audit</Button>
            </Card>
          </div>
        )}

        {activeSubTab === "assets" && (
          <div className="space-y-6">
            {isAddingAsset ? (
              <AssetForm 
                onSubmit={handleAddAsset} 
                onCancel={() => setIsAddingAsset(false)} 
              />
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--mt)]" />
                      <input 
                        type="text" 
                        placeholder="Search assets..." 
                        className="w-full pl-9 pr-4 py-2 bg-[var(--c1)] border border-[var(--bd)] rounded-lg text-xs outline-none focus:border-[var(--go)]"
                      />
                    </div>
                    <Button variant="ghost" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                  <div className="text-[10px] font-bold text-[var(--mt)] uppercase tracking-widest">
                    Total: {assets.length} Assets
                  </div>
                </div>

                <Card className="p-0 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[var(--c2)] border-b border-[var(--bd)]">
                        <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest text-[var(--mt)]">Description</th>
                        <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest text-[var(--mt)]">COA</th>
                        <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest text-[var(--mt)]">Date Acquired</th>
                        <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest text-[var(--mt)]">Cost Basis</th>
                        <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest text-[var(--mt)] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--bd)]">
                      {assets.map((asset) => (
                        <tr key={asset.id} className="hover:bg-[var(--c1)] transition-colors">
                          <td className="px-4 py-3 text-xs font-bold text-[var(--tx)]">{asset.description}</td>
                          <td className="px-4 py-3 text-xs font-mono text-[var(--dm)]">{asset.coa}</td>
                          <td className="px-4 py-3 text-xs text-[var(--dm)]">{asset.dateAcquired}</td>
                          <td className="px-4 py-3 text-xs font-mono font-bold text-[var(--go)]">{formatCurrency(asset.costBasis)}</td>
                          <td className="px-4 py-3 text-right">
                            <button className="text-[var(--mt)] hover:text-[var(--wh)] p-1">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </>
            )}
          </div>
        )}

        {activeSubTab === "notes" && <DemandNotesView />}
        {activeSubTab === "minutes" && <MinutesView />}
      </div>
    </div>
  );
};

export default TrustView;
