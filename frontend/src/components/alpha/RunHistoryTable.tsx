"use client";

import { formatDistanceToNow } from "date-fns";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import type { IngestionRun } from "@/hooks/use-copilot-api";

type Props = {
  runs: IngestionRun[];
  isLoading: boolean;
};

export function RunHistoryTable({ runs, isLoading }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-700">Run History</h3>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-slate-400">Loading runs…</p>
        ) : !runs || runs.length === 0 ? (
          <p className="text-sm text-slate-400">No runs recorded yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="pb-2 pr-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Type</th>
                  <th className="pb-2 pr-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</th>
                  <th className="pb-2 pr-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Duration</th>
                  <th className="pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">Started</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {runs.map((run) => (
                  <tr key={run.id} className="hover:bg-slate-50">
                    <td className="py-2.5 pr-4 text-slate-700">{run.run_type}</td>
                    <td className="py-2.5 pr-4">
                      <Badge
                        variant={run.status === "success" ? "success" : run.status === "running" ? "accent" : "danger"}
                        className="text-[10px]"
                      >
                        {run.status}
                      </Badge>
                    </td>
                    <td className="py-2.5 pr-4 text-slate-500 tabular-nums">
                      {run.duration_ms != null ? `${run.duration_ms}ms` : "—"}
                    </td>
                    <td className="py-2.5 text-slate-500">
                      {formatDistanceToNow(new Date(run.started_at), { addSuffix: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
