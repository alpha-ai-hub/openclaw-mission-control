"use client";

import { useState } from "react";
import { Search, ExternalLink } from "lucide-react";
import { DashboardPageLayout } from "@/components/templates/DashboardPageLayout";
import { RailwayServicesGrid } from "@/components/alpha/RailwayServicesGrid";

const TOTAL_SERVICES = 90;
const RAILWAY_PROJECT_URL =
  "https://railway.app/project/080f162c-9a91-4793-952a-ad77c7f6f3ff";

export default function RailwayPage() {
  const [filter, setFilter] = useState("");

  return (
    <DashboardPageLayout
      signedOut={{
        message: "Sign in to view Railway services",
        forceRedirectUrl: "/alpha/railway",
      }}
      title="Railway Services"
      description={`${TOTAL_SERVICES} services across production`}
      headerActions={
        <a
          href={RAILWAY_PROJECT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:border-slate-300 hover:text-slate-800 transition"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open in Railway
        </a>
      }
    >
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Filter services..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full max-w-sm rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <RailwayServicesGrid filter={filter} />
    </DashboardPageLayout>
  );
}
