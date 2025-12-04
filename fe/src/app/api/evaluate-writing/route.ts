import { z } from "zod";
import { NextResponse } from "next/server";

const EvaluateWritingRequestSchema = z.object({
  type: z.enum(["email-response", "opinion-essay", "describe-picture"]),
  content: z.string(),

  title: z.string().optional(), 
  sampleAnswer: z.string().optional(),
  topic: z.string().optional(), 
  context: z.string().optional(), 
  requiredLength: z.number().optional(), 
  timeLimit: z.number().optional(), 
});

const EvaluateWritingResponseSchema = z.object({
  type: z.enum(["email-response", "opinion-essay", "describe-picture"]),
  overallScore: z.number(),

  breakdown: z.object({
    content: z.number(),
    structure: z.number(),
    vocabulary: z.number(),
    grammar: z.number(),
    style: z.number(),
    effectiveness: z.number(),
  }),

  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),

  grammarErrors: z.array(
    z.object({
      type: z.string(),
      error: z.string(),
      correction: z.string(),
      explanation: z.string(),
    })
  ),

  vocabularyFeedback: z.object({
    range: z.number(),
    accuracy: z.number(),
    appropriateness: z.number(),
    improvements: z.array(
      z.object({
        original: z.string(),
        suggested: z.string(),
        reason: z.string(),
      })
    ),
  }),

  structureAnalysis: z.object({
    organization: z.number(),
    flow: z.number(),
    transitions: z.number(),
    feedback: z.string(),
  }),

  improvementSuggestions: z.array(z.string()),
  rewrittenVersion: z.string().optional(),
  estimatedTOEICScore: z.number(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = EvaluateWritingRequestSchema.parse(body);

    // Get user_id from session/auth if available
    // TODO: Replace with actual auth logic
    const user_id = (req.headers.get("x-user-id") || undefined) as string | undefined;

    // Call AI backend service
    const aiBackendUrl = process.env.AI_BACKEND_URL || "http://localhost:1210";
    const response = await fetch(`${aiBackendUrl}/api/evaluate-writing`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: parsed.type,
        content: parsed.content,
        title: parsed.title,
        sampleAnswer: parsed.sampleAnswer,
        topic: parsed.topic,
        context: parsed.context,
        requiredLength: parsed.requiredLength,
        timeLimit: parsed.timeLimit,
        user_id: user_id,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("AI backend error:", error);
      return NextResponse.json(
        { error: error.detail || "Writing evaluation failed" },
        { status: response.status }
      );
    }

    const result = await response.json();

    // Validate AI output
    const parsedOutput = EvaluateWritingResponseSchema.safeParse(result);
    if (!parsedOutput.success) {
      console.error("Invalid AI output:", result);
      console.error("Validation errors:", parsedOutput.error);
      return NextResponse.json({ error: "Invalid AI output" }, { status: 500 });
    }

    return NextResponse.json(parsedOutput.data);
  } catch (err: any) {
    console.error("Writing evaluation failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
