"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
  return res.json();
}

// --- Analyst Profiles ---

export type AnalystProfile = {
  name: string;
  current_outlook?: string;
  key_themes?: string[];
  recent_summary?: string;
  confidence_signals?: Record<string, unknown>;
  change_log?: Array<{
    timestamp: string;
    field: string;
    old_value?: string;
    new_value?: string;
  }>;
  [key: string]: unknown;
};

export function useAnalystProfile(name: string) {
  return useQuery<AnalystProfile>({
    queryKey: ["analyst-profile", name],
    queryFn: () => fetchJson(`/api/proxy/copilot/analyst/profiles/${encodeURIComponent(name)}`),
    refetchInterval: 60_000,
  });
}

export function useAnalystProfiles() {
  return useQuery<AnalystProfile[]>({
    queryKey: ["analyst-profiles"],
    queryFn: () => fetchJson("/api/proxy/copilot/analyst/profiles"),
    refetchInterval: 60_000,
  });
}

// --- Dashboard Health ---

export type ComponentHealth = {
  healthy: boolean;
  [key: string]: unknown;
};

export type DashboardHealth = {
  healthy: boolean;
  components: Record<string, ComponentHealth>;
};

export function useDashboardHealth() {
  return useQuery<DashboardHealth>({
    queryKey: ["dashboard-health"],
    queryFn: () => fetchJson("/api/proxy/copilot/dashboard/health"),
    refetchInterval: 30_000,
  });
}

// --- Pipeline Stats ---

export type PipelineStats = {
  transcripts: { total: number; processed: number; chunks: number };
  slack_messages: { total: number; processed: number; pending: number };
  recent_transcripts: unknown[];
};

export function usePipelineStats() {
  return useQuery<PipelineStats>({
    queryKey: ["pipeline-stats"],
    queryFn: () => fetchJson("/api/proxy/copilot/dashboard/pipeline/stats"),
    refetchInterval: 30_000,
  });
}

// --- Run History ---

export type IngestionRun = {
  id: string;
  run_type: string;
  status: string;
  duration_ms: number;
  started_at: string;
  result?: Record<string, unknown>;
};

export function useRunHistory(runType?: string, limit = 20) {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  if (runType) params.set("run_type", runType);

  return useQuery<IngestionRun[]>({
    queryKey: ["run-history", runType, limit],
    queryFn: () => fetchJson(`/api/proxy/copilot/dashboard/runs?${params}`),
    refetchInterval: 30_000,
  });
}

// --- Trigger Refresh ---

export function useAnalystRefresh() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (analystName?: string) => {
      const url = analystName
        ? `/api/proxy/copilot/analyst/refresh?analyst_name=${encodeURIComponent(analystName)}`
        : "/api/proxy/copilot/analyst/refresh";
      const res = await fetch(url, { method: "POST" });
      if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["analyst-profile"] });
      qc.invalidateQueries({ queryKey: ["analyst-profiles"] });
      qc.invalidateQueries({ queryKey: ["run-history"] });
    },
  });
}
