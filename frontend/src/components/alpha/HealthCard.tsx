"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  name: string;
  healthy: boolean;
  details?: Record<string, unknown>;
};

export function HealthCard({ name, healthy, details }: Props) {
  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "h-3 w-3 rounded-full flex-shrink-0",
              healthy ? "bg-emerald-500" : "bg-rose-500",
            )}
          />
          <div>
            <p className="text-sm font-semibold text-slate-700 capitalize">{name}</p>
            <p className="text-xs text-slate-400">
              {healthy ? "Operational" : "Degraded"}
            </p>
          </div>
        </div>
        {details && Object.keys(details).length > 1 && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {Object.entries(details)
              .filter(([key]) => key !== "healthy")
              .map(([key, value]) => (
                <div key={key} className="rounded-lg bg-slate-50 px-3 py-2">
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                    {key.replace(/_/g, " ")}
                  </p>
                  <p className="text-sm font-semibold text-slate-700">{String(value)}</p>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
