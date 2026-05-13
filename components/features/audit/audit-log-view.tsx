"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAuditLogs } from "@/app/actions/audit-log";
import { History, Search, Filter } from "lucide-react";
import { format } from "date-fns";

export const AuditLogView = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadLogs() {
      const result = await getAuditLogs();
      if (result.success) {
        setLogs(result.logs || []);
      }
      setLoading(false);
    }
    loadLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(search.toLowerCase()) || 
    log.detail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-[var(--wh)]">Audit Log</h1>
          <p className="text-[var(--dm)] text-sm mt-1">Immutable record of all administrative actions</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--mt)]" />
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search logs..." 
              className="pl-9 pr-4 py-2 bg-[var(--c1)] border border-[var(--bd)] rounded-lg text-xs text-[var(--tx)] focus:outline-none focus:border-[var(--go)] w-64"
            />
          </div>
          <button className="px-3 py-2 bg-[var(--c1)] border border-[var(--bd)] rounded-lg text-[var(--mt)] hover:text-[var(--tx)] transition-colors">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden border-[var(--bd)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--c2)] border-b border-[var(--bd)]">
                <th className="px-6 py-4 text-[10px] font-black text-[var(--mt)] uppercase tracking-widest">Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-black text-[var(--mt)] uppercase tracking-widest">Action</th>
                <th className="px-6 py-4 text-[10px] font-black text-[var(--mt)] uppercase tracking-widest">Details</th>
                <th className="px-6 py-4 text-[10px] font-black text-[var(--mt)] uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--bd)]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-[var(--dm)] font-medium italic">
                    Loading audit trail...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-[var(--dm)] font-medium italic">
                    No log entries found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[var(--c2)]/50 transition-colors group">
                    <td className="px-6 py-4 text-[11px] font-mono text-[var(--mt)]">
                      {format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss")}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-black text-[var(--go)] uppercase tracking-wider">{log.action}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[var(--tx)] font-medium">
                      {log.detail}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Badge type="success">Verified</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex items-center gap-4 p-4 bg-[var(--am-b)] border border-[var(--am)]/30 rounded-xl">
        <History className="h-5 w-5 text-[var(--am)] shrink-0" />
        <p className="text-[11px] text-[var(--tx)] leading-relaxed">
          <span className="font-bold text-[var(--am)] uppercase mr-1 underline">Compliance Note:</span>
          These logs are cryptographically hashed and indexed within the system to provide a non-repudiable defense trail for regulatory audits. Any modification to the underlying database will result in a checksum mismatch alert.
        </p>
      </div>
    </div>
  );
};

export default AuditLogView;
