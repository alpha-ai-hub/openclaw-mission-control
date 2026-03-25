export async function POST(req: Request) {
  const baseUrl = process.env.COPILOT_SERVICES_URL;
  const token = process.env.ANALYST_REFRESH_TOKEN;

  if (!baseUrl || !token) {
    return Response.json({ error: "Not configured" }, { status: 503 });
  }

  const url = new URL(req.url);
  const analystName = url.searchParams.get("analyst_name");
  const upstream = `${baseUrl}/api/analyst/refresh${analystName ? `?analyst_name=${encodeURIComponent(analystName)}` : ""}`;

  const res = await fetch(upstream, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  return Response.json(data, { status: res.status });
}
