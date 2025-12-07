import { useState } from "react";
import { BookOpen, Upload, Search, Filter, DownloadCloud, Volume2, AlertTriangle, Eye, Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVocabularies, useCreateVocabulary, useDeleteVocabulary, useImportVocabulariesFromExcel } from '@/hooks/useVocabularies';
import type { Vocabulary, CreateVocabularyDto } from '@/types/api';
import { useDebounce } from '@/hooks/useDebounce';

export default function VocabularyPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [partOfSpeechFilter, setPartOfSpeechFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newVocabulary, setNewVocabulary] = useState<CreateVocabularyDto>({
    word: '',
    meaning: '',
    pronunciation: '',
    partOfSpeech: '',
    exampleEn: '',
    exampleVn: '',
    audioUrl: '',
    type: 'toeic'
  });

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Reset page when search/filter changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    if (filterType === 'type') {
      setTypeFilter(value);
    } else if (filterType === 'partOfSpeech') {
      setPartOfSpeechFilter(value);
    }
    setCurrentPage(1);
  };

  // API hooks with search params
  const searchParams = {
    search: debouncedSearch || undefined,
    type: typeFilter !== "all" ? typeFilter : undefined,
    partOfSpeech: partOfSpeechFilter !== "all" ? partOfSpeechFilter : undefined,
    page: currentPage,
    limit: pageSize
  };

  const { data: vocabularyResponse, isLoading, error } = useVocabularies(searchParams);
  const vocabularies = vocabularyResponse?.data || [];
  console.log(vocabularies);
  const meta = vocabularyResponse?.meta;
  const createMutation = useCreateVocabulary();
  const deleteMutation = useDeleteVocabulary();
  const importMutation = useImportVocabulariesFromExcel();

  const handleCreateVocabulary = async () => {
    if (!newVocabulary.word || !newVocabulary.meaning) {
      return;
    }

    try {
      await createMutation.mutateAsync(newVocabulary);
      setIsCreateModalOpen(false);
      setNewVocabulary({
        word: '',
        meaning: '',
        pronunciation: '',
        partOfSpeech: '',
        exampleEn: '',
        exampleVn: '',
        audioUrl: '',
        type: 'toeic'
      });
    } catch (error) {
      console.error('Error creating vocabulary:', error);
    }
  };

  const playAudio = (audioUrl: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(console.error);
    }
  };

  const handleImportExcel = async (file: File) => {
    try {
      await importMutation.mutateAsync(file);
    } catch (error) {
      console.error('Error importing vocabularies:', error);
    }
  };

  const handleDelete = async (vocabulary: Vocabulary) => {
    if (window.confirm(`Bạn có chắc muốn xóa từ "${vocabulary.word}"?`)) {
      try {
        await deleteMutation.mutateAsync(vocabulary.id);
      } catch (error) {
        console.error('Error deleting vocabulary:', error);
      }
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
              <p className="text-sm text-gray-500 mb-4">Không thể tải danh sách từ vựng</p>
              <Button onClick={() => window.location.reload()}>Thử lại</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Vocabulary Manager</p>
            <h1 className="text-3xl font-semibold text-slate-900">Từ vựng TOEIC</h1>
            <p className="text-sm text-slate-500">
              Mapping với bảng `vocabulary`, `user_vocabularies`, hỗ trợ import Excel & Cloudinary.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="w-full md:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm từ vựng
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Thêm từ vựng mới</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="word">Từ vựng *</Label>
                      <Input
                        id="word"
                        value={newVocabulary.word}
                        onChange={(e) => setNewVocabulary({ ...newVocabulary, word: e.target.value })}
                        placeholder="Ví dụ: business"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pronunciation">Phát âm</Label>
                      <Input
                        id="pronunciation"
                        value={newVocabulary.pronunciation}
                        onChange={(e) => setNewVocabulary({ ...newVocabulary, pronunciation: e.target.value })}
                        placeholder="Ví dụ: /ˈbɪznɪs/"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="meaning">Nghĩa *</Label>
                    <Textarea
                      id="meaning"
                      value={newVocabulary.meaning}
                      onChange={(e) => setNewVocabulary({ ...newVocabulary, meaning: e.target.value })}
                      placeholder="Ví dụ: kinh doanh, doanh nghiệp"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="partOfSpeech">Từ loại</Label>
                      <Select value={newVocabulary.partOfSpeech} onValueChange={(value) => setNewVocabulary({ ...newVocabulary, partOfSpeech: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn từ loại" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="noun">Noun</SelectItem>
                          <SelectItem value="verb">Verb</SelectItem>
                          <SelectItem value="adjective">Adjective</SelectItem>
                          <SelectItem value="adverb">Adverb</SelectItem>
                          <SelectItem value="preposition">Preposition</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="type">Loại</Label>
                      <Select value={newVocabulary.type} onValueChange={(value) => setNewVocabulary({ ...newVocabulary, type: value as any })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="toeic">TOEIC</SelectItem>
                          <SelectItem value="exercise">Exercise</SelectItem>
                          <SelectItem value="ai_generated">AI Generated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="exampleEn">Ví dụ tiếng Anh</Label>
                    <Textarea
                      id="exampleEn"
                      value={newVocabulary.exampleEn}
                      onChange={(e) => setNewVocabulary({ ...newVocabulary, exampleEn: e.target.value })}
                      placeholder="Ví dụ: She runs a successful business."
                    />
                  </div>
                  <div>
                    <Label htmlFor="exampleVn">Ví dụ tiếng Việt</Label>
                    <Textarea
                      id="exampleVn"
                      value={newVocabulary.exampleVn}
                      onChange={(e) => setNewVocabulary({ ...newVocabulary, exampleVn: e.target.value })}
                      placeholder="Ví dụ: Cô ấy điều hành một doanh nghiệp thành công."
                    />
                  </div>
                  <div>
                    <Label htmlFor="audioUrl">Audio URL</Label>
                    <Input
                      id="audioUrl"
                      value={newVocabulary.audioUrl}
                      onChange={(e) => setNewVocabulary({ ...newVocabulary, audioUrl: e.target.value })}
                      placeholder="https://example.com/audio.mp3"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Hủy
                  </Button>
                  <Button
                    onClick={handleCreateVocabulary}
                    disabled={createMutation.isPending || !newVocabulary.word || !newVocabulary.meaning}
                  >
                    {createMutation.isPending ? 'Đang tạo...' : 'Tạo từ vựng'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" className="w-full md:w-auto" disabled>
              <DownloadCloud className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
            <Button
              className="w-full md:w-auto"
              disabled={importMutation.isPending}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.xlsx,.xls';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) handleImportExcel(file);
                };
                input.click();
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              {importMutation.isPending ? 'Đang import...' : 'Import từ Excel'}
            </Button>
          </div>
        </header>

        {/* Filters */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Filter className="h-4 w-4" />
            Bộ lọc
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Tìm từ vựng hoặc nghĩa..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={typeFilter}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm"
            >
              <option value="all">Tất cả loại</option>
              <option value="ai_generated">AI Generated</option>
              <option value="toeic">TOEIC</option>
              <option value="exercise">Exercise</option>
            </select>
            <select
              value={partOfSpeechFilter}
              onChange={(e) => handleFilterChange('partOfSpeech', e.target.value)}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm"
            >
              <option value="all">Từ loại</option>
              <option value="noun">Noun</option>
              <option value="verb">Verb</option>
              <option value="adjective">Adjective</option>
              <option value="adverb">Adverb</option>
              <option value="preposition">Preposition</option>
            </select>
          </div>
        </section>

        {/* Data Table */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-600">
              {vocabularies.length} từ vựng
            </p>
            <Button variant="ghost" size="sm" className="text-slate-600">
              <BookOpen className="h-4 w-4 mr-2" />
              Quản lý nhóm từ
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Từ vựng</TableHead>
                <TableHead>Nghĩa</TableHead>
                <TableHead>Ví dụ</TableHead>
                <TableHead>Từ loại</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Audio</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="animate-pulse">Đang tải...</div>
                  </TableCell>
                </TableRow>
              ) : vocabularies.length > 0 ? (
                vocabularies.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-semibold text-slate-900">
                        {item.word}
                        {item.isPhrase && <span className="ml-2 text-xs text-blue-500">(phrase)</span>}
                      </div>
                      <p className="text-xs text-slate-500">{item.pronunciation}</p>
                    </TableCell>
                    <TableCell className="max-w-sm">
                      <p className="text-slate-700">{item.meaning}</p>
                    </TableCell>
                    <TableCell className="max-w-sm">
                      {item.exampleEn && (
                        <div>
                          <p className="text-sm text-slate-700">{item.exampleEn}</p>
                          {item.exampleVn && (
                            <p className="text-xs text-slate-500 italic">{item.exampleVn}</p>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">{item.partOfSpeech}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${item.type === 'ai_generated' ? 'bg-blue-100 text-blue-800' :
                        item.type === 'toeic' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                        {item.type || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {item.audioUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => playAudio(item.audioUrl!)}
                          title="Phát âm thanh"
                        >
                          <Volume2 className="h-3 w-3" />
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" title="Xem chi tiết">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" title="Chỉnh sửa">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(item)}
                          disabled={deleteMutation.isPending}
                          title="Xóa"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                    Không có từ vựng nào phù hợp.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </section>

        {/* Pagination */}
        {meta && meta.pages > 1 && (
          <div className="flex items-center justify-between bg-white px-6 py-4 border rounded-lg">
            <div className="flex items-center text-sm text-slate-600">
              Hiển thị {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, meta.total)}
              trong tổng số {meta.total} từ vựng
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                Trước
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, meta.pages) }, (_, i) => {
                  const pageNum = currentPage <= 3
                    ? i + 1
                    : currentPage >= meta.pages - 2
                      ? meta.pages - 4 + i
                      : currentPage - 2 + i;

                  if (pageNum < 1 || pageNum > meta.pages) return null;

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-9 h-9"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= meta.pages}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

