"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type AgentNodeData = {
  id: string;
  label: string;
  type: "orchestrator" | "sub-orchestrator" | "agent";
  analystName?: string;
  status?: "active" | "idle" | "placeholder";
};

type Props = {
  node: AgentNodeData;
  selected: boolean;
  onClick: () => void;
};

const TYPE_STYLES = {
  orchestrator: "border-blue-300 bg-blue-50",
  "sub-orchestrator": "border-indigo-300 bg-indigo-50",
  agent: "border-slate-200 bg-white",
};

export function AgentNode({ node, selected, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border-2 px-5 py-3 text-left shadow-sm transition-all hover:shadow-md",
        TYPE_STYLES[node.type],
        selected && "ring-2 ring-blue-500 ring-offset-2",
      )}
    >
      <p className="text-sm font-semibold text-slate-800">{node.label}</p>
      <div className="mt-1 flex items-center gap-2">
        <span
          className={cn(
            "h-2 w-2 rounded-full",
            node.status === "active"
              ? "bg-emerald-500"
              : node.status === "idle"
                ? "bg-amber-400"
                : "bg-slate-300",
          )}
        />
        <span className="text-xs text-slate-500">
          {node.status === "placeholder" ? "Coming soon" : node.status ?? "idle"}
        </span>
        {node.type !== "agent" && (
          <Badge variant="outline" className="ml-auto text-[9px]">
            {node.type}
          </Badge>
        )}
      </div>
    </button>
  );
}
