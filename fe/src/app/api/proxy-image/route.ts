import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get("url");
    if (!url) {
      return NextResponse.json(
        { error: "Missing URL parameter" },
        { status: 400 }
      );
    }

    const res = await fetch(url, {
      headers: { Referer: "https://study4.com" },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: res.status }
      );
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await res.arrayBuffer();

    return new NextResponse(Buffer.from(arrayBuffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400", // cache 1 ngày
      },
    });
  } catch (err: any) {
    console.error("Proxy image error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
