"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AgentNode, type AgentNodeData } from "./AgentNode";
import { AgentDetailPanel } from "./AgentDetailPanel";

const NODES: AgentNodeData[] = [
  {
    id: "main",
    label: "Main Orchestrator",
    type: "orchestrator",
    status: "active",
  },
  {
    id: "macro-sub",
    label: "Macro Sub-Orchestrator",
    type: "sub-orchestrator",
    analystName: "Luke",
    status: "active",
  },
  {
    id: "tech-sub",
    label: "Technical Sub-Orchestrator",
    type: "sub-orchestrator",
    analystName: "Gabriel",
    status: "active",
  },
  { id: "macro-agent-1", label: "Macro Agent 1", type: "agent", status: "placeholder" },
  { id: "macro-agent-2", label: "Macro Agent 2", type: "agent", status: "placeholder" },
  { id: "tech-agent-1", label: "Tech Agent 1", type: "agent", status: "placeholder" },
  { id: "tech-agent-2", label: "Tech Agent 2", type: "agent", status: "placeholder" },
];

const EDGES: [string, string][] = [
  ["main", "macro-sub"],
  ["main", "tech-sub"],
  ["macro-sub", "macro-agent-1"],
  ["macro-sub", "macro-agent-2"],
  ["tech-sub", "tech-agent-1"],
  ["tech-sub", "tech-agent-2"],
];

type Point = { x: number; y: number };

export function AgentFlowchart() {
  const [selected, setSelected] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [lines, setLines] = useState<{ from: Point; to: Point }[]>([]);

  const computeLines = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();

    const newLines: { from: Point; to: Point }[] = [];
    for (const [fromId, toId] of EDGES) {
      const fromEl = nodeRefs.current[fromId];
      const toEl = nodeRefs.current[toId];
      if (!fromEl || !toEl) continue;

      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();

      newLines.push({
        from: {
          x: fromRect.left + fromRect.width / 2 - containerRect.left,
          y: fromRect.bottom - containerRect.top,
        },
        to: {
          x: toRect.left + toRect.width / 2 - containerRect.left,
          y: toRect.top - containerRect.top,
        },
      });
    }
    setLines(newLines);
  }, []);

  useEffect(() => {
    computeLines();
    window.addEventListener("resize", computeLines);
    return () => window.removeEventListener("resize", computeLines);
  }, [computeLines]);

  useEffect(() => {
    const t = setTimeout(computeLines, 100);
    return () => clearTimeout(t);
  }, [computeLines]);

  const selectedNode = NODES.find((n) => n.id === selected);

  return (
    <div className="flex gap-8">
      <div ref={containerRef} className="relative flex-1">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ zIndex: 0 }}
        >
          {lines.map((line, i) => (
            <path
              key={i}
              d={`M ${line.from.x} ${line.from.y} C ${line.from.x} ${line.from.y + 30}, ${line.to.x} ${line.to.y - 30}, ${line.to.x} ${line.to.y}`}
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="2"
              strokeDasharray="6 3"
            />
          ))}
        </svg>

        <div className="relative z-10 flex flex-col items-center gap-12 py-8">
          <div
            ref={(el) => {
              nodeRefs.current.main = el;
            }}
          >
            <AgentNode
              node={NODES[0]}
              selected={selected === "main"}
              onClick={() =>
                setSelected(selected === "main" ? null : "main")
              }
            />
          </div>

          <div className="flex gap-24">
            <div
              ref={(el) => {
                nodeRefs.current["macro-sub"] = el;
              }}
            >
              <AgentNode
                node={NODES[1]}
                selected={selected === "macro-sub"}
                onClick={() =>
                  setSelected(selected === "macro-sub" ? null : "macro-sub")
                }
              />
            </div>
            <div
              ref={(el) => {
                nodeRefs.current["tech-sub"] = el;
              }}
            >
              <AgentNode
                node={NODES[2]}
                selected={selected === "tech-sub"}
                onClick={() =>
                  setSelected(selected === "tech-sub" ? null : "tech-sub")
                }
              />
            </div>
          </div>

          <div className="flex gap-8">
            <div
              ref={(el) => {
                nodeRefs.current["macro-agent-1"] = el;
              }}
            >
              <AgentNode
                node={NODES[3]}
                selected={selected === "macro-agent-1"}
                onClick={() =>
                  setSelected(
                    selected === "macro-agent-1" ? null : "macro-agent-1",
                  )
                }
              />
            </div>
            <div
              ref={(el) => {
                nodeRefs.current["macro-agent-2"] = el;
              }}
            >
              <AgentNode
                node={NODES[4]}
                selected={selected === "macro-agent-2"}
                onClick={() =>
                  setSelected(
                    selected === "macro-agent-2" ? null : "macro-agent-2",
                  )
                }
              />
            </div>
            <div
              ref={(el) => {
                nodeRefs.current["tech-agent-1"] = el;
              }}
            >
              <AgentNode
                node={NODES[5]}
                selected={selected === "tech-agent-1"}
                onClick={() =>
                  setSelected(
                    selected === "tech-agent-1" ? null : "tech-agent-1",
                  )
                }
              />
            </div>
            <div
              ref={(el) => {
                nodeRefs.current["tech-agent-2"] = el;
              }}
            >
              <AgentNode
                node={NODES[6]}
                selected={selected === "tech-agent-2"}
                onClick={() =>
                  setSelected(
                    selected === "tech-agent-2" ? null : "tech-agent-2",
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>

      {selectedNode && (
        <AgentDetailPanel node={selectedNode} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
