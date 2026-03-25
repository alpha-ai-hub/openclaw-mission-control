"use client";

import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ServiceType = "persistent" | "cron" | "bot" | "infra";

type Service = {
  name: string;
  type: ServiceType;
};

type ServiceGroup = {
  label: string;
  color: string;
  services: Service[];
};

const RAILWAY_PROJECT_URL =
  "https://railway.app/project/080f162c-9a91-4793-952a-ad77c7f6f3ff";

const SERVICE_GROUPS: ServiceGroup[] = [
  {
    label: "Core Platform",
    color: "bg-blue-50 border-blue-200",
    services: [
      { name: "aai-copilot-services", type: "persistent" },
      { name: "aai-copilot", type: "persistent" },
      { name: "aai-copilot-worker", type: "persistent" },
      { name: "aai-copilot-celery", type: "persistent" },
      { name: "aai-copilot-v2 Production", type: "persistent" },
      { name: "aai-copilot-v2 Staging", type: "persistent" },
      { name: "aai API Hub Production", type: "persistent" },
      { name: "aai API Hub Staging", type: "persistent" },
      { name: "aai-api-hub", type: "persistent" },
      { name: "aai-backend-api -Dashbaord", type: "persistent" },
      { name: "aai-backend-job-live", type: "persistent" },
      { name: "Redis", type: "infra" },
      { name: "Redis-6Isw", type: "infra" },
      { name: "Redis-EGRA", type: "infra" },
    ],
  },
  {
    label: "Slack Bots",
    color: "bg-emerald-50 border-emerald-200",
    services: [
      { name: "live-slack-economic-data-bot", type: "persistent" },
      { name: "live-slack-news", type: "persistent" },
      { name: "live-X-economic-data-bot", type: "persistent" },
      { name: "live-earnings", type: "persistent" },
      { name: "slack-macro-regime-daily", type: "cron" },
      { name: "slack-positioning-signals-daily", type: "cron" },
      { name: "slack-positioning-sunday", type: "cron" },
      { name: "slack-screeners", type: "cron" },
      { name: "slack-crypto-sunday", type: "cron" },
      { name: "slack-macro-sunday", type: "cron" },
    ],
  },
  {
    label: "Telegram",
    color: "bg-sky-50 border-sky-200",
    services: [
      { name: "telegram slack bot tldr", type: "persistent" },
      { name: "Macro-Pulse-Telegram Onboard Bot", type: "persistent" },
      { name: "clawdbot", type: "bot" },
      { name: "openclaw-alex", type: "bot" },
    ],
  },
  {
    label: "Data Ingestions",
    color: "bg-violet-50 border-violet-200",
    services: [
      { name: "aai-data-ingestions 15 min", type: "cron" },
      { name: "aai-data-ingestions Daily", type: "cron" },
      { name: "aai-data-ingestions Weekly", type: "cron" },
      { name: "aai-data-ingestions Monthly", type: "cron" },
      { name: "fmp-daily", type: "cron" },
      { name: "fmp-weekly", type: "cron" },
      { name: "fmp-injestion-daily", type: "cron" },
      { name: "fathom_obsidian", type: "cron" },
    ],
  },
  {
    label: "Portfolio & Signals",
    color: "bg-amber-50 border-amber-200",
    services: [
      { name: "aai-active-portfolios-public-daily", type: "cron" },
      { name: "aai-active-portfolios-private-daily", type: "cron" },
      { name: "aai-active-portfolios-weekly-public", type: "cron" },
      { name: "aai-incubator-portfolios-public-daily", type: "cron" },
      { name: "aai-incubator-portfolios-private-daily", type: "cron" },
      { name: "aai-incubator-portfolios-weekly-public", type: "cron" },
      { name: "breathd-portfolios", type: "cron" },
      { name: "mpp-portfolio-daily", type: "cron" },
      { name: "mpp-portfolio-backtest", type: "cron" },
      { name: "populate-portfolios", type: "cron" },
      { name: "populate-signals", type: "cron" },
      { name: "populate-indicators-screeners", type: "cron" },
      { name: "populate-regime", type: "cron" },
      { name: "signals to spreadsheet", type: "cron" },
      { name: "Adaptive Signals Table", type: "cron" },
      { name: "Outperformance Screener", type: "cron" },
      { name: "mpp-postioning-signals", type: "cron" },
    ],
  },
  {
    label: "Reports & Analysis",
    color: "bg-orange-50 border-orange-200",
    services: [
      { name: "master-daily", type: "cron" },
      { name: "master-weekly", type: "cron" },
      { name: "master-week-ahead", type: "cron" },
      { name: "Weekly Macro Systems", type: "cron" },
      { name: "Weekly Regime", type: "cron" },
      { name: "weekly-earnings-outlook", type: "cron" },
      { name: "weekly-slides", type: "cron" },
      { name: "sunday-week-ahead", type: "cron" },
      { name: "sunday-context-review", type: "cron" },
      { name: "changelog-daily", type: "cron" },
      { name: "changelog-weekly", type: "cron" },
      { name: "daily-YT-summary", type: "cron" },
      { name: "daily-x-alpha", type: "cron" },
      { name: "aai-daily-debreif", type: "cron" },
      { name: "aai-weekly-debrief", type: "cron" },
      { name: "econ-friday-recap", type: "cron" },
      { name: "models-weekly", type: "cron" },
      { name: "explaining-systems-daily", type: "cron" },
      { name: "Weekly Performance", type: "cron" },
    ],
  },
  {
    label: "Agents & Bots",
    color: "bg-rose-50 border-rose-200",
    services: [
      { name: "chef_agent_alex", type: "bot" },
      { name: "conviction bot", type: "bot" },
      { name: "prediction market bot", type: "bot" },
      { name: "Content-Bot", type: "bot" },
      { name: "AL-Content-Bot", type: "bot" },
      { name: "ai-updates-bot", type: "bot" },
      { name: "price-bot-btc", type: "cron" },
      { name: "price-bot-spx", type: "cron" },
      { name: "mpp-bot-daily", type: "cron" },
      { name: "mpp-bot-weekly", type: "cron" },
      { name: "testing-portfolios-daily-slack", type: "cron" },
    ],
  },
  {
    label: "Health & Monitoring",
    color: "bg-teal-50 border-teal-200",
    services: [
      { name: "Daily Health Report", type: "cron" },
      { name: "health check", type: "persistent" },
      { name: "Data Health Service", type: "persistent" },
      { name: "Weekly health Health Report", type: "cron" },
      { name: "alpha-ai-docs", type: "persistent" },
    ],
  },
];

