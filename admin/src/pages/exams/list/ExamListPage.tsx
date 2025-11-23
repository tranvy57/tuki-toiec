import { useMemo, useState, type ReactNode } from "react";
import {
  BookOpen,
  Layers,
  Users,
  PenSquare,
  Search,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

type ExamStatus = "active" | "draft" | "completed";

interface ExamSummary {
  id: string;
  title: string;
  code: string;
  status: ExamStatus;
  totalQuestions: number;
  totalGroups: number;
  students: number;
  createdAt: string;
  updatedAt: string;
  audioTracks: number;
  vocabularyTags: number;
  parts: {
    partNumber: number;
    questions: number;
    groups: number;
    difficulty: "easy" | "medium" | "hard";
  }[];
}

const examData: ExamSummary[] = [
  {
    id: "test-001",
    title: "New Economy TOEIC - Test 03",
    code: "NE-T03",
    status: "active",
    totalQuestions: 200,
    totalGroups: 78,
    students: 124,
    audioTracks: 43,
    vocabularyTags: 128,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-16T06:45:00Z",
    parts: [
      { partNumber: 1, questions: 6, groups: 6, difficulty: "medium" },
      { partNumber: 2, questions: 25, groups: 25, difficulty: "medium" },
      { partNumber: 3, questions: 39, groups: 13, difficulty: "hard" },
      { partNumber: 4, questions: 30, groups: 10, difficulty: "hard" },
      { partNumber: 5, questions: 30, groups: 30, difficulty: "medium" },
      { partNumber: 6, questions: 16, groups: 4, difficulty: "medium" },
      { partNumber: 7, questions: 54, groups: 10, difficulty: "hard" },
    ],
  },
  {
    id: "test-002",
    title: "TOEIC Mock Test 08",
    code: "MOCK-08",
    status: "draft",
    totalQuestions: 200,
    totalGroups: 72,
    students: 0,
    audioTracks: 40,
    vocabularyTags: 110,
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-11T12:10:00Z",
    parts: [
      { partNumber: 1, questions: 6, groups: 6, difficulty: "easy" },
      { partNumber: 2, questions: 25, groups: 25, difficulty: "medium" },
      { partNumber: 3, questions: 39, groups: 13, difficulty: "medium" },
      { partNumber: 4, questions: 30, groups: 10, difficulty: "medium" },
      { partNumber: 5, questions: 30, groups: 30, difficulty: "medium" },
      { partNumber: 6, questions: 16, groups: 4, difficulty: "medium" },
      { partNumber: 7, questions: 54, groups: 10, difficulty: "hard" },
    ],
  },
  {
    id: "test-003",
    title: "TOEIC Practice Test 14",
    code: "PRAC-14",
    status: "completed",
    totalQuestions: 200,
    totalGroups: 75,
    students: 41,
    audioTracks: 42,
    vocabularyTags: 120,
    createdAt: "2023-12-20T08:40:00Z",
    updatedAt: "2024-01-03T14:15:00Z",
    parts: [
      { partNumber: 1, questions: 6, groups: 6, difficulty: "medium" },
      { partNumber: 2, questions: 25, groups: 25, difficulty: "medium" },
      { partNumber: 3, questions: 39, groups: 13, difficulty: "hard" },
      { partNumber: 4, questions: 30, groups: 10, difficulty: "hard" },
      { partNumber: 5, questions: 30, groups: 30, difficulty: "medium" },
      { partNumber: 6, questions: 16, groups: 4, difficulty: "medium" },
      { partNumber: 7, questions: 54, groups: 10, difficulty: "medium" },
    ],
  },
];

export default function ExamListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ExamStatus | "all">("all");
  const [selectedExamId, setSelectedExamId] = useState<string>(examData[0]?.id ?? "");

  const filteredExams = useMemo(() => {
    return examData.filter((exam) => {
      const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || exam.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const selectedExam = useMemo(
    () => examData.find((exam) => exam.id === selectedExamId) || filteredExams[0],
    [selectedExamId, filteredExams],
  );

  const statusStyles: Record<ExamStatus, { label: string; classes: string }> = {
    active: { label: "Đang hoạt động", classes: "bg-emerald-100 text-emerald-700" },
    draft: { label: "Nháp", classes: "bg-amber-100 text-amber-700" },
    completed: { label: "Hoàn thành", classes: "bg-slate-100 text-slate-700" },
  };

  const formatDate = (value: string) =>
    new Date(value).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Exam Manager</p>
          <h1 className="text-3xl font-semibold text-slate-900">Danh sách đề thi TOEIC</h1>
          <p className="text-sm text-slate-500">
            Đồng bộ với bảng `tests`, `parts`, `groups`, `questions` trong backend NestJS.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/exams/crawl">
            <Button variant="outline" className="w-full md:w-auto">
              Import từ Study4
            </Button>
          </Link>
          <Link to="/exams/create">
            <Button className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Tạo đề thi
            </Button>
          </Link>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 p-5 bg-white shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Tìm kiếm theo tên đề thi, mã đề..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ExamStatus | "all")}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="draft">Nháp</option>
            <option value="completed">Hoàn thành</option>
          </select>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-1">
          <p className="text-sm font-semibold text-slate-600">
            {filteredExams.length} đề thi
          </p>
          <div className="space-y-3">
            {filteredExams.map((exam) => (
              <button
                key={exam.id}
                onClick={() => setSelectedExamId(exam.id)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  selectedExam?.id === exam.id
                    ? "border-slate-900 bg-slate-900/5"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{exam.title}</p>
                    <p className="text-xs text-slate-500">{exam.code}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      statusStyles[exam.status].classes
                    }`}
                  >
                    {statusStyles[exam.status].label}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5" /> {exam.totalQuestions} câu
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> {exam.students} học viên
                  </span>
                </div>
              </button>
            ))}
            {filteredExams.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                Không tìm thấy đề thi phù hợp bộ lọc.
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {selectedExam ? (
            <>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase text-slate-500">Đề thi</p>
                  <h2 className="text-2xl font-semibold text-slate-900">{selectedExam.title}</h2>
                  <p className="text-sm text-slate-500">
                    Cập nhật lần cuối {formatDate(selectedExam.updatedAt)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link to={`/exams/${selectedExam.id}`}>
                    <Button variant="outline" size="sm">
                      <EyeIcon />
                      Xem chi tiết
                    </Button>
                  </Link>
                  <Link to="/questions">
                    <Button variant="ghost" size="sm">
                      <PenSquare className="h-4 w-4 mr-2" />
                      Quản lý câu hỏi
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-4">
                <StatCard icon={<BookOpen className="h-4 w-4" />} label="Câu hỏi" value={selectedExam.totalQuestions} />
                <StatCard icon={<Layers className="h-4 w-4" />} label="Nhóm câu hỏi" value={selectedExam.totalGroups} />
                <StatCard icon={<AudioLines className="h-4 w-4" />} label="Audio" value={selectedExam.audioTracks} />
                <StatCard icon={<Users className="h-4 w-4" />} label="Học viên" value={selectedExam.students} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-600">Cấu trúc phần thi</p>
                  <Link to={`/exams/${selectedExam.id}`} className="text-xs text-slate-500 flex items-center gap-1">
                    Chỉnh sửa cấu trúc
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {selectedExam.parts.map((part) => (
                    <div key={part.partNumber} className="rounded-2xl border border-slate-100 p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-slate-900">Part {part.partNumber}</p>
                        <span className="text-xs uppercase text-slate-400">{part.difficulty}</span>
                      </div>
                      <p className="text-sm text-slate-500">
                        {part.questions} câu • {part.groups} nhóm
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                <div>
                  Ngày tạo: <span className="font-semibold text-slate-700">{formatDate(selectedExam.createdAt)}</span>
                </div>
                <div>
                  Mã đề: <span className="font-semibold text-slate-700">{selectedExam.code}</span>
                </div>
                <div>
                  Tags từ vựng:{" "}
                  <span className="font-semibold text-slate-700">{selectedExam.vocabularyTags}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-slate-500">
              Chọn một đề thi để xem chi tiết.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-100 p-4 flex items-center gap-3">
      <div className="rounded-xl bg-slate-100 p-3 text-slate-700">{icon}</div>
      <div>
        <p className="text-xs uppercase text-slate-400">{label}</p>
        <p className="text-xl font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function EyeIcon() {
  return <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>;
}
