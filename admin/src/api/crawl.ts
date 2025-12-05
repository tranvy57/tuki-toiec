// Crawl API for Study4.com test imports

export interface CrawlTestRequest {
    url: string;
    title?: string;
    cookies?: Record<string, string>;
    headers?: Record<string, string>;
}

export interface PipelineStep {
    key: string;
    title: string;
    description: string;
    durationMs: number;
    status: "pending" | "processing" | "completed" | "error";
    entities?: {
        tests?: number;
        parts?: number;
        groups?: number;
        questions?: number;
        answers?: number;
        skills?: number;
        questionTags?: number;
    };
}

export interface PartStat {
    part: number;
    questions: number;
    groups: number;
    difficulty: "easy" | "medium" | "hard";
}

export interface SkillStat {
    name: string;
    questions: number;
    confidence: number;
}

export interface CrawlMetadata {
    parts: number;
    groups: number;
    audioTracks: number;
    vocabularyTags: number;
    skillsDetected: number;
    totalAnswers: number;
    avgDifficulty: string;
    partStats: PartStat[];
    skillStats: SkillStat[];
}

export interface ResourceUsage {
    requests: number;
    bandwidthMb: number;
    cloudinaryUploads: number;
    cookiesValidUntil?: string;
}

export interface CrawlTestResponse {
    id: string;
    url: string;
    title: string;
    status: "pending" | "processing" | "completed" | "error";
    progress: number;
    questionsFound: number;
    error?: string;
    createdAt: string;
    metadata?: CrawlMetadata;
    pipeline?: PipelineStep[];
    resources?: ResourceUsage;
    logs?: string[];
}

// Get AI service base URL from environment or use default
const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || "http://localhost:8000";

export const crawlApi = {
    /**
     * Crawl a TOEIC test from Study4.com
     */
    crawlTest: async (request: CrawlTestRequest): Promise<CrawlTestResponse> => {
        const response = await fetch(`${AI_SERVICE_URL}/api/crawl/test`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    },
};
