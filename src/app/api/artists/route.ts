import { NextRequest } from "next/server";

const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const q = searchParams.get("q");
    const country = searchParams.get("country");
    const specialization = searchParams.get("specialization");

    const backendUrl = new URL("/api/artists/", BACKEND_BASE);
    backendUrl.searchParams.set("page", page);
    if (q) backendUrl.searchParams.set("q", q);
    if (country) backendUrl.searchParams.set("country", country);
    if (specialization) backendUrl.searchParams.set("specialization", specialization);

    // Backend should only return verified artists; if a flag exists, ensure it's set
    backendUrl.searchParams.set("verified", "true");

    const res = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Public endpoint; no credentials/cookies required
    });

    const data = await res.json();

    if (!res.ok) {
      return new Response(
        JSON.stringify({
          error: "Failed to fetch artists",
          status: res.status,
          details: data,
        }),
        { status: res.status, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: "Unexpected error", message: e?.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
