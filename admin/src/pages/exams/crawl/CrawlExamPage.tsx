import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { crawlApi } from "@/api/crawl";
import {
  Download,
  Globe,
  FileText,
  AlertCircle,
  CheckCircle,
  ServerCog,
  Settings,
  AudioLines,
  ListChecks,
  Layers,
  BookText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface CrawlFormData {
  url: string;
  examTitle: string;
}

type CrawlStatus = "pending" | "processing" | "completed" | "error";

interface PipelineStep {
  key:
    | "fetch_test"
    | "fetch_audio"
    | "crawl_dom"
    | "parse_skills"
    | "cloudinary"
    | "persist_entities";
  title: string;
  description: string;
  durationMs: number;
  status: CrawlStatus;
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

interface ResourceUsage {
  requests: number;
  bandwidthMb: number;
  cloudinaryUploads: number;
  cookiesValidUntil?: string;
}

interface CrawlResult {
  id: string;
  url: string;
  title: string;
  status: CrawlStatus;
  progress: number;
  questionsFound: number;
  error?: string;
  createdAt: string;
  metadata?: CrawlMetadata;
  pipeline?: PipelineStep[];
  resources?: ResourceUsage;
  logs?: string[];
}

interface CrawlMetadata {
  parts: number;
  groups: number;
  audioTracks: number;
  vocabularyTags: number;
  skillsDetected: number;
  totalAnswers: number;
  avgDifficulty: string;
  partStats: {
    part: number;
    questions: number;
    groups: number;
    difficulty: "easy" | "medium" | "hard";
  }[];
  skillStats: {
    name: string;
    questions: number;
    confidence: number;
  }[];
}

const DEFAULT_COOKIES: Record<string, string> = {
  _tt_enable_cookie: "",
  _ttp: "",
  _ym_d: "",
  _ym_isad: "",
  _ym_uid: "",
  bh: "",
  cf_clearance: "",
  csrftoken: "",
  sessionid: "",
  ttcsid: "",
  ttcsid_COLIHEBC77U9C4QOD78G: "",
  ttcsid_CORPTQRC77UD072DBJ40: "",
};

const DEFAULT_HEADERS: Record<string, string> = {
  "User-Agent": "",
  Referer: "",
  "Accept-Language": "",
};

export default function CrawlExamPage() {
  const [crawlerMode, setCrawlerMode] = useState<"toeic" | "custom">("toeic");
  const [selectedResult, setSelectedResult] = useState<CrawlResult | null>(null);
  const [configOpen, setConfigOpen] = useState(false);
  const [crawlerConfig, setCrawlerConfig] = useState<{
    cookies: Record<string, string>;
    headers: Record<string, string>;
  }>({
    cookies: DEFAULT_COOKIES,
    headers: DEFAULT_HEADERS,
  });
  const [crawlResults, setCrawlResults] = useState<CrawlResult[]>([
    {
      id: "1",
      url: "https://study4.com/tests/226/new-economy-toeic-test-3/results/29527020/details/",
      title: "New Economy TOEIC - Test 03",
      status: "completed",
      progress: 100,
      questionsFound: 200,
      createdAt: "2024-01-15T10:30:00Z",
      resources: {
        requests: 62,
        bandwidthMb: 18.2,
        cloudinaryUploads: 17,
        cookiesValidUntil: "2024-01-16T03:00:00Z",
      },
      pipeline: [
        {
          key: "fetch_test",
          title: "Fetch test page",
          description: "GET HTML & parse DOM bằng BeautifulSoup",
          durationMs: 1800,
          status: "completed",
          entities: { tests: 1 },
        },
        {
          key: "fetch_audio",
          title: "Fetch audio & assets",
          description: "Gọi `fetch_audio_pages` + tải audio chính",
          durationMs: 2600,
          status: "completed",
        },
        {
          key: "crawl_dom",
          title: "Crawl DOM → Entities",
          description: "`crawl_to_entities`: Tests → Parts → Groups → Questions → Answers",
          durationMs: 5200,
          status: "completed",
          entities: { parts: 7, groups: 78, questions: 200, answers: 800 },
        },
        {
          key: "parse_skills",
          title: "Parse skills",
          description: "`parse_skills` + `create_skill_parts`",
          durationMs: 1600,
          status: "completed",
          entities: { skills: 16 },
        },
        {
          key: "cloudinary",
          title: "Upload assets",
          description: "`upload_image_to_cloudinary`",
          durationMs: 2400,
          status: "completed",
        },
        {
          key: "persist_entities",
          title: "Persist to DB",
          description: "`import_test` + commit transaction",
          durationMs: 900,
          status: "completed",
          entities: { questionTags: 140 },
        },
      ],
      logs: [
        "[10:30:11] Fetching test DOM...",
        "[10:30:14] Found 200 question blocks",
        "[10:30:17] Uploading images to Cloudinary...",
        "[10:30:21] Parsed 16 skills from overview tab",
        "[10:30:24] Persisted entities into Postgres",
      ],
      metadata: {
        parts: 7,
        groups: 78,
        audioTracks: 43,
        vocabularyTags: 128,
        skillsDetected: 16,
        totalAnswers: 800,
        avgDifficulty: "B1-B2",
        partStats: [
          { part: 1, questions: 6, groups: 6, difficulty: "medium" },
          { part: 2, questions: 25, groups: 25, difficulty: "medium" },
          { part: 3, questions: 39, groups: 13, difficulty: "hard" },
          { part: 4, questions: 30, groups: 10, difficulty: "hard" },
          { part: 5, questions: 30, groups: 30, difficulty: "medium" },
          { part: 6, questions: 16, groups: 4, difficulty: "medium" },
          { part: 7, questions: 54, groups: 10, difficulty: "hard" },
        ],
        skillStats: [
          { name: "Listening Inference", questions: 32, confidence: 0.9 },
          { name: "Listening Details", questions: 48, confidence: 0.84 },
          { name: "Reading Vocabulary", questions: 25, confidence: 0.88 },
          { name: "Reading Inference", questions: 22, confidence: 0.8 },
        ],
      },
    },
    {
      id: "2",
      url: "https://example.com/toeic-test-2",
      title: "TOEIC Sample Test 2024",
      status: "processing",
      progress: 65,
      questionsFound: 130,
      createdAt: "2024-01-15T11:15:00Z",
    },
    {
      id: "3",
      url: "https://example.com/toeic-test-3",
      title: "TOEIC Mock Test Series",
      status: "error",
      progress: 0,
      questionsFound: 0,
      error: "Không thể truy cập website",
      createdAt: "2024-01-15T09:45:00Z",
      logs: ["[09:45:10] Request blocked by CAPTCHA", "[09:45:12] Crawl aborted"],
    },
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CrawlFormData>();

  const configPairs = useMemo(
    () => ({
      cookies: Object.entries(crawlerConfig.cookies || {}),
      headers: Object.entries(crawlerConfig.headers || {}),
    }),
    [crawlerConfig],
  );

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: CrawlFormData) => {
    setIsLoading(true);
    
    const newCrawl: CrawlResult = {
      id: Date.now().toString(),
      url: data.url,
      title: data.examTitle || "Đề thi từ " + new URL(data.url).hostname,
      status: "processing",
      progress: 0,
      questionsFound: 0,
      createdAt: new Date().toISOString(),
    };

    setCrawlResults([newCrawl, ...crawlResults]);
    setSelectedResult(newCrawl);
    reset();

    try {
      // Call the real API
      const result = await crawlApi.crawlTest({
        url: data.url,
        title: data.examTitle,
        cookies: Object.fromEntries(
          configPairs.cookies.filter(([_, v]) => v)
        ),
        headers: Object.fromEntries(
          configPairs.headers.filter(([_, v]) => v)
        ),
      });

      // Update with real result
      setCrawlResults((prev) =>
        prev.map((item) =>
          item.id === newCrawl.id
            ? {
                ...item,
                id: result.id,
                status: result.status as CrawlStatus,
                progress: result.progress,
                questionsFound: result.questionsFound,
                error: result.error,
                metadata: result.metadata as CrawlMetadata | undefined,
                pipeline: result.pipeline as PipelineStep[] | undefined,
                resources: result.resources as ResourceUsage | undefined,
                logs: result.logs,
              }
            : item
        )
      );

      setSelectedResult((prev) =>
        prev && prev.id === newCrawl.id
          ? {
              ...prev,
              id: result.id,
              status: result.status as CrawlStatus,
              progress: result.progress,
              questionsFound: result.questionsFound,
              error: result.error,
              metadata: result.metadata as CrawlMetadata | undefined,
              pipeline: result.pipeline as PipelineStep[] | undefined,
              resources: result.resources as ResourceUsage | undefined,
              logs: result.logs,
            }
          : prev
      );
    } catch (error: any) {
      // Handle error
      const errorMessage = error?.message || "Có lỗi xảy ra khi cào dữ liệu";
      
      setCrawlResults((prev) =>
        prev.map((item) =>
          item.id === newCrawl.id
            ? {
                ...item,
                status: "error" as const,
                progress: 0,
                error: errorMessage,
                logs: [
                  `[${new Date().toLocaleTimeString()}] Error: ${errorMessage}`,
                ],
              }
            : item
        )
      );

      setSelectedResult((prev) =>
        prev && prev.id === newCrawl.id
          ? {
              ...prev,
              status: "error" as const,
              progress: 0,
              error: errorMessage,
              logs: [
                `[${new Date().toLocaleTimeString()}] Error: ${errorMessage}`,
              ],
            }
          : prev
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case "processing":
        return <Download className="h-5 w-5 text-amber-500 animate-pulse" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-rose-500" />;
      default:
        return <FileText className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      pending: "Đang chờ",
      processing: "Đang cào dữ liệu",
      completed: "Hoàn thành",
      error: "Lỗi",
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const detailSummary = [
    {
      title: "Phần thi",
      value: selectedResult?.metadata?.parts ?? 0,
      icon: Layers,
    },
    {
      title: "Nhóm câu hỏi",
      value: selectedResult?.metadata?.groups ?? 0,
      icon: ListChecks,
    },
    {
      title: "File audio",
      value: selectedResult?.metadata?.audioTracks ?? 0,
      icon: AudioLines,
    },
    {
      title: "Skills phát hiện",
      value: selectedResult?.metadata?.skillsDetected ?? 0,
      icon: BookText,
    },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm uppercase tracking-widest text-slate-300">
              <Globe className="h-4 w-4" />
              Study4.com crawler
            </div>
            <h1 className="text-3xl font-semibold leading-tight">
              Cào đề TOEIC & transform thành dữ liệu hệ thống
            </h1>
            <p className="text-sm text-slate-200">
              Pipeline tương tự `crawl_service.py`: fetch HTML → crawl_to_entities → parse_skills → upload assets →
              persist vào Postgres.
            </p>
            <div className="flex flex-wrap gap-4 text-xs uppercase tracking-wide text-slate-300">
              <span className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-teal-300" />
                Mapping entity
              </span>
              <span className="flex items-center gap-2">
                <AudioLines className="h-4 w-4 text-pink-300" />
                Cloudinary upload
              </span>
              <span className="flex items-center gap-2">
                <ServerCog className="h-4 w-4 text-amber-300" />
                Pipeline monitor
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm">
              <p className="text-slate-200">Cấu hình đang dùng</p>
              <p className="text-lg font-semibold">
                {configPairs.cookies.length} cookies • {configPairs.headers.length} headers
              </p>
              <p className="text-xs text-slate-300">Đổi nhanh ngay tại đây mà không cần chỉnh .env</p>
            </div>
            <div className="flex flex-col gap-2">
              <Sheet open={configOpen} onOpenChange={setConfigOpen}>
                <SheetTrigger asChild>
                  <Button variant="secondary" className="font-semibold text-slate-800">
                    <Settings className="h-4 w-4 mr-2" />
                    Cấu hình Study4
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
                  <SheetHeader>
                    <SheetTitle>Cookies & headers</SheetTitle>
                    <SheetDescription>
                      Các giá trị này sẽ bind trực tiếp vào COOKIES / HEADERS trong `crawl_service.py`
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-6 text-sm">
                    <div>
                      <p className="font-semibold text-slate-900 mb-2">Cookies</p>
                      <div className="space-y-3">
                        {configPairs.cookies.map(([key, value]) => (
                          <div key={key}>
                            <Label htmlFor={`cookie-${key}`} className="text-xs uppercase text-slate-500">
                              {key}
                            </Label>
                            <Input
                              id={`cookie-${key}`}
                              defaultValue={value || ""}
                              className="mt-1"
                              onBlur={(e) =>
                                setCrawlerConfig((prev) => ({
                                  ...prev,
                                  cookies: { ...prev.cookies, [key]: e.target.value },
                                }))
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 mb-2">Headers</p>
                      <div className="space-y-3">
                        {configPairs.headers.map(([key, value]) => (
                          <div key={key}>
                            <Label htmlFor={`header-${key}`} className="text-xs uppercase text-slate-500">
                              {key}
                            </Label>
                            <Input
                              id={`header-${key}`}
                              defaultValue={value || ""}
                              className="mt-1"
                              onBlur={(e) =>
                                setCrawlerConfig((prev) => ({
                                  ...prev,
                                  headers: { ...prev.headers, [key]: e.target.value },
                                }))
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button onClick={() => setConfigOpen(false)} className="w-full">
                      Lưu cấu hình
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
              <Link
                to="/exams/list"
                className="text-center text-xs text-slate-300 underline underline-offset-4"
              >
                Xem tất cả đề thi đã import
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap gap-3 text-sm font-medium text-slate-600">
          <button
            onClick={() => setCrawlerMode("toeic")}
            className={`px-4 py-2 rounded-full transition ${
              crawlerMode === "toeic" ? "bg-slate-900 text-white" : "bg-slate-100 hover:bg-slate-200"
            }`}
          >
            TOEIC Study4
          </button>
          <button
            onClick={() => setCrawlerMode("custom")}
            className={`px-4 py-2 rounded-full transition ${
              crawlerMode === "custom" ? "bg-slate-900 text-white" : "bg-slate-100 hover:bg-slate-200"
            }`}
          >
            Nguồn tuỳ chỉnh
          </button>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-sm text-slate-600">
          {crawlerMode === "toeic" ? (
            <ul className="list-disc pl-5 space-y-1">
              <li>Reuse pipeline `import_test(url, db)` (requests, BeautifulSoup, SQLAlchemy).</li>
              <li>Tự động upload audio/image lên Cloudinary + mapping skills (parse_skills).</li>
              <li>Tạo đủ bảng Tests, Parts, Groups, Questions, Answers, Skills, QuestionTags.</li>
            </ul>
          ) : (
            <p>Phù hợp khi cần import từ API riêng và map về cấu trúc TOEIC nội bộ.</p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-dashed border-slate-200 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Globe className="h-5 w-5 text-slate-500" />
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Cào đề thi mới</h2>
            <p className="text-sm text-slate-500">Nhập URL Study4.com / nguồn custom</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url" className="text-xs uppercase text-slate-500 tracking-wide">
              URL trang web
            </Label>
            <Input
              id="url"
              type="url"
              placeholder="https://study4.com/tests/226/new-economy-toeic-test-3/results/29527020/details/"
              {...register("url", {
                required: "URL là bắt buộc",
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: "URL không hợp lệ",
                },
              })}
            />
            {errors.url && <p className="text-sm text-red-500">{errors.url.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="examTitle" className="text-xs uppercase text-slate-500 tracking-wide">
              Tên đề thi (tuỳ chọn)
            </Label>
            <Input
              id="examTitle"
              placeholder="Nếu trống, hệ thống tự map từ slug URL"
              {...register("examTitle")}
            />
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-500">
              Pipeline chạy background ≈ 8s • Theo dõi realtime phía dưới.
            </p>
            <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
              <Download className="h-4 w-4 mr-2" />
              {isLoading ? "Đang cào dữ liệu..." : "Bắt đầu cào dữ liệu"}
            </Button>
          </div>
        </form>
      </section>

      <section className="space-y-3 text-sm text-slate-600">
        <p className="font-semibold text-slate-900">Mockup luồng xử lý</p>
        <div className="grid gap-3 md:grid-cols-4">
          {[
            { step: "01", label: "Fetch HTML", desc: "requests + BeautifulSoup" },
            { step: "02", label: "Parse DOM", desc: "crawl_to_entities" },
            { step: "03", label: "Skills & Assets", desc: "parse_skills + Cloudinary" },
            { step: "04", label: "Persist & Review", desc: "import_test → /exams/list" },
          ].map((item) => (
            <div key={item.step} className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
              <p className="text-xs font-semibold text-slate-300 uppercase">Step {item.step}</p>
              <p className="text-base font-semibold text-slate-900">{item.label}</p>
              <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Lịch sử cào dữ liệu</h3>
            <p className="text-sm text-slate-500">Quan sát realtime pipeline</p>
          </div>
          <Link to="/exams/list">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Mở quản lý đề thi
            </Button>
          </Link>
        </div>
        <div className="space-y-3">
          {crawlResults.map((result) => (
            <div
              key={result.id}
              onClick={() => setSelectedResult(result)}
              className={`rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50 cursor-pointer ${
                selectedResult?.id === result.id ? "border-slate-900 bg-slate-900/5" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <h4 className="font-medium text-slate-900">{result.title}</h4>
                    <p className="text-xs text-slate-500">{result.url}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-700">{getStatusText(result.status)}</p>
                  <p className="text-xs text-slate-400">{formatDate(result.createdAt)}</p>
                </div>
              </div>

              {result.status === "processing" && (
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Tiến độ: {result.progress}%</span>
                    <span>Đã tìm thấy: {result.questionsFound} câu</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-slate-900 transition-all duration-300"
                      style={{ width: `${result.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {result.status === "completed" && (
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-emerald-600">
                    Đã cào {result.questionsFound} câu hỏi
                  </span>
                  <Link to="/exams/list">
                    <Button size="sm" variant="outline">
                      Xem đề thi
                    </Button>
                  </Link>
                </div>
              )}

              {result.status === "error" && (
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-rose-500">Lỗi: {result.error}</span>
                  <Button size="sm" variant="outline">
                    Thử lại
                  </Button>
                </div>
              )}
            </div>
          ))}

          {crawlResults.length === 0 && (
            <div className="text-center py-12 rounded-2xl border border-dashed border-slate-200">
              <Globe className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Chưa có lịch sử cào dữ liệu.</p>
            </div>
          )}
        </div>
      </section>

      {selectedResult?.metadata && (
        <section className="rounded-3xl border border-slate-200 p-6 space-y-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase text-slate-500 tracking-wide">Kết quả chi tiết</p>
              <h3 className="text-2xl font-semibold text-slate-900">{selectedResult.title}</h3>
              <p className="text-sm text-slate-500">
                Dữ liệu từ pipeline `crawl_service.py`
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm">
                Xuất JSON preview
              </Button>
              <Link to="/exams/list">
                <Button size="sm">Đi tới quản lý đề thi</Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {detailSummary.map((item) => (
              <div key={item.title} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase text-slate-400 flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </p>
                <p className="text-3xl font-semibold text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold uppercase text-slate-500">Thống kê theo phần</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Part</TableHead>
                    <TableHead>Câu hỏi</TableHead>
                    <TableHead>Groups</TableHead>
                    <TableHead className="text-right">Độ khó</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedResult.metadata.partStats.map((part) => (
                    <TableRow key={part.part}>
                      <TableCell>Part {part.part}</TableCell>
                      <TableCell>{part.questions}</TableCell>
                      <TableCell>{part.groups}</TableCell>
                      <TableCell className="text-right capitalize">{part.difficulty}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase text-slate-500">Skills phát hiện</h4>
              <div className="space-y-3">
                {selectedResult.metadata.skillStats.map((skill) => (
                  <div key={skill.name} className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{skill.name}</p>
                        <p className="text-xs text-slate-500">{skill.questions} câu</p>
                      </div>
                      <span className="text-sm font-semibold">
                        {Math.round(skill.confidence * 100)}%
                      </span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-slate-900"
                        style={{ width: `${skill.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {(selectedResult.pipeline || selectedResult.resources || selectedResult.logs) && (
            <div className="grid gap-6 lg:grid-cols-2">
              {selectedResult.pipeline && (
                <div>
                  <h4 className="mb-3 text-sm font-semibold uppercase text-slate-500">
                    Pipeline `crawl_service.py`
                  </h4>
                  <div className="space-y-3">
                    {selectedResult.pipeline.map((step) => (
                      <div key={step.key} className="rounded-2xl bg-white p-4 border border-slate-100 space-y-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">{step.title}</p>
                            <p className="text-xs text-slate-500">{step.description}</p>
                          </div>
                          <span
                            className={`text-xs font-semibold ${
                              step.status === "completed"
                                ? "text-emerald-600"
                                : step.status === "processing"
                                ? "text-amber-600"
                                : step.status === "error"
                                ? "text-rose-600"
                                : "text-slate-400"
                            }`}
                          >
                            {step.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>Duration {(step.durationMs / 1000).toFixed(1)}s</span>
                          {step.entities && (
                            <span>
                              {Object.entries(step.entities)
                                .filter(([, val]) => !!val)
                                .map(([key, val]) => `${val} ${key}`)
                                .join(" • ")}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(selectedResult.resources || selectedResult.logs) && (
                <div className="space-y-4">
                  {selectedResult.resources && (
                    <div className="rounded-2xl bg-white p-4 border border-slate-100 space-y-3">
                      <h4 className="text-sm font-semibold uppercase text-slate-500">Tài nguyên sử dụng</h4>
                      <div className="text-sm space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Requests</span>
                          <strong>{selectedResult.resources.requests}</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Băng thông</span>
                          <strong>{selectedResult.resources.bandwidthMb} MB</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Cloudinary uploads</span>
                          <strong>{selectedResult.resources.cloudinaryUploads}</strong>
                        </div>
                        {selectedResult.resources.cookiesValidUntil && (
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>Cookies hết hạn</span>
                            <span>
                              {new Date(selectedResult.resources.cookiesValidUntil).toLocaleString("vi-VN")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedResult.logs && (
                    <div className="rounded-2xl bg-slate-50 p-4 space-y-3">
                      <h4 className="text-sm font-semibold uppercase text-slate-500">Logs</h4>
                      <div className="space-y-2 text-xs font-mono text-slate-500">
                        {selectedResult.logs.map((line, idx) => (
                          <p key={`${line}-${idx}`}>{line}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
