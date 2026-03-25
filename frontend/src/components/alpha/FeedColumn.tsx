"use client";

import { Badge } from "@/components/ui/badge";
import type { FeedEvent } from "@/hooks/use-event-stream";
import { FeedCard } from "./FeedCard";

const COLUMN_CONFIG = {
  high: { label: "High Priority", variant: "danger" as const, emptyText: "No high-priority events" },
  medium: { label: "Medium Priority", variant: "warning" as const, emptyText: "No medium-priority events" },
  low: { label: "Low Priority", variant: "default" as const, emptyText: "No low-priority events" },
};

type FeedColumnProps = {
  priority: "high" | "medium" | "low";
  events: FeedEvent[];
};

export function FeedColumn({ priority, events }: FeedColumnProps) {
  const config = COLUMN_CONFIG[priority];

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between px-1 pb-3">
        <h2 className="text-sm font-semibold text-slate-700">{config.label}</h2>
        <Badge variant={config.variant}>{events.length}</Badge>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {events.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white/50 p-8 text-center">
            <p className="text-sm text-slate-400">{config.emptyText}</p>
          </div>
        ) : (
          events.map((evt) => <FeedCard key={evt.id} event={evt} />)
        )}
      </div>
    </div>
  );
}
