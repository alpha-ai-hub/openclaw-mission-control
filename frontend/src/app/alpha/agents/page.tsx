"use client";

import { DashboardPageLayout } from "@/components/templates/DashboardPageLayout";
import { AgentFlowchart } from "@/components/alpha/AgentFlowchart";

export default function AgentsPage() {
  return (
    <DashboardPageLayout
      signedOut={{
        message: "Sign in to view agents",
        forceRedirectUrl: "/alpha/agents",
      }}
      title="Agent Orchestration"
      description="Visual overview of the agent hierarchy"
    >
      <AgentFlowchart />
    </DashboardPageLayout>
  );
}