const TYPE_BADGE: Record<
  ServiceType,
  { label: string; variant: "accent" | "success" | "warning" | "outline" }
> = {
  persistent: { label: "live", variant: "success" },
  cron: { label: "cron", variant: "accent" },
  bot: { label: "bot", variant: "warning" },
  infra: { label: "infra", variant: "outline" },
};

function filterGroups(groups: ServiceGroup[], filter: string): ServiceGroup[] {
  if (!filter) return groups;
  return groups
    .map((group) => ({
      ...group,
      services: group.services.filter((s) =>
        s.name.toLowerCase().includes(filter),
      ),
    }))
    .filter((g) => g.services.length > 0);
}

type Props = {
  filter: string;
};

export function RailwayServicesGrid({ filter }: Props) {
  const lowerFilter = filter.toLowerCase();
  const groups = filterGroups(SERVICE_GROUPS, lowerFilter);
  const totalShown = groups.reduce((n, g) => n + g.services.length, 0);

  if (totalShown === 0) {
    return (
      <div className="py-16 text-center text-sm text-slate-400">
        No services match &ldquo;{filter}&rdquo;
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.label}>
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-sm font-semibold text-slate-700">
              {group.label}
            </h2>
            <span className="text-xs text-slate-400">
              {group.services.length}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
            {group.services.map((svc) => {
              const badge = TYPE_BADGE[svc.type];
              return (
                <a
                  key={svc.name}
                  href={RAILWAY_PROJECT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group flex items-start justify-between gap-2 rounded-xl border p-3 transition hover:shadow-md hover:-translate-y-0.5",
                    group.color,
                  )}
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-700 leading-snug break-words">
                      {svc.name}
                    </p>
                    <Badge
                      variant={badge.variant}
                      className="mt-1.5 text-[9px] px-1.5 py-0"
                    >
                      {badge.label}
                    </Badge>
                  </div>
                  <ExternalLink className="h-3 w-3 text-slate-300 flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
