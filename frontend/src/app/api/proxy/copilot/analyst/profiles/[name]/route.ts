export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  const baseUrl = process.env.COPILOT_SERVICES_URL;
  if (!baseUrl) {
    return Response.json({ error: "Not configured" }, { status: 503 });
  }

  const res = await fetch(`${baseUrl}/api/analyst/profiles/${encodeURIComponent(name)}`);
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
