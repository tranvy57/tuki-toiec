import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { NextResponse } from "next/server";

// ==== Schema cho Evaluate Email ====
const EvaluateEmailRequestSchema = z.object({
  subject: z.string(),
  body: z.string(),
  purpose: z.string().optional(), // mục đích dự định
  targetRecipient: z.string().optional(), // đối tượng nhận
});

const EvaluateEmailResponseSchema = z.object({
  overallScore: z.number(), // điểm tổng (0-100)
  breakdown: z.object({
    clarity: z.number(), // độ rõ ràng (0-100)
    tone: z.number(), // phù hợp về tone (0-100)
    grammar: z.number(), // ngữ pháp (0-100)
    vocabulary: z.number(), // từ vựng (0-100)
    structure: z.number(), // cấu trúc (0-100)
    professionalism: z.number(), // tính chuyên nghiệp (0-100)
  }),
  strengths: z.array(z.string()), // điểm mạnh
  weaknesses: z.array(z.string()), // điểm yếu
  grammarErrors: z.array(
    z.object({
      error: z.string(),
      correction: z.string(),
      explanation: z.string(),
    })
  ),
  vocabularyFeedback: z.array(z.string()), // phản hồi từ vựng
  improvementSuggestions: z.array(z.string()), // gợi ý cải thiện
  rewrittenVersion: z.string().optional(), // phiên bản viết lại (nếu cần)
});

// ==== API Route ====
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = EvaluateEmailRequestSchema.parse(body);

    const genAI = new GoogleGenerativeAI(
      process.env.GOOGLE_GENERATIVE_AI_API_KEY!
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite-preview-06-17",
      generationConfig: {
        temperature: 0.3,
        responseMimeType: "application/json",
      },
    });

    const prompt = `
    Bạn là một **giáo viên tiếng Anh chuyên nghiệp** chuyên đánh giá kỹ năng viết email.
    
    Nhiệm vụ: **Đánh giá chi tiết email tiếng Anh** dưới đây theo tiêu chuẩn TOEIC Writing.
    
    **Email cần đánh giá:**
    Subject: ${parsed.subject}
    Body: ${parsed.body}
    ${parsed.purpose ? `Mục đích dự định: ${parsed.purpose}` : ""}
    ${parsed.targetRecipient ? `Đối tượng nhận: ${parsed.targetRecipient}` : ""}
    
    **Tiêu chí đánh giá (thang điểm 0-100):**
    1. **Clarity** (độ rõ ràng): Ý tưởng có được truyền đạt rõ ràng không?
    2. **Tone** (tone phù hợp): Tone có phù hợp với mục đích và đối tượng không?
    3. **Grammar** (ngữ pháp): Độ chính xác về ngữ pháp
    4. **Vocabulary** (từ vựng): Sự phong phú và chính xác của từ vựng
    5. **Structure** (cấu trúc): Tổ chức ý tưởng và layout email
    6. **Professionalism** (tính chuyên nghiệp): Mức độ chuyên nghiệp tổng thể
    
    **Yêu cầu phản hồi:**
    - Chỉ ra cụ thể các lỗi ngữ pháp (nếu có) và cách sửa
    - Đánh giá từ vựng: phù hợp, đa dạng, chính xác
    - Gợi ý cải thiện cụ thể và thực tế
    - Nếu email có nhiều lỗi, cung cấp phiên bản viết lại
    
    **Phong cách phản hồi:**
    - Xây dựng, không phê phán
    - Cụ thể, có ví dụ
    - Khích lệ người học
    - Tập trung vào cải thiện thực tế
    
    Trả về JSON theo cấu trúc:
    {
      "overallScore": number,
      "breakdown": {
        "clarity": number,
        "tone": number,
        "grammar": number,
        "vocabulary": number,
        "structure": number,
        "professionalism": number
      },
      "strengths": ["string"],
      "weaknesses": ["string"],
      "grammarErrors": [
        {
          "error": "string",
          "correction": "string", 
          "explanation": "string"
        }
      ],
      "vocabularyFeedback": ["string"],
      "improvementSuggestions": ["string"],
      "rewrittenVersion": "string (optional)"
    }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Validate AI output
    const parsedOutput = EvaluateEmailResponseSchema.safeParse(
      JSON.parse(text)
    );
    if (!parsedOutput.success) {
      console.error("Invalid AI output:", text);
      return NextResponse.json({ error: "Invalid AI output" }, { status: 500 });
    }

    return NextResponse.json(parsedOutput.data);
  } catch (err: any) {
    console.error("Email evaluation failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
