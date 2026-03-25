"use client";

import { FileText, MessageSquare } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import type { PipelineStats as PipelineStatsType } from "@/hooks/use-copilot-api";

type Props = {
  stats: PipelineStatsType;
};

function StatItem({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-4 py-3">
      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">{label}</p>
      <p className="text-xl font-bold text-slate-800 tabular-nums">{value}</p>
    </div>
  );
}

export function PipelineStats({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-500" />
            <h3 className="text-sm font-semibold text-slate-700">Transcripts</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <StatItem label="Total" value={stats.transcripts.total} />
            <StatItem label="Processed" value={stats.transcripts.processed} />
            <StatItem label="Chunks" value={stats.transcripts.chunks} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-slate-500" />
            <h3 className="text-sm font-semibold text-slate-700">Slack Messages</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <StatItem label="Total" value={stats.slack_messages.total} />
            <StatItem label="Processed" value={stats.slack_messages.processed} />
            <StatItem label="Pending" value={stats.slack_messages.pending} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
