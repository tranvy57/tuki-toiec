import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const raw = req.nextUrl.searchParams.get("url");
    if (!raw) {
      return NextResponse.json({ error: "Missing ?url=" }, { status: 400 });
    }

    const decodedUrl = decodeURIComponent(raw);

    // Chỉ cho phép domain Study4
    if (
      !decodedUrl.startsWith("https://study4.com") &&
      !decodedUrl.startsWith("https://www.study4.com")
    ) {
      return NextResponse.json({ error: "Blocked source" }, { status: 403 });
    }

    // Fetch lại ảnh, giả lập trình duyệt thật
    const response = await fetch(decodedUrl, {
      headers: {
        Referer: "https://www.study4.com/",
        Origin: "https://www.study4.com",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,vi;q=0.8",
        "Sec-Fetch-Dest": "image",
        "Sec-Fetch-Mode": "no-cors",
        "Sec-Fetch-Site": "cross-site",
      },
    });

    if (!response.ok) {
      console.error("❌ Fetch failed", response.status, decodedUrl);
      return NextResponse.json(
        { error: "Upstream rejected", status: response.status },
        { status: response.status }
      );
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get("content-type") || "image/jpeg";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
