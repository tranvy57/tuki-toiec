import { z } from "zod";
import { NextResponse } from "next/server";
import { ResultTestResponseSchema } from "@/types";

// ==== Schema (tối giản cho ví dụ, bạn có thể import lại từ schema chính) ====

const AiResultSchema = z.object({
  summary: z.object({
    totalScore: z.number().optional(),
    listeningScore: z.number().optional(),
    readingScore: z.number().optional(),
    accuracy: z.string().optional(),
    comment: z.string().optional(),
  }),
  weakSkills: z.array(z.string()).optional(),
  mistakePatterns: z.array(z.string()).optional(),
  recommendations: z.array(z.string()).optional(),
});

// ==== API Route ====
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = ResultTestResponseSchema.parse(body);

    // Get user_id from session/auth if available
    // TODO: Replace with actual auth logic
    const user_id = (req.headers.get("x-user-id") || undefined) as string | undefined;

    // Call AI backend service
    const aiBackendUrl = process.env.NEXT_PUBLIC_AI_BACKEND_URL || "http://localhost:1210";
    const response = await fetch(`${aiBackendUrl}/api/analyze-test`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        test_data: parsed,
        user_id: user_id,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("AI backend error:", error);
      return NextResponse.json(
        { error: error.detail || "AI analysis failed" },
        { status: response.status }
      );
    }

    const result = await response.json();

    // Validate response
    const parsedOutput = AiResultSchema.safeParse(result);
    if (!parsedOutput.success) {
      console.error("Invalid AI output:", result);
      return NextResponse.json({ error: "Invalid AI output" }, { status: 500 });
    }

    return NextResponse.json(parsedOutput.data);
  } catch (err: any) {
    console.error("AI analysis failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
