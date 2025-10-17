import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { NextResponse } from "next/server";

// ==== Schema cho Generate Email ====
const GenerateEmailRequestSchema = z.object({
  purpose: z.string(), // mục đích email (complaint, inquiry, request, etc.)
  tone: z.enum(["formal", "semi-formal", "friendly", "urgent"]),
  recipient: z.string(), // người nhận (boss, colleague, customer service, etc.)
  mainPoints: z.array(z.string()), // các điểm chính cần đề cập
  context: z.string().optional(), // bối cảnh bổ sung
  length: z.enum(["short", "medium", "long"]).default("medium"),
});

const GenerateEmailResponseSchema = z.object({
  subject: z.string(),
  body: z.string(),
  keyPhrases: z.array(z.string()),
  suggestions: z.array(z.string()),
  toneAnalysis: z.string(),
});

// ==== API Route ====
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = GenerateEmailRequestSchema.parse(body);

    const genAI = new GoogleGenerativeAI(
      process.env.GOOGLE_GENERATIVE_AI_API_KEY!
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite-preview-06-17",
      generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json",
      },
    });

    const prompt = `
    Bạn là một **chuyên gia viết email tiếng Anh chuyên nghiệp** cho học viên TOEIC.
    
    Nhiệm vụ: **Tạo một email hoàn chình bằng tiếng Anh** dựa trên yêu cầu sau:
    
    **Thông tin đầu vào:**
    - Mục đích: ${parsed.purpose}
    - Tone: ${parsed.tone}
    - Người nhận: ${parsed.recipient}
    - Các điểm chính: ${parsed.mainPoints.join(", ")}
    - Bối cảnh: ${parsed.context || "Không có"}
    - Độ dài: ${parsed.length}
    
    **Yêu cầu:**
    1. **Subject line**: Ngắn gọn, rõ ràng, phù hợp với mục đích
    2. **Email body**: Cấu trúc chuẩn (greeting, body paragraphs, closing)
    3. **Key phrases**: Các cụm từ quan trọng được sử dụng (để học viên học hỏi)
    4. **Suggestions**: Gợi ý cải thiện hoặc biến thể khác
    5. **Tone analysis**: Phân tích tone và style đã sử dụng
    
    **Lưu ý:**
    - Email phải tự nhiên, không cứng nhắc
    - Phù hợp với văn hóa giao tiếp quốc tế
    - Sử dụng từ vựng và cấu trúc phù hợp với trình độ TOEIC
    - Độ dài ${
      parsed.length === "short"
        ? "100-150 từ"
        : parsed.length === "medium"
        ? "150-250 từ"
        : "250-350 từ"
    }
    
    Trả về JSON theo cấu trúc:
    {
      "subject": "string",
      "body": "string",
      "keyPhrases": ["string"],
      "suggestions": ["string"],
      "toneAnalysis": "string"
    }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Validate AI output
    const parsedOutput = GenerateEmailResponseSchema.safeParse(
      JSON.parse(text)
    );
    if (!parsedOutput.success) {
      console.error("Invalid AI output:", text);
      return NextResponse.json({ error: "Invalid AI output" }, { status: 500 });
    }

    return NextResponse.json(parsedOutput.data);
  } catch (err: any) {
    console.error("Email generation failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
