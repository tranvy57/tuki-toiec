import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { NextResponse } from "next/server";

// ==== Schema cho Evaluate Opinion Essay ====
const EvaluateOpinionEssayRequestSchema = z.object({
  essay: z.string(), // bài viết nêu quan điểm
  topic: z.string(), // chủ đề của bài viết
  requiredLength: z.number().optional(), // số từ yêu cầu
  timeLimit: z.number().optional(), // thời gian giới hạn (phút)
  essayType: z
    .enum([
      "agree-disagree",
      "opinion",
      "problem-solution",
      "advantages-disadvantages",
    ])
    .default("opinion"),
});

const EvaluateOpinionEssayResponseSchema = z.object({
  overallScore: z.number(), // điểm tổng (0-100)
  breakdown: z.object({
    taskResponse: z.number(), // phản hồi đề bài (0-100)
    coherenceCohesion: z.number(), // tính mạch lạc và liên kết (0-100)
    lexicalResource: z.number(), // từ vựng (0-100)
    grammaticalRange: z.number(), // đa dạng ngữ pháp (0-100)
    grammaticalAccuracy: z.number(), // độ chính xác ngữ pháp (0-100)
    ideaDevelopment: z.number(), // phát triển ý tưởng (0-100)
  }),
  strengths: z.array(z.string()), // điểm mạnh
  weaknesses: z.array(z.string()), // điểm yếu
  structureAnalysis: z.object({
    introduction: z.object({
      score: z.number(),
      feedback: z.string(),
    }),
    bodyParagraphs: z.array(
      z.object({
        paragraph: z.number(),
        score: z.number(),
        feedback: z.string(),
        mainIdea: z.string(),
        supportingDetails: z.array(z.string()),
      })
    ),
    conclusion: z.object({
      score: z.number(),
      feedback: z.string(),
    }),
  }),
  vocabularyAnalysis: z.object({
    range: z.number(), // đa dạng từ vựng (0-100)
    accuracy: z.number(), // chính xác từ vựng (0-100)
    sophistication: z.number(), // mức độ tinh tế (0-100)
    improvements: z.array(
      z.object({
        original: z.string(),
        suggested: z.string(),
        reason: z.string(),
      })
    ),
  }),
  grammarAnalysis: z.object({
    errors: z.array(
      z.object({
        type: z.string(), // loại lỗi
        error: z.string(),
        correction: z.string(),
        explanation: z.string(),
      })
    ),
    sentenceVariety: z.number(), // đa dạng câu (0-100)
    complexity: z.number(), // độ phức tạp (0-100)
  }),
  argumentAnalysis: z.object({
    clarity: z.number(), // độ rõ ràng lập luận (0-100)
    logic: z.number(), // tính logic (0-100)
    support: z.number(), // bằng chứng hỗ trợ (0-100)
    counterarguments: z.boolean(), // có xem xét quan điểm đối lập không
  }),
  improvementSuggestions: z.array(z.string()),
  sampleImprovedParagraph: z.string().optional(),
  estimatedTOEICWritingScore: z.number(), // điểm ước tính theo TOEIC Writing (0-200)
});

