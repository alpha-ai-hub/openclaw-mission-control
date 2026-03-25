# Architecture

## High level

- Frontend: Next.js
- Backend: FastAPI
- Database: Postgres

## Alpha AI Dashboard (additive layer)

The Alpha AI section (`/alpha/*`) is built on top of Mission Control as a purely additive feature set. It does not touch the existing OpenClaw backend or database.

### Data flow

```
Browser → Next.js frontend
  ├─ Existing routes → OpenClaw FastAPI backend → Postgres
  └─ /alpha/* routes → Next.js API proxy routes (/api/proxy/copilot/*)
                          └─ aai-copilot-services (Railway) → Supabase / Pinecone / Redis
```

### Proxy layer

All copilot-services calls go through server-side Next.js API routes so bearer tokens (`COPILOT_SERVICES_API_TOKEN`, `ANALYST_REFRESH_TOKEN`) never reach the browser. Routes live under `frontend/src/app/api/proxy/copilot/`.

### Pages

| Route | Purpose | Data source |
| --- | --- | --- |
| `/alpha/feed` | Live SSE event feed (High/Medium/Low priority columns) | SSE `GET /api/events/stream` |
| `/alpha/analysts/macro` | Luke's analyst profile | `GET /api/analyst/profiles/Luke` |
| `/alpha/analysts/technical` | Gabriel's analyst profile | `GET /api/analyst/profiles/Gabriel` |
| `/alpha/agents` | Orchestrator flowchart with clickable detail panels | `GET /api/dashboard/runs`, `POST /api/analyst/refresh` |
| `/alpha/admin` | System health, pipeline stats, run history | `GET /api/dashboard/health`, `/pipeline/stats`, `/runs` |
| `/alpha/railway` | Visual map of all 90 Railway services grouped by category | Static (links to Railway project) |

### Extending the Agents page

When new agents are added (e.g. from `openclaw-market-agent`), add nodes to `NODES` in `frontend/src/components/alpha/AgentFlowchart.tsx`. Each node supports: label, type (`orchestrator` / `sub-orchestrator` / `agent`), optional `analystName` for cron trigger wiring, and status.

> **Note**
> Add component diagrams and key data flows (auth, task lifecycle, gateway integration) as they solidify.
