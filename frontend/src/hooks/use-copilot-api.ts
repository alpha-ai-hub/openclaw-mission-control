"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
  return res.json();
}

// ---------------------------------------------------------------------------
// Analyst Profiles
// ---------------------------------------------------------------------------

// Matches the analyst_profiles table schema exactly.
export type AnalystProfile = {
  id: string;
  analyst_name: string;
  domain: "macro" | "technical" | "hybrid";
  current_outlook?: string;
  current_portfolio?: unknown;
  analysis_methodology?: string;
  key_themes?: string[];
  recent_summary?: string;
  confidence_signals?: Record<string, unknown>;
  last_updated?: string;
  last_content_at?: string;
  change_log?: Array<{
    timestamp: string;
    field: string;
    old_value?: string;
    new_value?: string;
  }>;
  created_at?: string;
};

export type AnalystProfileWithSources = {
  profile: AnalystProfile;
  source_config: Array<{
    id: string;
    source_type: string;
    source_key: string;
    is_active: boolean;
    priority: number;
  }>;
};

// GET /api/analyst/profiles → { profiles: AnalystProfile[] }
export function useAnalystProfiles() {
  return useQuery<AnalystProfile[]>({
    queryKey: ["analyst-profiles"],
    queryFn: async () => {
      const data = await fetchJson<{ profiles: AnalystProfile[] }>(
        "/api/proxy/copilot/analyst/profiles"
      );
      return data.profiles ?? [];
    },
    refetchInterval: 60_000,
  });
}

// GET /api/analyst/profiles/{name} → { profile: AnalystProfile, source_config: [...] }
export function useAnalystProfile(name: string) {
  return useQuery<AnalystProfileWithSources>({
    queryKey: ["analyst-profile", name],
    queryFn: () =>
      fetchJson<AnalystProfileWithSources>(
        `/api/proxy/copilot/analyst/profiles/${encodeURIComponent(name)}`
      ),
    refetchInterval: 60_000,
  });
}

// ---------------------------------------------------------------------------
// Dashboard Health
// ---------------------------------------------------------------------------

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
    queryFn: () => fetchJson<DashboardHealth>("/api/proxy/copilot/dashboard/health"),
    refetchInterval: 30_000,
  });
}

// ---------------------------------------------------------------------------
// Pipeline Stats
// ---------------------------------------------------------------------------

export type PipelineStats = {
  transcripts: { total: number; processed: number; chunks: number };
  slack_messages: { total: number; processed: number; pending: number };
  recent_transcripts: Array<{
    id: string;
    title: string;
    source_type: string;
    recorded_at: string;
    processed_at: string | null;
  }>;
};

export function usePipelineStats() {
  return useQuery<PipelineStats>({
    queryKey: ["pipeline-stats"],
    queryFn: () => fetchJson<PipelineStats>("/api/proxy/copilot/dashboard/pipeline/stats"),
    refetchInterval: 30_000,
  });
}

// ---------------------------------------------------------------------------
// Ingestion Runs
// ---------------------------------------------------------------------------

export type IngestionRun = {
  id: string;
  run_type: string;
  analyst_name?: string;
  status: string;
  duration_ms?: number;
  started_at: string;
  completed_at?: string;
  result?: Record<string, unknown>;
  created_at?: string;
};

// GET /api/dashboard/runs → { runs: IngestionRun[], offset, limit }
export function useRunHistory(runType?: string, limit = 20) {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  if (runType) params.set("run_type", runType);

  return useQuery<IngestionRun[]>({
    queryKey: ["run-history", runType, limit],
    queryFn: async () => {
      const data = await fetchJson<{ runs: IngestionRun[] }>(
        `/api/proxy/copilot/dashboard/runs?${params}`
      );
      return data.runs ?? [];
    },
    refetchInterval: 30_000,
  });
}

// ---------------------------------------------------------------------------
// Trigger Refresh
// ---------------------------------------------------------------------------

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
