import { NextRequest, NextResponse } from "next/server";

type FoursquareResult = {
  fsq_id?: string;
  fsq_place_id?: string;
  name?: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
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
  const lat = Number(request.nextUrl.searchParams.get("lat") || "");
  const lng = Number(request.nextUrl.searchParams.get("lng") || "");

  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng);
  const strict = request.nextUrl.searchParams.get("strict") !== "0";

  const url = new URL("https://places-api.foursquare.com/places/search");
  url.searchParams.set("query", query);
  url.searchParams.set("limit", String(limit));
  if (hasCoords) {
    url.searchParams.set("ll", `${lat},${lng}`);
    // tighter radius so results are truly nearby
    url.searchParams.set("radius", strict ? "15000" : "50000");
    url.searchParams.set("sort", "DISTANCE");
  } else {
    url.searchParams.set("near", "Indonesia");
  }

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

  // Hanya tampilkan data di Indonesia (abaikan cafe, hotel, wisata, transportasi dari luar negeri)
  const isInIndonesia = (r: FoursquareResult) => {
    const country = (r.location?.country ?? "").toLowerCase();
    return country === "indonesia" || country === "id";
  };

  const places = rows
    .filter((r) => r.name && isInIndonesia(r))
    .map((r) => ({
      fsq_id: r.fsq_id ?? r.fsq_place_id,
      name: r.name as string,
      location:
        r.location?.formatted_address ||
        [r.location?.locality, r.location?.region, r.location?.country].filter(Boolean).join(", "),
      lat: r.latitude ?? r.geocodes?.main?.latitude ?? null,
      lng: r.longitude ?? r.geocodes?.main?.longitude ?? null,
      distance_m: typeof r.distance === "number" ? r.distance : null,
    }))
    .filter((p) => !hasCoords || (typeof p.lat === "number" && typeof p.lng === "number"))
    .sort((a, b) => (a.distance_m ?? Number.POSITIVE_INFINITY) - (b.distance_m ?? Number.POSITIVE_INFINITY));

  return NextResponse.json({
    country: "ID",
    query,
    count: places.length,
    places,
  });
}
