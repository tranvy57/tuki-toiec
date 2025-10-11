import { GoogleGenerativeAI } from "@google/generative-ai";
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

    const genAI = new GoogleGenerativeAI(
      process.env.GOOGLE_GENERATIVE_AI_API_KEY!
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite-preview-06-17",
      generationConfig: {
        temperature: 0.4,
        responseMimeType: "application/json",
      },
    });

   const prompt = `
    Bạn là một **chuyên gia TOEIC và trợ lý học tập thông minh**. 
    Nhiệm vụ của bạn là **phân tích kết quả làm bài TOEIC của người học** bên dưới và **trả về phản hồi bằng JSON, viết hoàn toàn bằng tiếng Việt**.

    Cấu trúc của bài thi TOEIC gồm hai phần (điểm tối đa 990): Listening (điểm tối đa 495) và Reading (điểm tối đa 495).

    Phân tích của bạn cần:
    - Đánh giá điểm mạnh, điểm yếu của người học theo từng kỹ năng (Listening, Reading, và kỹ năng con).
    - Phát hiện các mẫu lỗi thường gặp (ví dụ: ngữ pháp, từ vựng, suy luận, nghe nhầm từ khóa...).
    - Giải thích ngắn gọn nhưng sâu sắc, giúp người học hiểu nguyên nhân sai.
    - Đưa ra các gợi ý học tập cụ thể (như “luyện Part 3 - hội thoại có 3 người nói”, hoặc “ôn lại cấu trúc giới từ chỉ nguyên nhân”).
    
    Kết quả trả về phải đúng cấu trúc sau:
    totalScore: number, // tổng điểm (0-990)
    listeningScore: number, // điểm Listening (0-495)
    readingScore: number, // điểm Reading (0-495)
    accuracy: string, // độ chính xác chung (%)
    comment: string, // nhận xét tổng quan về bài thi

    {
      "summary": {
        "totalScore": number,
        "listeningScore": number,
        "readingScore": number,
        "accuracy": string,
        "comment": string // tổng kết cảm nhận của người học
      },
      "weakSkills": [string], // liệt kê kỹ năng yếu
      "mistakePatterns": [string], // mô tả dạng lỗi phổ biến
      "recommendations": [string] // gợi ý học tập cụ thể, rõ ràng
    }

    Hãy viết phản hồi bằng **tiếng Việt tự nhiên, thân thiện, khích lệ người học**, không dùng thuật ngữ quá hàn lâm.

    Dữ liệu cần phân tích:
    ${JSON.stringify(parsed, null, 2)}
    `;



    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Validate Gemini output
    const parsedOutput = AiResultSchema.safeParse(JSON.parse(text));
    if (!parsedOutput.success) {
      console.error("Invalid AI output:", text);
      return NextResponse.json({ error: "Invalid AI output" }, { status: 500 });
    }

    return NextResponse.json(parsedOutput.data);
  } catch (err: any) {
    console.error("AI analysis failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
