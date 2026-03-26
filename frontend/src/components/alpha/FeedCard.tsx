"use client";

import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { FeedEvent } from "@/hooks/use-event-stream";

const EVENT_LABELS: Record<string, string> = {
  profile_updated: "Profile Updated",
  ingestion_run_completed: "Ingestion Complete",
  transcript_processed: "Transcript Processed",
  slack_processed: "Slack Batch",
  worker_heartbeat: "Worker Heartbeat",
};

const PRIORITY_VARIANT = {
  high: "danger",
  medium: "warning",
  low: "default",
} as const;

function summarize(event: FeedEvent): string {
  const d = event.data;
  switch (event.type) {
    case "profile_updated":
      return `${d.analyst_name ?? "Analyst"} profile updated — ${(d.fields_changed as string[])?.join(", ") ?? "fields changed"}`;
    case "ingestion_run_completed": {
      const status = String(d.status ?? "completed");
      const runType = String(d.run_type ?? "run").replace(/_/g, " ");
      const result = d.result as Record<string, unknown> | undefined;
      const detail = result
        ? Object.entries(result)
            .map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`)
            .join(" · ")
        : "";
      return `${runType} ${status}${detail ? ` — ${detail}` : ""}`;
    }
    case "transcript_processed":
      return `${d.title ?? "Transcript"} (${d.source_type ?? "source"}) — ${d.chunks ?? "?"} chunks`;
    case "slack_processed":
      return `Batch of ${d.batch_size ?? "?"} messages — ${d.success ?? "?"} succeeded`;
    case "worker_heartbeat":
      return `${d.worker ?? "Worker"} is alive`;
    default:
      return JSON.stringify(d);
  }
}

export function FeedCard({ event }: { event: FeedEvent }) {
  const label = EVENT_LABELS[event.type] ?? event.type;
  const variant = PRIORITY_VARIANT[event.priority];

  return (
    <Card className="rounded-2xl surface-card">
      <CardContent className="pt-4 pb-4 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-slate-500">
            {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
          </span>
          <Badge variant={variant} className="text-[10px]">
            {event.priority}
          </Badge>
        </div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="text-sm text-slate-700 leading-relaxed">
          {summarize(event)}
        </p>
      </CardContent>
    </Card>
  );
}
