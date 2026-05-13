"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, generateId } from "@/lib/utils";
import { Plus, ArrowDownCircle, Info, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { drawSchema, DrawFormValues } from "@/lib/validations/trust";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Note {
  id: string;
  assetName: string;
  originalAmount: number;
  currentBalance: number;
  dateIssued: string;
}

export const DemandNotesView = () => {
  const [isRecordingDraw, setIsRecordingDraw] = useState(false);
  const [notes, setNotes] = useState<Note[]>([
    { id: "note-1", assetName: "123 Main St (Rental)", originalAmount: 450000, currentBalance: 425000, dateIssued: "2024-05-10" },
    { id: "note-2", assetName: "Vanguard Index Fund", originalAmount: 125000, currentBalance: 125000, dateIssued: "2024-04-15" },
    { id: "note-3", assetName: "Family Vehicle (Ford F-150)", originalAmount: 55000, currentBalance: 5500, dateIssued: "2024-03-22" },
  ]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DrawFormValues>({
    resolver: zodResolver(drawSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
    },
  });

  const onRecordDraw = async (data: DrawFormValues) => {
    // Mock draw logic
    setNotes((prev) =>
      prev.map((n) =>
        n.id === data.noteId
          ? { ...n, currentBalance: Math.max(0, n.currentBalance - data.amount) }
          : n
      )
    );
    toast.success("Draw recorded successfully");
    setIsRecordingDraw(false);
    reset();
  };

  const totalCapacity = notes.reduce((sum, n) => sum + n.currentBalance, 0);

  return (
    <div className="space-y-6">
      {/* Summary Stat */}
      <Card className="bg-gradient-to-br from-[var(--c1)] to-[var(--bg)] border-[var(--gr)]/20">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black text-[var(--mt)] uppercase tracking-[0.2em] mb-1">Total Draw Capacity</p>
            <h2 className="text-3xl font-black text-[var(--gr)] font-mono">{formatCurrency(totalCapacity)}</h2>
            <p className="text-[10px] text-[var(--dm)] mt-1 uppercase font-bold tracking-widest">
              Available Tax-Free Repayment
            </p>
          </div>
          <Button size="md" variant="green" onClick={() => setIsRecordingDraw(true)}>
            <ArrowDownCircle className="h-4 w-4 mr-2" />
            Record Note Draw
          </Button>
        </div>
      </Card>

      {isRecordingDraw && (
        <Card className="border-[var(--gr)]/30 animate-in fade-in slide-in-from-top-2">
          <form onSubmit={handleSubmit(onRecordDraw)} className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-[var(--gr)] uppercase tracking-widest">Record Note Draw</h3>
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsRecordingDraw(false)}>Cancel</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[9px] font-bold tracking-widest text-[var(--mt)] uppercase">Select Note</label>
                <select 
                  {...register("noteId")}
                  className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--bd)] rounded-md text-[var(--tx)] text-sm outline-none focus:border-[var(--go)]"
                >
                  <option value="">Select a note...</option>
                  {notes.map(n => (
                    <option key={n.id} value={n.id}>{n.assetName} ({formatCurrency(n.currentBalance)})</option>
                  ))}
                </select>
                {errors.noteId && <p className="text-[10px] text-[var(--rd)]">{errors.noteId.message}</p>}
              </div>
              <Input label="Amount ($)" type="number" step="0.01" {...register("amount")} error={errors.amount?.message} />
              <Input label="Date" type="date" {...register("date")} error={errors.date?.message} />
              <Input label="Purpose" placeholder="e.g. Monthly lifestyle distribution" {...register("purpose")} error={errors.purpose?.message} />
            </div>
            
            <Button type="submit" variant="green" className="w-full" isLoading={isSubmitting}>Confirm Tax-Free Draw</Button>
          </form>
        </Card>
      )}

      {/* Info Warning */}
      <div className="flex gap-3 p-4 bg-[var(--bl-b)] border border-[var(--bl)]/20 rounded-lg">
        <Info className="h-5 w-5 text-[var(--bl)] shrink-0" />
        <p className="text-[11px] text-[var(--tx)] leading-relaxed">
          <span className="font-bold text-[var(--bl)] uppercase mr-1">Trust Logic:</span>
          Draws against Demand Notes are classified as loan repayments to the Settlor, not taxable distributions. 
          No K-1 is required as long as the draw does not exceed the note balance.
        </p>
      </div>

      {/* Notes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notes.map((note) => {
          const usedPercentage = ((note.originalAmount - note.currentBalance) / note.originalAmount) * 100;
          const isLow = usedPercentage > 90;
          
          return (
            <Card key={note.id} className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xs font-black text-[var(--wh)] uppercase tracking-wider">{note.assetName}</h3>
                  <p className="text-[9px] text-[var(--mt)] font-bold tracking-tighter mt-0.5">Issued: {note.dateIssued}</p>
                </div>
                {isLow && (
                  <Badge type="critical">
                    <AlertCircle className="h-2 w-2 mr-1 inline" />
                    Low Balance
                  </Badge>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-[var(--mt)] uppercase tracking-widest">Draw Progress</span>
                  <span className={isLow ? "text-[var(--rd)]" : "text-[var(--gr)]"}>
                    {formatCurrency(note.currentBalance)} remaining
                  </span>
                </div>
                <Progress 
                  value={100 - usedPercentage} 
                  color={isLow ? "var(--rd)" : "var(--gr)"} 
                />
                <div className="flex justify-between text-[9px] text-[var(--mt)] font-mono">
                  <span>0</span>
                  <span>{formatCurrency(note.originalAmount)} (Initial)</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
