"use client";

import { DashboardPageLayout } from "@/components/templates/DashboardPageLayout";
import { HealthCard } from "@/components/alpha/HealthCard";
import { PipelineStats } from "@/components/alpha/PipelineStats";
import { RunHistoryTable } from "@/components/alpha/RunHistoryTable";
import { useDashboardHealth, usePipelineStats, useRunHistory } from "@/hooks/use-copilot-api";

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

        {/* Run History */}
        <section>
          <h2 className="text-sm font-semibold text-slate-600 mb-3">Ingestion Runs</h2>
          <RunHistoryTable runs={runs.data ?? []} isLoading={runs.isLoading} />
        </section>
      </div>
    </DashboardPageLayout>
  );
}
