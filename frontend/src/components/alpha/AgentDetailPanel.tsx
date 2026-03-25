"use client";

import { formatDistanceToNow } from "date-fns";
import { RefreshCw, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAnalystRefresh, useRunHistory } from "@/hooks/use-copilot-api";
import type { AgentNodeData } from "./AgentNode";

type Props = {
  node: AgentNodeData;
  onClose: () => void;
};

export function AgentDetailPanel({ node, onClose }: Props) {
  const refresh = useAnalystRefresh();
  const { data: runs, isLoading: runsLoading } = useRunHistory(
    "analyst_refresh",
    10,
  );

  const canTrigger = node.analystName !== undefined;

  return (
    <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">{node.label}</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-slate-400 hover:text-slate-600"
        >
          Close
        </button>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">Type</span>
          <Badge variant="outline">{node.type}</Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Status</span>
          <span className="font-medium text-slate-700">
            {node.status ?? "idle"}
          </span>
        </div>
        {node.analystName && (
          <div className="flex justify-between">
            <span className="text-slate-500">Analyst</span>
            <span className="font-medium text-slate-700">
              {node.analystName}
            </span>
          </div>
        )}
      </div>

      {canTrigger && (
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={refresh.isPending}
            onClick={() => refresh.mutate(node.analystName)}
          >
            <RefreshCw
              className={cn(
                "mr-1.5 h-3.5 w-3.5",
                refresh.isPending && "animate-spin",
              )}
            />
            {refresh.isPending ? "Refreshing…" : "Trigger Refresh"}
          </Button>
        </div>
      )}

      {node.status === "placeholder" && (
        <div className="rounded-lg bg-slate-50 p-4 text-center text-sm text-slate-400">
          This agent is a placeholder — it will be configured when
          sub-orchestrators are built.
        </div>
      )}

      {canTrigger && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-500" />
              <h4 className="text-xs font-semibold text-slate-600">
                Recent Runs
              </h4>
            </div>
          </CardHeader>
          <CardContent>
            {runsLoading ? (
              <p className="text-xs text-slate-400">Loading…</p>
            ) : !runs || runs.length === 0 ? (
              <p className="text-xs text-slate-400">No run history yet</p>
            ) : (
              <div className="space-y-2">
                {runs.slice(0, 5).map((run) => (
                  <div
                    key={run.id}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-500">
                      {formatDistanceToNow(new Date(run.started_at), {
                        addSuffix: true,
                      })}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">{run.duration_ms}ms</span>
                      <Badge
                        variant={
                          run.status === "success" ? "success" : "danger"
                        }
                        className="text-[9px]"
                      >
                        {run.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
