import { GoogleGenerativeAI } from "@google/generative-ai";
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

    const genAI = new GoogleGenerativeAI(
      process.env.GOOGLE_GENERATIVE_AI_API_KEY!
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      generationConfig: {
        temperature: 0.3,
        responseMimeType: "application/json",
      },
    });

    let prompt = "";

    if (parsed.type === "email-response") {
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
    } else if (parsed.type === "opinion-essay") {
        prompt = `
    Bạn là một **giáo viên tiếng Anh chuyên nghiệp** có kinh nghiệm đánh giá TOEIC Writing và IELTS Writing.

    Nhiệm vụ: **Đánh giá chi tiết bài viết nêu quan điểm** theo tiêu chuẩn TOEIC Writing Task 2.

    **Bài viết cần đánh giá:**
    ${parsed.title ? `Tiêu đề: ${parsed.title}` : ""}
    ${parsed.topic ? `Chủ đề: ${parsed.topic}` : ""}
    ${parsed.context ? `Ngữ cảnh/Loại bài: ${parsed.context}` : ""}
    ${parsed.requiredLength ? `Số từ yêu cầu: ${parsed.requiredLength}` : ""}

    **Nội dung bài viết:**
    ${parsed.content}

    **Tiêu chí đánh giá chung (thang điểm 0–100):**
    1. **Content**: Bài viết phản hồi đầy đủ và chính xác theo **ngữ cảnh được đưa ra**, thể hiện quan điểm rõ ràng, phát triển ý tưởng phù hợp với chủ đề và mục đích giao tiếp (ví dụ: tình huống nơi làm việc, bài luận nêu ý kiến,...)
    2. **Structure**: Mạch lạc, có bố cục rõ ràng (mở bài – thân bài – kết luận), ý tưởng được kết nối logic và tự nhiên
    3. **Vocabulary**: Từ vựng đa dạng, chính xác, dùng đúng sắc thái và phù hợp với ngữ cảnh giao tiếp
    4. **Grammar**: Cấu trúc ngữ pháp chính xác, linh hoạt, ít lỗi, thể hiện khả năng sử dụng câu phức hoặc mệnh đề hợp lý
    5. **Style**: Giọng văn và cách diễn đạt phù hợp với thể loại bài (trang trọng, chuyên nghiệp, hoặc tự nhiên tùy đề yêu cầu)
    6. **Effectiveness**: Bài viết thể hiện lập luận hoặc quan điểm thuyết phục, có ví dụ hoặc lý do hợp lý, mang lại hiệu quả giao tiếp cao
    `;
;
    }
    else if (parsed.type === "describe-picture") {
    prompt = `
      Bạn là một **giáo viên tiếng Anh chuyên nghiệp** có kinh nghiệm đánh giá **TOEIC Writing Task 1 (mô tả tranh)** và IELTS Task 1 (miêu tả hình ảnh, biểu đồ).

      Nhiệm vụ: **Đánh giá chi tiết bài viết mô tả tranh** theo tiêu chuẩn TOEIC Writing Task 1.

      **Thông tin bài viết cần đánh giá:**
      ${parsed.title ? `Tiêu đề: ${parsed.title}` : ""}
      ${parsed.topic ? `Chủ đề: ${parsed.topic}` : ""}
      ${parsed.context ? `Loại bài: ${parsed.context}` : ""}
      ${parsed.requiredLength ? `Số từ yêu cầu: ${parsed.requiredLength}` : ""}
      ${parsed.sampleAnswer ? `Đáp án mẫu: ${parsed.sampleAnswer}` : ""}

      **Nội dung bài viết:**
      ${parsed.content}

      **Tiêu chí đánh giá chung (thang điểm 0–100):**
      1. **Content**: Mô tả được các chi tiết chính của bức tranh (người, hành động, bối cảnh, vật thể, vị trí, v.v.)
      2. **Organization**: Bài viết có bố cục rõ ràng, trình tự hợp lý (tổng thể → chi tiết → kết luận)
      3. **Vocabulary**: Sử dụng từ vựng đa dạng, chính xác để miêu tả hình ảnh và hành động
      4. **Grammar**: Dùng cấu trúc ngữ pháp chính xác, linh hoạt (đặc biệt là thì hiện tại tiếp diễn, giới từ vị trí, mệnh đề quan hệ)
      5. **Style**: Ngôn ngữ tự nhiên, phù hợp với văn phong miêu tả trong TOEIC
      6. **Clarity & Fluency**: Câu văn trôi chảy, dễ hiểu, không lặp ý hoặc gây mơ hồ

      Hãy đưa ra:
      - **Điểm tổng (0–100)**
      - **Nhận xét chi tiết cho từng tiêu chí**
      - **Đề xuất cải thiện ngắn gọn và thực tế cho người học**
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
