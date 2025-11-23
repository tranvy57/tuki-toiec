import { type ReactNode } from "react";
import { BookOpen, Layers, Users, AudioLines, Upload, FileText, Settings, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Link, useParams } from "react-router-dom";

const mockExamDetail = {
  id: "test-001",
  title: "New Economy TOEIC - Test 03",
  status: "active",
  code: "NE-T03",
  band: "600 - 800",
  notes: "Đề thi được import từ Study4 ngày 15/01/2024",
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-16T06:45:00Z",
  totalQuestions: 200,
  totalGroups: 78,
  students: 124,
  audioTracks: 43,
  vocabularyTags: 128,
  audioUrl: "https://cdn.study4.com/audio/ne-toeic-03.mp3",
  parts: [
    {
      partNumber: 1,
      title: "Photographs",
      questions: 6,
      groups: 6,
      direction: "Chọn đáp án mô tả đúng hình ảnh",
    },
    {
      partNumber: 2,
      title: "Question-Response",
      questions: 25,
      groups: 25,
      direction: "Chọn câu trả lời phù hợp",
    },
    {
      partNumber: 3,
      title: "Conversations",
      questions: 39,
      groups: 13,
      direction: "Nghe đoạn hội thoại và trả lời",
    },
    {
      partNumber: 4,
      title: "Talks",
      questions: 30,
      groups: 10,
      direction: "Nghe đoạn thông báo và trả lời",
    },
    {
      partNumber: 5,
      title: "Incomplete Sentences",
      questions: 30,
      groups: 30,
      direction: "Chọn đáp án điền vào chỗ trống",
    },
    {
      partNumber: 6,
      title: "Text Completion",
      questions: 16,
      groups: 4,
      direction: "Hoàn thành đoạn văn ngắn",
    },
    {
      partNumber: 7,
      title: "Reading Comprehension",
      questions: 54,
      groups: 10,
      direction: "Đọc hiểu đoạn văn dài",
    },
  ],
  attachments: [
    { type: "audio", label: "Audio tổng", url: "https://cdn.study4.com/audio/ne-toeic-03.mp3" },
    { type: "image", label: "Hình minh hoạ part 1", url: "https://res.cloudinary.com/mock/image/upload/v1/part1.png" },
  ],
};

export default function ExamDetailPage() {
  const { id } = useParams();
  const exam = mockExamDetail;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Exam Detail #{id}</p>
          <h1 className="text-3xl font-semibold text-slate-900">{exam.title}</h1>
          <p className="text-sm text-slate-500">{exam.notes}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <Link to="/questions">
              <FileText className="h-4 w-4 mr-2" />
              Quản lý câu hỏi
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/vocabularies">
              <Link2 className="h-4 w-4 mr-2" />
              Đồng bộ vocab
            </Link>
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Chỉnh sửa đề thi
          </Button>
        </div>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard icon={<BookOpen className="h-4 w-4" />} label="Câu hỏi" value={exam.totalQuestions} />
          <StatCard icon={<Layers className="h-4 w-4" />} label="Nhóm câu hỏi" value={exam.totalGroups} />
          <StatCard icon={<AudioLines className="h-4 w-4" />} label="Audio track" value={exam.audioTracks} />
          <StatCard icon={<Users className="h-4 w-4" />} label="Học viên đã làm" value={exam.students} />
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
          <span>Mã đề: <strong className="text-slate-800">{exam.code}</strong></span>
          <span>Band gợi ý: <strong className="text-slate-800">{exam.band}</strong></span>
          <span>Ngày tạo: <strong className="text-slate-800">{new Date(exam.createdAt).toLocaleString("vi-VN")}</strong></span>
          <span>Ngày cập nhật: <strong className="text-slate-800">{new Date(exam.updatedAt).toLocaleString("vi-VN")}</strong></span>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-slate-500">Cấu trúc đề</p>
            <h2 className="text-xl font-semibold text-slate-900">Chi tiết các phần TOEIC</h2>
          </div>
          <Button variant="outline" size="sm">Xuất cấu trúc</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Part</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Câu hỏi</TableHead>
              <TableHead>Groups</TableHead>
              <TableHead>Hướng dẫn</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exam.parts.map((part) => (
              <TableRow key={part.partNumber}>
                <TableCell className="font-semibold">Part {part.partNumber}</TableCell>
                <TableCell>{part.title}</TableCell>
                <TableCell>{part.questions}</TableCell>
                <TableCell>{part.groups}</TableCell>
                <TableCell className="text-sm text-slate-500">{part.direction}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-slate-500">Tài nguyên</p>
            <h2 className="text-xl font-semibold text-slate-900">Audio & Assets</h2>
          </div>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload mới
          </Button>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {exam.attachments.map((item) => (
            <div key={item.url} className="rounded-2xl border border-slate-100 p-4">
              <p className="text-xs uppercase text-slate-400">{item.type}</p>
              <p className="font-semibold text-slate-900">{item.label}</p>
              <a href={item.url} className="text-sm text-slate-500 underline" target="_blank" rel="noreferrer">
                {item.url}
              </a>
            </div>
          ))}
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

