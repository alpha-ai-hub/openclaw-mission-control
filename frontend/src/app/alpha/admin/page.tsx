"use client";

import { formatDistanceToNow } from "date-fns";
import { Clock, RefreshCw } from "lucide-react";
import { DashboardPageLayout } from "@/components/templates/DashboardPageLayout";
import { HealthCard } from "@/components/alpha/HealthCard";
import { PipelineStats } from "@/components/alpha/PipelineStats";
import { RunHistoryTable } from "@/components/alpha/RunHistoryTable";
import {
  useDashboardHealth,
  usePipelineStats,
  useRunHistory,
  useAnalystProfile,
  useAnalystRefresh,
} from "@/hooks/use-copilot-api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function AnalystChangeLog({ name }: { name: string }) {
  const { data, isLoading, error } = useAnalystProfile(name);
  const refresh = useAnalystRefresh();

  const profile = data?.profile;
  const changeLog = profile?.change_log ?? [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-700">
              {name} — Analyst Change Log
            </h3>
            {profile?.last_updated && (
              <span className="text-xs text-slate-400">
                last updated{" "}
                {formatDistanceToNow(new Date(profile.last_updated), { addSuffix: true })}
              </span>
            )}
          </div>
          <Button
            size="sm"
            variant="outline"
            disabled={refresh.isPending}
            onClick={() => refresh.mutate(name)}
          >
            <RefreshCw className={`h-3 w-3 mr-1.5 ${refresh.isPending ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-sm text-slate-400">Loading…</p>}
        {error && (
          <p className="text-sm text-red-600">Failed to load: {error.message}</p>
        )}
        {!isLoading && !error && changeLog.length === 0 && (
          <p className="text-sm text-slate-400 italic">No change log entries yet.</p>
        )}
        {changeLog.length > 0 && (
          <ol className="space-y-3">
            {changeLog.map((entry, i) => (
              <li
                key={`${entry.timestamp}-${i}`}
                className="flex items-start gap-3 text-sm"
              >
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs font-mono">
                      {entry.field}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  {(entry.old_value || entry.new_value) && (
                    <div className="mt-1 grid grid-cols-2 gap-2 text-xs">
                      {entry.old_value && (
                        <div className="rounded bg-red-50 px-2 py-1 text-red-700">
                          <span className="font-medium">before: </span>
                          {entry.old_value}
                        </div>
                      )}
                      {entry.new_value && (
                        <div className="rounded bg-green-50 px-2 py-1 text-green-700">
                          <span className="font-medium">after: </span>
                          {entry.new_value}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminPage() {
  const health = useDashboardHealth();
  const stats = usePipelineStats();
  const runs = useRunHistory();

  return (
    <DashboardPageLayout
      signedOut={{ message: "Sign in to view admin panel", forceRedirectUrl: "/alpha/admin" }}
      title="Admin"
      description="System health, pipeline statistics, and run history"
    >
      <div className="space-y-8">
        {/* Health Section */}
        <section>
          <h2 className="text-sm font-semibold text-slate-600 mb-3">System Health</h2>
          {health.isLoading ? (
            <p className="text-sm text-slate-400">Loading health data…</p>
          ) : health.error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Failed to load health data
            </div>
          ) : health.data ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Object.entries(health.data.components).map(([name, component]) => (
                <HealthCard
                  key={name}
                  name={name}
                  healthy={component.healthy}
                  details={component as Record<string, unknown>}
                />
              ))}
            </div>
          ) : null}
        </section>

        {/* Analyst Change Logs */}
        <section>
          <h2 className="text-sm font-semibold text-slate-600 mb-3">
            Analyst Ingestion Change Logs
          </h2>
          <div className="space-y-4">
            <AnalystChangeLog name="Luke" />
            <AnalystChangeLog name="Gabriel" />
          </div>
        </section>

        {/* Pipeline Stats */}
        <section>
          <h2 className="text-sm font-semibold text-slate-600 mb-3">Pipeline Statistics</h2>
          {stats.isLoading ? (
            <p className="text-sm text-slate-400">Loading pipeline stats…</p>
          ) : stats.error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Failed to load pipeline stats
            </div>
          ) : stats.data ? (
            <PipelineStats stats={stats.data} />
          ) : null}
        </section>

        {/* Ingestion Runs */}
        <section>
          <h2 className="text-sm font-semibold text-slate-600 mb-3">Ingestion Runs</h2>
          <RunHistoryTable runs={runs.data ?? []} isLoading={runs.isLoading} />
        </section>
      </div>
    </DashboardPageLayout>
  );
}
