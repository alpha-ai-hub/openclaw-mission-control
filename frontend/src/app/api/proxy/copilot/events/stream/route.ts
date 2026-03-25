export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const baseUrl = process.env.COPILOT_SERVICES_URL;
  const token = process.env.COPILOT_SERVICES_API_TOKEN;

  if (!baseUrl || !token) {
    return new Response("Copilot services not configured", { status: 503 });
  }

  const url = new URL(req.url);
  const types = url.searchParams.get("types");
  const upstream = `${baseUrl}/api/events/stream${types ? `?types=${types}` : ""}`;

  const res = await fetch(upstream, {
    headers: { Authorization: `Bearer ${token}` },
    // @ts-expect-error -- Node fetch supports this for streaming
    duplex: "half",
  });

  if (!res.ok || !res.body) {
    return new Response("Upstream error", { status: res.status });
  }

  return new Response(res.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
