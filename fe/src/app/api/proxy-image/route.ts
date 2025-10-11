// src/app/api/proxy-image/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const rawUrl = req.nextUrl.searchParams.get("url");
    if (!rawUrl) {
      return NextResponse.json(
        { error: "Missing URL parameter" },
        { status: 400 }
      );
    }

    // Decode để lấy URL thật
    const decodedUrl = decodeURIComponent(rawUrl);

    // Chỉ cho phép ảnh từ study4
    if (
      !decodedUrl.startsWith("https://study4.com") &&
      !decodedUrl.startsWith("https://www.study4.com")
    ) {
      return NextResponse.json({ error: "Invalid source" }, { status: 403 });
    }

    // Gửi header Referer để vượt qua hotlink block
    const response = await fetch(decodedUrl, {
      headers: {
        Referer: "https://study4.com",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      console.error("Fetch failed", response.status, decodedUrl);
      return NextResponse.json(
        { error: "Upstream fetch failed" },
        { status: response.status }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";

    return new NextResponse(Buffer.from(arrayBuffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err) {
    console.error("Proxy image error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
