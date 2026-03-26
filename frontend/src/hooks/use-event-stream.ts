"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";

export type FeedEvent = {
  id: string;
  type: string;
  timestamp: string;
  priority: "high" | "medium" | "low";
  data: Record<string, unknown>;
};

const PRIORITY_MAP: Record<string, FeedEvent["priority"]> = {
  profile_updated: "high",
  ingestion_run_completed: "high",
  transcript_processed: "medium",
  slack_processed: "low",
  worker_heartbeat: "low",
};

let eventCounter = 0;

export function useEventStream(maxItems = 200) {
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  const connect = useCallback(() => {
    controllerRef.current?.abort();
    const ctrl = new AbortController();
    controllerRef.current = ctrl;

    fetchEventSource("/api/proxy/copilot/events/stream", {
      signal: ctrl.signal,
      onopen: async () => {
        setConnected(true);
      },
      onmessage(ev) {
        if (!ev.data) return;
        try {
          const parsed = JSON.parse(ev.data);
          const type = parsed.type ?? "unknown";
          if (type === "connected") return;

          // The SSE frame payload is { type, timestamp, data: { ...fields } }.
          // Unwrap the inner data so consumers get the event-specific fields directly.
          const eventData =
            parsed.data && typeof parsed.data === "object"
              ? (parsed.data as Record<string, unknown>)
              : (parsed as Record<string, unknown>);

          const event: FeedEvent = {
            id: `evt-${++eventCounter}-${Date.now()}`,
            type,
            timestamp: parsed.timestamp ?? new Date().toISOString(),
            priority: PRIORITY_MAP[type] ?? "low",
            data: eventData,
          };

          setEvents((prev) => [event, ...prev].slice(0, maxItems));
        } catch {
          // skip unparseable events
        }
      },
      onerror() {
        setConnected(false);
      },
    });
  }, [maxItems]);

  useEffect(() => {
    connect();
    return () => controllerRef.current?.abort();
  }, [connect]);

  return { events, connected };
}
