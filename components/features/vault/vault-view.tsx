"use client";

import React, { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Folder, 
  File, 
  Upload, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Eye, 
  MoreVertical,
  Plus,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "all", label: "All Files", icon: Folder },
  { id: "TRUST", label: "Trust Documents", icon: ShieldCheck },
  { id: "PMA", label: "Foundation/PMA", icon: Folder },
  { id: "LLC", label: "LLC Management", icon: Folder },
  { id: "TAX", label: "Tax Records", icon: File },
  { id: "LEGAL", label: "Legal & IDs", icon: File },
];

export const VaultView = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  
  const [files, setFiles] = useState([
    { id: "1", name: "Trust_Indenture_Signed.pdf", category: "TRUST", size: "1.2 MB", date: "2024-01-20", type: "pdf" },
    { id: "2", name: "PMA_Articles.pdf", category: "PMA", size: "850 KB", date: "2024-02-15", type: "pdf" },
    { id: "3", name: "Donation_Cert_D-8A2K9.pdf", category: "PMA", size: "45 KB", date: "2024-05-12", type: "pdf" },
    { id: "4", name: "Driver_License_Wasif.jpg", category: "LEGAL", size: "2.4 MB", date: "2023-11-05", type: "image" },
    { id: "5", name: "Q1_Meeting_Minutes.pdf", category: "TRUST", size: "112 KB", date: "2024-03-31", type: "pdf" },
  ]);

  const filteredFiles = files.filter(f => 
    (activeCategory === "all" || f.category === activeCategory) &&
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    toast.success("File uploaded successfully to Vault");
    // Implementation for actual file handling would go here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-[var(--wh)]">Document Vault</h1>
          <p className="text-[var(--mt)] text-xs font-bold tracking-widest uppercase">
            Encrypted Sovereign Storage & Audit Trail
          </p>
        </div>
        <Button variant="blue" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Upload New
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <aside className="space-y-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all",
                activeCategory === cat.id
                  ? "bg-[var(--bl-b)] text-[var(--bl)] border border-[var(--bl)]/20"
                  : "text-[var(--dm)] hover:bg-[var(--c2)] hover:text-[var(--tx)]"
              )}
            >
              <div className="flex items-center gap-3">
                <cat.icon className="h-4 w-4" />
                {cat.label}
              </div>
              {activeCategory === cat.id && <ChevronRight className="h-3 w-3" />}
            </button>
          ))}
          
          <div className="pt-6">
            <Card className="bg-[var(--c1)]/50 border-dashed border-[var(--bd)] p-4 text-center">
              <p className="text-[9px] font-black text-[var(--mt)] uppercase tracking-widest mb-2">Storage Usage</p>
              <div className="w-full bg-[var(--bg)] rounded-full h-1 mb-2">
                <div className="bg-[var(--bl)] h-full w-[12%]" />
              </div>
              <p className="text-[10px] text-[var(--dm)] font-mono">1.2 GB / 10 GB</p>
            </Card>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--mt)]" />
              <input 
                type="text" 
                placeholder="Search encrypted vault..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--c1)] border border-[var(--bd)] rounded-xl text-xs outline-none focus:border-[var(--bl)] transition-all"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="ghost" size="sm" className="flex-1 md:flex-none">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 md:flex-none">
                <Plus className="h-4 w-4 mr-2" />
                Add Folder
              </Button>
            </div>
          </div>

          {/* Upload Zone */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300",
              isDragging 
                ? "border-[var(--bl)] bg-[var(--bl-b)]" 
                : "border-[var(--bd)] hover:border-[var(--bd2)]"
            )}
          >
            <div className="h-12 w-12 rounded-full bg-[var(--c1)] flex items-center justify-center mb-4">
              <Upload className={cn("h-6 w-6 transition-transform", isDragging ? "animate-bounce text-[var(--bl)]" : "text-[var(--mt)]")} />
            </div>
            <h3 className="text-sm font-black text-[var(--wh)] uppercase tracking-widest mb-1">Drag & Drop Files</h3>
            <p className="text-[10px] text-[var(--mt)] uppercase font-bold tracking-tighter">
              PDF, JPG, PNG or DOC (Max 25MB)
            </p>
          </div>

          {/* File Grid/List */}
          <div className="grid gap-3">
            {filteredFiles.length > 0 ? (
              filteredFiles.map((file) => (
                <Card 
                  key={file.id} 
                  className="group hover:border-[var(--bl)]/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded bg-[var(--bg)] flex items-center justify-center border border-[var(--bd)] group-hover:border-[var(--bl)]/30">
                        {file.type === "pdf" ? (
                          <File className="h-5 w-5 text-[var(--rd)]" />
                        ) : (
                          <File className="h-5 w-5 text-[var(--cy)]" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[var(--tx)] group-hover:text-[var(--bl)] transition-colors">
                          {file.name}
                        </p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-[9px] font-bold text-[var(--mt)] uppercase tracking-tighter">{file.size}</span>
                          <span className="text-[9px] text-[var(--bd2)]">•</span>
                          <span className="text-[9px] font-bold text-[var(--mt)] uppercase tracking-tighter">{file.date}</span>
                          <Badge type="info" className="scale-75 origin-left">{file.category}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-[var(--rd)]">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="h-4 w-px bg-[var(--bd)] mx-1" />
                      <button className="text-[var(--mt)] p-1">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="py-20 text-center space-y-4">
                <Search className="h-12 w-12 text-[var(--bd2)] mx-auto" />
                <p className="text-[var(--mt)] text-sm font-bold uppercase tracking-widest">No documents found</p>
                <p className="text-[var(--dm)] text-xs">Try adjusting your filters or search term.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultView;
