export async function GET(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const baseUrl = process.env.COPILOT_SERVICES_URL;
  const token = process.env.COPILOT_SERVICES_API_TOKEN;

  if (!baseUrl || !token) {
    return Response.json({ error: "Not configured" }, { status: 503 });
  }

  const url = new URL(req.url);
  const upstream = `${baseUrl}/api/dashboard/${path.join("/")}${url.search}`;

  const res = await fetch(upstream, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  return Response.json(data, { status: res.status });
}
