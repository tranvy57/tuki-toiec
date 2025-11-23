import { useMemo, useState } from "react";
import { Filter, Plus, FileSpreadsheet, Search, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuestions, useCreateQuestion, useUpdateQuestion, useDeleteQuestion } from '@/hooks/useQuestions';
import type { Question } from '@/types/api';

// Import layout components
import {
    PageContainer,
    PageHeader,
    ContentWrapper,
} from "@/components/common";

export default function QuestionsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [partFilter, setPartFilter] = useState("all");
    const [difficultyFilter, setDifficultyFilter] = useState("all");

    // API hooks
    const { data: apiQuestions = [], isLoading, error } = useQuestions();
    const createMutation = useCreateQuestion();
    const updateMutation = useUpdateQuestion();
    const deleteMutation = useDeleteQuestion();

    // Convert API data to display format - safely handle non-array data
    const questions = useMemo(() => {
        if (!apiQuestions || !Array.isArray(apiQuestions)) {
            return [];
        }
        return apiQuestions.map(q => ({
            id: q.id,
            part: q.part || 1,
            skill: q.skill || 'General',
            difficulty: q.difficulty || 'medium',
            status: q.status || 'draft',
            content: q.content,
            tags: q.tags?.map(tag => tag.name) || [],
            updatedAt: q.updatedAt || q.createdAt,
        }));
    }, [apiQuestions]);

    const filteredQuestions = useMemo(() => {
        return questions.filter((question) => {
            const matchesSearch = question.content.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesPart = partFilter === "all" || `part-${question.part}` === partFilter;
            const matchesDifficulty = difficultyFilter === "all" || question.difficulty === difficultyFilter;
            return matchesSearch && matchesPart && matchesDifficulty;
        });
    }, [questions, searchTerm, partFilter, difficultyFilter]);

    if (isLoading) {
        return (
            <PageContainer>
                <ContentWrapper>
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                </ContentWrapper>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer>
                <ContentWrapper>
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <p className="text-red-500 mb-4">Lỗi tải dữ liệu câu hỏi</p>
                            <Button onClick={() => window.location.reload()}>Thử lại</Button>
                        </div>
                    </div>
                </ContentWrapper>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader
                title="Ngân hàng câu hỏi"
                description="Đồng bộ với bảng questions, answers, question_tags, skills từ backend NestJS."
            >
                <div className="flex flex-wrap gap-3">
                    <Button variant="outline" className="w-full md:w-auto">
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Import Excel
                    </Button>
                    <Button className="w-full md:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        Tạo câu hỏi mới
                    </Button>
                </div>
            </PageHeader>

            <ContentWrapper>

                {/* Filters */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Tìm kiếm theo nội dung câu hỏi..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={partFilter}
                            onChange={(e) => setPartFilter(e.target.value)}
                            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                        >
                            <option value="all">Tất cả Part</option>
                            <option value="part-1">Part 1</option>
                            <option value="part-2">Part 2</option>
                            <option value="part-3">Part 3</option>
                            <option value="part-4">Part 4</option>
                            <option value="part-5">Part 5</option>
                            <option value="part-6">Part 6</option>
                            <option value="part-7">Part 7</option>
                        </select>
                        <select
                            value={difficultyFilter}
                            onChange={(e) => setDifficultyFilter(e.target.value)}
                            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                        >
                            <option value="all">Tất cả độ khó</option>
                            <option value="easy">Dễ</option>
                            <option value="medium">Trung bình</option>
                            <option value="hard">Khó</option>
                        </select>
                    </div>
                </div>

                {/* Questions Table */}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Part</TableHead>
                                <TableHead>Skill</TableHead>
                                <TableHead>Content</TableHead>
                                <TableHead>Difficulty</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Tags</TableHead>
                                <TableHead>Updated</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredQuestions.map((question) => (
                                <TableRow key={question.id}>
                                    <TableCell className="font-mono text-xs">{question.id}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                                            Part {question.part}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-sm">{question.skill}</TableCell>
                                    <TableCell className="max-w-xs truncate text-sm">
                                        {question.content}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${question.difficulty === "easy"
                                                ? "bg-green-50 text-green-700"
                                                : question.difficulty === "medium"
                                                    ? "bg-yellow-50 text-yellow-700"
                                                    : "bg-red-50 text-red-700"
                                                }`}
                                        >
                                            {question.difficulty}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${question.status === "published"
                                                ? "bg-green-50 text-green-700"
                                                : "bg-gray-50 text-gray-700"
                                                }`}
                                        >
                                            {question.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {question.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700"
                                                >
                                                    <Tags className="mr-1 h-3 w-3" />
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-slate-500">
                                        {new Date(question.updatedAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">
                                                Edit
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {filteredQuestions.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Search className="h-12 w-12 text-slate-300" />
                            <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                Không tìm thấy câu hỏi nào
                            </h3>
                            <p className="mt-2 text-sm text-slate-500">
                                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
                            </p>
                        </div>
                    )}
                </div>
            </ContentWrapper>
        </PageContainer>
    );
}