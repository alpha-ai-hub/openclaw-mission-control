# Copilot Services Integration Reference

Integration guide for connecting OpenClaw Mission Control to the `aai-copilot-services` backend.

## Base URL

Production: `https://<copilot-services-railway-domain>`

Set via `COPILOT_SERVICES_URL` env var in mission control.

## Authentication

All dashboard/events endpoints require a bearer token:

```
Authorization: Bearer <COPILOT_SERVICES_API_TOKEN>
```

Set `COPILOT_SERVICES_API_TOKEN` in mission control env to match `DASHBOARD_API_TOKEN` in copilot-services.

## Required Environment Variables

| Var | Description |
| --- | --- |
| `COPILOT_SERVICES_URL` | Base URL of copilot-services Railway deployment |
| `COPILOT_SERVICES_API_TOKEN` | Bearer token matching `DASHBOARD_API_TOKEN` in copilot-services |

## Endpoint Reference

### System Health

```
GET /api/dashboard/health
```

Returns component health for Redis, Pinecone, and Supabase.

Response:
```json
{
  "healthy": true,
  "components": {
    "redis": {"healthy": true},
    "pinecone": {"healthy": true, "total_vectors": 15000, "namespaces": 5},
    "supabase": {"healthy": true, "reachable": true}
  }
}
```

### Pipeline Statistics

```
GET /api/dashboard/pipeline/stats
```

Returns transcript and Slack message processing counts.

Response:
```json
{
  "transcripts": {"total": 120, "processed": 118, "chunks": 4500},
  "slack_messages": {"total": 5000, "processed": 4950, "pending": 50},
  "recent_transcripts": [...]
}
```

### Ingestion Run History

```
GET /api/dashboard/runs?limit=20&offset=0&run_type=analyst_refresh
```

Query params: `limit` (max 100), `offset`, `run_type` (optional filter).

### RAG Stats

```
GET /api/dashboard/rag/stats
```

Returns Pinecone index statistics: namespace names, vector counts, dimension.

### Analyst Profiles

```
GET /api/analyst/profiles
GET /api/analyst/profiles/{name}
```

No auth required. Returns analyst profile data and source configurations.

### Trigger Profile Refresh

```
POST /api/analyst/refresh
POST /api/analyst/refresh?analyst_name=Luke
```

Requires `Authorization: Bearer <ANALYST_REFRESH_TOKEN>` (not the dashboard token — this uses a separate token that the Railway cron also uses).

### Prompt Management

```
GET  /api/dashboard/prompts
GET  /api/dashboard/prompts/{name}
PUT  /api/dashboard/prompts/{name}
```

PUT body:
```json
{"content": "New prompt text...", "updated_by": "dashboard"}
```

### SSE Event Stream

```
GET /api/events/stream
GET /api/events/stream?types=profile_updated,transcript_processed
```

Real-time server-sent events. Since standard `EventSource` doesn't support auth headers, use `@microsoft/fetch-event-source` or equivalent:

```typescript
import { fetchEventSource } from '@microsoft/fetch-event-source';

await fetchEventSource(`${baseUrl}/api/events/stream`, {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  onmessage(ev) {
    const data = JSON.parse(ev.data);
    switch (data.type) {
      case 'profile_updated':
        // { analyst_name, fields_changed }
        break;
      case 'transcript_processed':
        // { source_type, title, chunks }
        break;
      case 'slack_processed':
        // { batch_size, success }
        break;
      case 'worker_heartbeat':
        // { worker }
        break;
      case 'ingestion_run_completed':
        // { run_type, status, result }
        break;
    }
  },
  onerror(err) {
    console.error('SSE error:', err);
  },
});
```

## Event Types

| Event | Data Fields | When |
| --- | --- | --- |
| `connected` | `{}` | On successful SSE connection |
| `profile_updated` | `analyst_name`, `fields_changed` | After analyst profile LLM update |
| `transcript_processed` | `source_type`, `title`, `chunks` | After transcript embedding |
| `slack_processed` | `batch_size`, `success` | After Slack worker batch |
| `worker_heartbeat` | `worker` | Each Slack worker loop iteration |
| `ingestion_run_completed` | `run_type`, `status`, `result` | After any ingestion run |

## Architecture Notes

- Copilot-services is the data backbone — it owns all writes to Pinecone, analyst profiles, transcripts, and Slack messages.
- Mission control should only read from copilot-services via these API endpoints. Direct Supabase/Pinecone access from mission control is discouraged.
- SSE is one-directional (server push). Control actions (trigger refresh, update prompt) use standard REST POST/PUT.
- If the SSE connection drops, reconnect — the stream is stateless and will resume from current events.

## Implementation in this repo

### Proxy routes

All calls to copilot-services go through Next.js server-side API routes. This keeps tokens out of the browser bundle.

| Proxy route | Forwards to |
| --- | --- |
| `GET /api/proxy/copilot/events/stream` | `GET /api/events/stream` (SSE passthrough) |
| `GET /api/proxy/copilot/analyst/profiles` | `GET /api/analyst/profiles` |
| `GET /api/proxy/copilot/analyst/profiles/[name]` | `GET /api/analyst/profiles/{name}` |
| `POST /api/proxy/copilot/analyst/refresh` | `POST /api/analyst/refresh` (uses `ANALYST_REFRESH_TOKEN`) |
| `GET /api/proxy/copilot/dashboard/[...path]` | `GET /api/dashboard/{path}` (health, runs, pipeline/stats) |

All files live under `frontend/src/app/api/proxy/copilot/`.

### React hooks

| Hook | File | Purpose |
| --- | --- | --- |
| `useEventStream` | `src/hooks/use-event-stream.ts` | SSE subscription; returns `events`, `status`, `clear` |
| `useAnalystProfiles` | `src/hooks/use-copilot-api.ts` | `GET /api/analyst/profiles` |
| `useAnalystProfile(name)` | `src/hooks/use-copilot-api.ts` | `GET /api/analyst/profiles/{name}` |
| `useDashboardHealth` | `src/hooks/use-copilot-api.ts` | `GET /api/dashboard/health` |
| `usePipelineStats` | `src/hooks/use-copilot-api.ts` | `GET /api/dashboard/pipeline/stats` |
| `useDashboardRuns(params)` | `src/hooks/use-copilot-api.ts` | `GET /api/dashboard/runs` |
| `useRefreshAnalyst` | `src/hooks/use-copilot-api.ts` | `POST /api/analyst/refresh` (TanStack mutation) |

### Extending the Agents page for new services

The flowchart in `src/components/alpha/AgentFlowchart.tsx` uses a static `NODES` array. To add a new agent (e.g. from `openclaw-market-agent` when connected):

1. Add an entry to `NODES` with `id`, `label`, `type`, and optionally `analystName`.
2. Add entries to `EDGES` to draw connections between nodes.
3. The detail panel and cron-trigger button will appear automatically.

No other changes are needed to the routing or page structure.

## Update Rule

Update this file when copilot-services API endpoints change or new proxy routes are added.
