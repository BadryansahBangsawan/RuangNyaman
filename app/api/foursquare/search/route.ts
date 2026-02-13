import { NextRequest, NextResponse } from "next/server";

type FoursquareResult = {
  fsq_id?: string;
  name?: string;
  location?: {
    formatted_address?: string;
    locality?: string;
    region?: string;
    country?: string;
  };
  geocodes?: {
    main?: {
      latitude?: number;
      longitude?: number;
    };
  };
};

export async function GET(request: NextRequest) {
  const apiKey = process.env.FOURSQUARE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "FOURSQUARE_API_KEY is not set" },
      { status: 500 }
    );
  }

  const query = (request.nextUrl.searchParams.get("q") || "wisata").trim();
  const limit = Math.min(Number(request.nextUrl.searchParams.get("limit") || 20), 50);

  const url = new URL("https://places-api.foursquare.com/places/search");
  url.searchParams.set("query", query);
  url.searchParams.set("near", "Indonesia");
  url.searchParams.set("limit", String(limit));

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
      "X-Places-Api-Version": "2025-06-17",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text();
    return NextResponse.json(
      { error: "Foursquare request failed", status: res.status, detail },
      { status: 502 }
    );
  }

  const data = (await res.json()) as { results?: FoursquareResult[]; data?: FoursquareResult[] };
  const rows = data.results ?? data.data ?? [];

  const places = rows
    .filter((r) => r.name)
    .map((r) => ({
      fsq_id: r.fsq_id,
      name: r.name as string,
      location:
        r.location?.formatted_address ||
        [r.location?.locality, r.location?.region, r.location?.country].filter(Boolean).join(", "),
      lat: r.geocodes?.main?.latitude ?? null,
      lng: r.geocodes?.main?.longitude ?? null,
    }));

  return NextResponse.json({
    country: "ID",
    query,
    count: places.length,
    places,
  });
}
