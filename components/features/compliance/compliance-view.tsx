"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, AlertCircle, Clock, CheckCircle2, Filter, Bell } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const ComplianceView = () => {
  const [tasks, setTasks] = useState([
    { id: 1, entity: "TRUST", task: "Record Q2 Meeting Minutes", due: "2024-06-30", priority: "critical", status: "pending" },
    { id: 2, entity: "PMA", task: "Annual Mission Report", due: "2024-12-31", priority: "normal", status: "pending" },
    { id: 3, entity: "LLC", task: "Wyoming Annual Report Filing", due: "2025-01-01", priority: "high", status: "pending" },
    { id: 4, entity: "TAX", task: "Quarterly Estimated Tax Pmt", due: "2024-06-15", priority: "critical", status: "completed" },
    { id: 5, entity: "TRUST", task: "Beneficiary Asset Report", due: "2024-05-30", priority: "high", status: "pending" },
  ]);

  const handleComplete = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: "completed" } : t));
    toast.success("Compliance task marked as completed");
  };

  const pendingCount = tasks.filter(t => t.status === "pending").length;
  const criticalCount = tasks.filter(t => t.status === "pending" && t.priority === "critical").length;
  const progress = (tasks.filter(t => t.status === "completed").length / tasks.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-[var(--wh)]">Compliance Engine</h1>
          <p className="text-[var(--mt)] text-xs font-bold tracking-widest uppercase">
            Real-time Administrative Oversight & Risk Management
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter By Entity
          </Button>
          <Button size="sm" variant="danger">
            <Bell className="h-4 w-4 mr-2" />
            Urgent Alerts ({criticalCount})
          </Button>
        </div>
      </div>

      {/* Global Status */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-[var(--gr)]" />
              <h3 className="text-sm font-black uppercase tracking-widest text-[var(--wh)]">Overall Health Score</h3>
            </div>
            <span className="text-2xl font-black text-[var(--gr)] font-mono">{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} color="var(--gr)" className="h-3" />
          <div className="flex justify-between mt-4">
            <div className="text-[10px] font-bold text-[var(--mt)] uppercase tracking-widest">
              {tasks.length - pendingCount} of {tasks.length} requirements met
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1 text-[9px] font-bold text-[var(--gr)] uppercase">
                <CheckCircle2 className="h-3 w-3" /> All Trust Docs Current
              </div>
              <div className="flex items-center gap-1 text-[9px] font-bold text-[var(--am)] uppercase">
                <AlertCircle className="h-3 w-3" /> LLC Filing Upcoming
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[var(--rd-b)] to-transparent border-[var(--rd)]/20">
          <p className="text-[10px] font-black text-[var(--mt)] uppercase tracking-[0.2em] mb-1">Critical Issues</p>
          <h2 className="text-3xl font-black text-[var(--rd)] font-mono">{criticalCount}</h2>
          <p className="text-[10px] text-[var(--tx)] mt-2 leading-relaxed uppercase font-bold tracking-tighter">
            Requires immediate administrative action
          </p>
        </Card>
      </div>

      {/* Task List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-widest text-[var(--wh)]">Compliance Checklist</h3>
          <div className="flex gap-2">
            <Badge type="critical">Critical ({criticalCount})</Badge>
            <Badge type="info">Upcoming ({pendingCount - criticalCount})</Badge>
          </div>
        </div>

        <div className="grid gap-3">
          {tasks.map((task) => (
            <Card 
              key={task.id} 
              className={cn(
                "transition-all",
                task.status === "completed" ? "opacity-60" : "hover:border-[var(--bd2)]"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "h-10 w-10 rounded-lg flex items-center justify-center border",
                    task.status === "completed" ? "bg-[var(--gr-b)] border-[var(--gr)]/20" : "bg-[var(--c2)] border-[var(--bd)]"
                  )}>
                    {task.status === "completed" ? (
                      <CheckCircle2 className="h-5 w-5 text-[var(--gr)]" />
                    ) : (
                      <Clock className={cn("h-5 w-5", task.priority === "critical" ? "text-[var(--rd)] animate-pulse" : "text-[var(--mt)]")} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={cn("text-sm font-bold", task.status === "completed" ? "line-through text-[var(--dm)]" : "text-[var(--tx)]")}>
                        {task.task}
                      </p>
                      <Badge type={task.entity === "TRUST" ? "info" : task.entity === "PMA" ? "warning" : "success"}>
                        {task.entity}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-[var(--mt)] font-bold tracking-tighter uppercase mt-1">
                      Due Date: {task.due} • Priority: {task.priority.toUpperCase()}
                    </p>
                  </div>
                </div>
                
                {task.status === "pending" ? (
                  <Button variant="ghost" size="sm" onClick={() => handleComplete(task.id)}>
                    Mark Done
                  </Button>
                ) : (
                  <span className="text-[9px] font-black text-[var(--gr)] uppercase tracking-widest">
                    Verified by System
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ComplianceView;