// ==== API Route ====
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = EvaluateOpinionEssayRequestSchema.parse(body);

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
    Bạn là một **giáo viên tiếng Anh chuyên nghiệp** có kinh nghiệm đánh giá TOEIC Writing và IELTS Writing.
    
    Nhiệm vụ: **Đánh giá chi tiết bài viết nêu quan điểm** theo tiêu chuẩn TOEIC Writing Task 2.
    
    **Bài viết cần đánh giá:**
    Chủ đề: ${parsed.topic}
    Loại bài: ${parsed.essayType}
    ${parsed.requiredLength ? `Số từ yêu cầu: ${parsed.requiredLength}` : ""}
    ${parsed.timeLimit ? `Thời gian: ${parsed.timeLimit} phút` : ""}
    
    Nội dung bài viết:
    ${parsed.essay}
    
    **Tiêu chí đánh giá chính (thang điểm 0-100):**
    1. **Task Response**: Phản hồi đề bài đầy đủ, rõ ràng
    2. **Coherence & Cohesion**: Tính mạch lạc và liên kết
    3. **Lexical Resource**: Từ vựng đa dạng và chính xác
    4. **Grammatical Range**: Đa dạng cấu trúc ngữ pháp
    5. **Grammatical Accuracy**: Độ chính xác ngữ pháp
    6. **Idea Development**: Phát triển ý tưởng sâu sắc
    
    **Phân tích chi tiết theo cấu trúc:**
    - **Introduction**: Có hook? Thesis statement rõ ràng? Outline preview?
    - **Body Paragraphs**: Topic sentence, supporting details, examples, analysis
    - **Conclusion**: Tóm tắt và khẳng định lại quan điểm
    
    **Phân tích từ vựng:**
    - Đánh giá range (đa dạng), accuracy (chính xác), sophistication (tinh tế)
    - Chỉ ra từ vựng tốt và cần cải thiện
    
    **Phân tích ngữ pháp:**
    - Phân loại lỗi: subject-verb agreement, tenses, articles, prepositions, etc.
    - Đánh giá sentence variety và complexity
    
    **Phân tích lập luận:**
    - Clarity: Quan điểm có rõ ràng?
    - Logic: Lập luận có logic?
    - Support: Có bằng chứng/ví dụ hỗ trợ?
    - Counterarguments: Có xem xét quan điểm đối lập?
    
    **Đặc biệt lưu ý cho từng loại bài:**
    - **Agree-Disagree**: Cần có quan điểm rõ ràng
    - **Opinion**: Cần nêu và bảo vệ quan điểm cá nhân
    - **Problem-Solution**: Cần xác định vấn đề và đề xuất giải pháp
    - **Advantages-Disadvantages**: Cần cân nhắc cả hai mặt
    
    **Yêu cầu phản hồi:**
    - Đánh giá khách quan, công bằng
    - Phản hồi xây dựng và khích lệ
    - Cung cấp ví dụ cải thiện cụ thể
    - Ước tính điểm TOEIC Writing (scale 0-200)
    
    Trả về JSON theo cấu trúc:
    {
      "overallScore": number,
      "breakdown": {
        "taskResponse": number,
        "coherenceCohesion": number,
        "lexicalResource": number,
        "grammaticalRange": number,
        "grammaticalAccuracy": number,
        "ideaDevelopment": number
      },
      "strengths": ["string"],
      "weaknesses": ["string"],
      "structureAnalysis": {
        "introduction": {
          "score": number,
          "feedback": "string"
        },
        "bodyParagraphs": [
          {
            "paragraph": number,
            "score": number,
            "feedback": "string",
            "mainIdea": "string",
            "supportingDetails": ["string"]
          }
        ],
        "conclusion": {
          "score": number,
          "feedback": "string"
        }
      },
      "vocabularyAnalysis": {
        "range": number,
        "accuracy": number,
        "sophistication": number,
        "improvements": [
          {
            "original": "string",
            "suggested": "string",
            "reason": "string"
          }
        ]
      },
      "grammarAnalysis": {
        "errors": [
          {
            "type": "string",
            "error": "string",
            "correction": "string",
            "explanation": "string"
          }
        ],
        "sentenceVariety": number,
        "complexity": number
      },
      "argumentAnalysis": {
        "clarity": number,
        "logic": number,
        "support": number,
        "counterarguments": boolean
      },
      "improvementSuggestions": ["string"],
      "sampleImprovedParagraph": "string",
      "estimatedTOEICWritingScore": number
    }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Validate AI output
    const parsedOutput = EvaluateOpinionEssayResponseSchema.safeParse(
      JSON.parse(text)
    );
    if (!parsedOutput.success) {
      console.error("Invalid AI output:", text);
      return NextResponse.json({ error: "Invalid AI output" }, { status: 500 });
    }

    return NextResponse.json(parsedOutput.data);
  } catch (err: any) {
    console.error("Opinion essay evaluation failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
