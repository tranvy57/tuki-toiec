import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { NextResponse } from "next/server";

// ==== Schema thống nhất ====
const EvaluateWritingRequestSchema = z.object({
  type: z.enum(["email", "opinion-essay"]), // loại bài viết
  content: z.string(), // nội dung bài viết

  // Metadata chung
  title: z.string().optional(), // tiêu đề/subject
  topic: z.string().optional(), // chủ đề/mục đích
  context: z.string().optional(), // ngữ cảnh (đối tượng nhận, loại essay, etc.)
  requiredLength: z.number().optional(), // số từ yêu cầu
  timeLimit: z.number().optional(), // thời gian giới hạn (phút)
});

// Schema response thống nhất
const EvaluateWritingResponseSchema = z.object({
  type: z.enum(["email", "opinion-essay"]),
  overallScore: z.number(), // điểm tổng (0-100)

  // Tiêu chí đánh giá chung (0-100)
  breakdown: z.object({
    content: z.number(), // nội dung/task response
    structure: z.number(), // cấu trúc/coherence
    vocabulary: z.number(), // từ vựng
    grammar: z.number(), // ngữ pháp
    style: z.number(), // phong cách/tone
    effectiveness: z.number(), // hiệu quả/professionalism
  }),

  // Phân tích chi tiết
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),

  // Lỗi ngữ pháp
  grammarErrors: z.array(
    z.object({
      type: z.string(),
      error: z.string(),
      correction: z.string(),
      explanation: z.string(),
    })
  ),

  // Phản hồi từ vựng
  vocabularyFeedback: z.object({
    range: z.number(), // đa dạng (0-100)
    accuracy: z.number(), // chính xác (0-100)
    appropriateness: z.number(), // phù hợp (0-100)
    improvements: z.array(
      z.object({
        original: z.string(),
        suggested: z.string(),
        reason: z.string(),
      })
    ),
  }),

  // Phân tích cấu trúc
  structureAnalysis: z.object({
    organization: z.number(), // tổ chức (0-100)
    flow: z.number(), // mạch lạc (0-100)
    transitions: z.number(), // liên kết (0-100)
    feedback: z.string(),
  }),

  // Gợi ý cải thiện
  improvementSuggestions: z.array(z.string()),
  rewrittenVersion: z.string().optional(),
  estimatedTOEICScore: z.number(), // điểm ước tính TOEIC (0-200)
});

// ==== API Route ====
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = EvaluateWritingRequestSchema.parse(body);

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

    let prompt = "";

    if (parsed.type === "email") {
      prompt = `
      Bạn là một **giáo viên tiếng Anh chuyên nghiệp** chuyên đánh giá kỹ năng viết email.
      
      Nhiệm vụ: **Đánh giá chi tiết email tiếng Anh** dưới đây theo tiêu chuẩn TOEIC Writing.
      
      **Email cần đánh giá:**
      ${parsed.title ? `Subject: ${parsed.title}` : ""}
      Body: ${parsed.content}
      ${parsed.topic ? `Mục đích: ${parsed.topic}` : ""}
      ${parsed.context ? `Ngữ cảnh: ${parsed.context}` : ""}
      ${parsed.requiredLength ? `Số từ yêu cầu: ${parsed.requiredLength}` : ""}
      
      **Tiêu chí đánh giá chung (thang điểm 0-100):**
      1. **Content**: Nội dung phù hợp với mục đích và yêu cầu
      2. **Structure**: Cấu trúc tổ chức ý tưởng rõ ràng
      3. **Vocabulary**: Từ vựng phong phú, chính xác, phù hợp
      4. **Grammar**: Ngữ pháp chính xác, đa dạng cấu trúc
      5. **Style**: Phong cách và tone phù hợp với ngữ cảnh
      6. **Effectiveness**: Hiệu quả truyền đạt và tính chuyên nghiệp
      `;
    } else {
      prompt = `
      Bạn là một **giáo viên tiếng Anh chuyên nghiệp** có kinh nghiệm đánh giá TOEIC Writing và IELTS Writing.
      
      Nhiệm vụ: **Đánh giá chi tiết bài viết nêu quan điểm** theo tiêu chuẩn TOEIC Writing Task 2.
      
      **Bài viết cần đánh giá:**
      ${parsed.title ? `Tiêu đề: ${parsed.title}` : ""}
      ${parsed.topic ? `Chủ đề: ${parsed.topic}` : ""}
      ${parsed.context ? `Loại bài: ${parsed.context}` : ""}
      ${parsed.requiredLength ? `Số từ yêu cầu: ${parsed.requiredLength}` : ""}
      
      Nội dung bài viết:
      ${parsed.content}
      
      **Tiêu chí đánh giá chung (thang điểm 0-100):**
      1. **Content**: Phản hồi đề bài đầy đủ, phát triển ý tưởng sâu sắc
      2. **Structure**: Tính mạch lạc, liên kết và tổ chức ý tưởng
      3. **Vocabulary**: Từ vựng đa dạng, chính xác và tinh tế
      4. **Grammar**: Ngữ pháp chính xác và đa dạng cấu trúc
      5. **Style**: Phong cách viết phù hợp với thể loại
      6. **Effectiveness**: Tính thuyết phục và hiệu quả lập luận
      `;
    }

    prompt += `
    
    **Yêu cầu phản hồi:**
    - Đánh giá khách quan, công bằng
    - Phản hồi xây dựng và khích lệ
    - Cung cấp ví dụ cải thiện cụ thể
    - Ước tính điểm TOEIC Writing (scale 0-200)
    
    Trả về JSON theo cấu trúc:
    {
      "type": "${parsed.type}",
      "overallScore": number,
      "breakdown": {
        "content": number,
        "structure": number,
        "vocabulary": number,
        "grammar": number,
        "style": number,
        "effectiveness": number
      },
      "strengths": ["string"],
      "weaknesses": ["string"],
      "grammarErrors": [
        {
          "type": "string",
          "error": "string",
          "correction": "string",
          "explanation": "string"
        }
      ],
      "vocabularyFeedback": {
        "range": number,
        "accuracy": number,
        "appropriateness": number,
        "improvements": [
          {
            "original": "string",
            "suggested": "string",
            "reason": "string"
          }
        ]
      },
      "structureAnalysis": {
        "organization": number,
        "flow": number,
        "transitions": number,
        "feedback": "string"
      },
      "improvementSuggestions": ["string"],
      "rewrittenVersion": "string (optional)",
      "estimatedTOEICScore": number
    }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Validate AI output
    const parsedOutput = EvaluateWritingResponseSchema.safeParse(
      JSON.parse(text)
    );
    if (!parsedOutput.success) {
      console.error("Invalid AI output:", text);
      console.error("Validation errors:", parsedOutput.error);
      return NextResponse.json({ error: "Invalid AI output" }, { status: 500 });
    }

    return NextResponse.json(parsedOutput.data);
  } catch (err: any) {
    console.error("Writing evaluation failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
