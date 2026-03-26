"use client";

import { DashboardPageLayout } from "@/components/templates/DashboardPageLayout";
import { AnalystProfile } from "@/components/alpha/AnalystProfile";
import { useAnalystProfile } from "@/hooks/use-copilot-api";

export default function TechnicalPage() {
  const { data, isLoading, error } = useAnalystProfile("Gabriel");

  return (
    <DashboardPageLayout
      signedOut={{ message: "Sign in to view analyst data", forceRedirectUrl: "/alpha/analysts/technical" }}
      title="Technical Analyst"
      description="Gabriel's technical research profile and analysis"
    >
      {isLoading && (
        <p className="text-sm text-slate-500">Loading profile…</p>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to load profile: {error.message}
        </div>
      )}
      {data && <AnalystProfile profile={data.profile} />}
    </DashboardPageLayout>
  );
}
