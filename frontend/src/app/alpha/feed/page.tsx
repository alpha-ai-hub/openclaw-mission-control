"use client";

import { useMemo } from "react";

import { DashboardPageLayout } from "@/components/templates/DashboardPageLayout";
import { FeedColumn } from "@/components/alpha/FeedColumn";
import { useEventStream } from "@/hooks/use-event-stream";
import { cn } from "@/lib/utils";

export default function FeedPage() {
  const { events, connected } = useEventStream();

  const { high, medium, low } = useMemo(() => {
    const high = events.filter((e) => e.priority === "high");
    const medium = events.filter((e) => e.priority === "medium");
    const low = events.filter((e) => e.priority === "low");
    return { high, medium, low };
  }, [events]);

  return (
    <DashboardPageLayout
      signedOut={{ message: "Sign in to view the feed", forceRedirectUrl: "/alpha/feed" }}
      title="Live Feed"
      description="Real-time agent output stream"
      headerActions={
        <div className="flex items-center gap-2 text-xs">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              connected ? "bg-emerald-500" : "bg-slate-300",
            )}
          />
          <span className="text-slate-500">
            {connected ? "Connected" : "Disconnected"}
          </span>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        <FeedColumn priority="high" events={high} />
        <FeedColumn priority="medium" events={medium} />
        <FeedColumn priority="low" events={low} />
      </div>
    </DashboardPageLayout>
  );
}
