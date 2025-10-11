import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Lấy param url (Next.js tự encode trong _next/image)
    const rawUrl = req.nextUrl.searchParams.get("url");
    if (!rawUrl) {
      return NextResponse.json(
        { error: "Missing URL parameter" },
        { status: 400 }
      );
    }

    // Decode đúng 1 lần
    const decodedUrl = decodeURIComponent(rawUrl);

    // Kiểm tra nguồn hợp lệ (Study4)
    if (
      !decodedUrl.startsWith("https://study4.com") &&
      !decodedUrl.startsWith("https://www.study4.com")
    ) {
      return NextResponse.json({ error: "Invalid source" }, { status: 403 });
    }

    // Fetch ảnh, thêm header Referer để vượt hotlink block
    const res = await fetch(decodedUrl, {
      headers: { Referer: "https://study4.com" },
    });

    if (!res.ok) {
      console.error("Failed to fetch image:", decodedUrl, res.status);
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
