import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { NextResponse } from "next/server";

// ==== Schema cho Evaluate Image Description ====
const EvaluateImageDescriptionRequestSchema = z.object({
  description: z.string(), // mô tả hình ảnh của học viên
  imageUrl: z.string().optional(), // URL hình ảnh gốc (nếu có)
  expectedElements: z.array(z.string()).optional(), // các yếu tố mong đợi được mô tả
  descriptionType: z.enum(["basic", "detailed", "analytical"]).default("basic"),
});

const EvaluateImageDescriptionResponseSchema = z.object({
  overallScore: z.number(), // điểm tổng (0-100)
  breakdown: z.object({
    completeness: z.number(), // tính đầy đủ (0-100)
    accuracy: z.number(), // độ chính xác (0-100)
    vocabulary: z.number(), // từ vựng (0-100)
    grammar: z.number(), // ngữ pháp (0-100)
    organization: z.number(), // tổ chức ý tưởng (0-100)
    creativity: z.number(), // tính sáng tạo (0-100)
  }),
  strengths: z.array(z.string()), // điểm mạnh
  weaknesses: z.array(z.string()), // điểm yếu
  missingElements: z.array(z.string()), // yếu tố bị thiếu
  vocabularyFeedback: z.object({
    goodChoices: z.array(z.string()), // từ vựng tốt
    improvements: z.array(
      z.object({
        original: z.string(),
        suggested: z.string(),
        reason: z.string(),
      })
    ),
  }),
  grammarErrors: z.array(
    z.object({
      error: z.string(),
      correction: z.string(),
      explanation: z.string(),
    })
  ),
  improvementSuggestions: z.array(z.string()),
  sampleImprovedDescription: z.string(),
});

// ==== API Route ====
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = EvaluateImageDescriptionRequestSchema.parse(body);

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
    Bạn là một **giáo viên tiếng Anh chuyên nghiệp** chuyên đánh giá kỹ năng mô tả hình ảnh (TOEIC Speaking/Writing).
    
    Nhiệm vụ: **Đánh giá chi tiết khả năng mô tả hình ảnh** của học viên theo tiêu chuẩn TOEIC.
    
    **Bài mô tả cần đánh giá:**
    ${parsed.description}
    
    **Thông tin bổ sung:**
    ${parsed.imageUrl ? `URL hình ảnh: ${parsed.imageUrl}` : ""}
    ${
      parsed.expectedElements
        ? `Các yếu tố mong đợi: ${parsed.expectedElements.join(", ")}`
        : ""
    }
    Loại mô tả: ${parsed.descriptionType}
    
    **Tiêu chí đánh giá (thang điểm 0-100):**
    1. **Completeness** (tính đầy đủ): Mô tả có bao quát đủ các yếu tố chính?
    2. **Accuracy** (độ chính xác): Thông tin mô tả có chính xác?
    3. **Vocabulary** (từ vựng): Phong phú, chính xác, phù hợp
    4. **Grammar** (ngữ pháp): Độ chính xác ngữ pháp
    5. **Organization** (tổ chức): Cách sắp xếp ý tưởng logic
    6. **Creativity** (sáng tạo): Cách diễn đạt sinh động, hấp dẫn
    
    **Yêu cầu đánh giá:**
    - Phân tích các yếu tố còn thiếu trong mô tả
    - Chỉ ra từ vựng tốt và những từ có thể cải thiện
    - Sửa lỗi ngữ pháp cụ thể với giải thích
    - Đưa ra mô tả mẫu cải thiện
    
    **Lưu ý cho từng loại mô tả:**
    - **Basic**: Tập trung vào việc nhận diện đối tượng, màu sắc, vị trí cơ bản
    - **Detailed**: Cần mô tả chi tiết hơn về cảm xúc, hoạt động, bối cảnh
    - **Analytical**: Yêu cầu phân tích ý nghĩa, ngụ ý, hoặc so sánh
    
    **Phong cách phản hồi:**
    - Khích lệ và xây dựng
    - Cụ thể với ví dụ rõ ràng
    - Tập trung vào cải thiện kỹ năng thực tế
    - Phù hợp với trình độ TOEIC
    
    Trả về JSON theo cấu trúc:
    {
      "overallScore": number,
      "breakdown": {
        "completeness": number,
        "accuracy": number,
        "vocabulary": number,
        "grammar": number,
        "organization": number,
        "creativity": number
      },
      "strengths": ["string"],
      "weaknesses": ["string"],
      "missingElements": ["string"],
      "vocabularyFeedback": {
        "goodChoices": ["string"],
        "improvements": [
          {
            "original": "string",
            "suggested": "string",
            "reason": "string"
          }
        ]
      },
      "grammarErrors": [
        {
          "error": "string",
          "correction": "string",
          "explanation": "string"
        }
      ],
      "improvementSuggestions": ["string"],
      "sampleImprovedDescription": "string"
    }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Validate AI output
    const parsedOutput = EvaluateImageDescriptionResponseSchema.safeParse(
      JSON.parse(text)
    );
    if (!parsedOutput.success) {
      console.error("Invalid AI output:", text);
      return NextResponse.json({ error: "Invalid AI output" }, { status: 500 });
    }

    return NextResponse.json(parsedOutput.data);
  } catch (err: any) {
    console.error("Image description evaluation failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
