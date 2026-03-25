export async function GET() {
  const baseUrl = process.env.COPILOT_SERVICES_URL;
  if (!baseUrl) {
    return Response.json({ error: "Not configured" }, { status: 503 });
  }

  const res = await fetch(`${baseUrl}/api/analyst/profiles`);
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
