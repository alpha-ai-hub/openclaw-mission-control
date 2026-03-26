export async function GET() {
  const baseUrl = process.env.COPILOT_SERVICES_URL;
  const token = process.env.ANALYST_REFRESH_TOKEN;

  if (!baseUrl || !token) {
    return Response.json({ error: "Not configured" }, { status: 503 });
  }

  const res = await fetch(`${baseUrl}/api/analyst/profiles`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
