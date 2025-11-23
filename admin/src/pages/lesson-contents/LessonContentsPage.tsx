import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  CheckSquare,
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Book,
  Target,
  ArrowUp,
  ArrowDown,
  FileText,
  Video,
  Lightbulb,
  BookOpen,
  Crown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useNavigate, useParams } from 'react-router-dom';

// Types based on backend entities
const LessonContentType = {
  VIDEO: 'video',
  THEORY: 'theory',
  STRATEGY: 'strategy',
  VOCABULARY: 'vocabulary',
  QUIZ: 'quiz',
  EXPLANATION: 'explanation'
} as const;

type LessonContentTypeType = typeof LessonContentType[keyof typeof LessonContentType];

interface LessonContent {
  id: string;
  type: LessonContentTypeType;
  content: string;
  order: number;
  isPremium: boolean;
  lessonId: string;
  lessonName?: string;
  createdAt: string;
  updatedAt: string;
  // Stats from relations
  lessonContentItemsCount?: number;
  studyTasksCount?: number;
  vocabulariesCount?: number;
}

interface Lesson {
  id: string;
  name: string;
}

// Mock data
const mockLessons: Lesson[] = [
  { id: '1', name: 'Present Simple vs Present Continuous' },
  { id: '2', name: 'Grammar Exercise Set 1' },
  { id: '3', name: 'Part 1 - Photo Description' },
  { id: '4', name: 'Mock Test - Listening Section' }
];

const mockLessonContents: LessonContent[] = [
  {
    id: '1',
    type: LessonContentType.VIDEO,
    content: 'https://youtube.com/watch?v=abc123 - Video giới thiệu về thì hiện tại đơn',
    order: 1,
    isPremium: false,
    lessonId: '1',
    lessonName: 'Present Simple vs Present Continuous',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    lessonContentItemsCount: 3,
    studyTasksCount: 2,
    vocabulariesCount: 15
  },
  {
    id: '2',
    type: LessonContentType.THEORY,
    content: '## Thì hiện tại đơn (Present Simple)\n\nThì hiện tại đơn được sử dụng để:\n1. Diễn tả sự thật, chân lý\n2. Thói quen, hành động lặp đi lặp lại\n3. Lịch trình, thời gian biểu',
    order: 2,
    isPremium: false,
    lessonId: '1',
    lessonName: 'Present Simple vs Present Continuous',
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-22T16:45:00Z',
    lessonContentItemsCount: 0,
    studyTasksCount: 0,
    vocabulariesCount: 8
  },
  {
    id: '3',
    type: LessonContentType.STRATEGY,
    content: '🎯 **Mẹo làm bài Part 1 TOEIC:**\n\n1. Đọc kỹ đáp án trước khi nghe\n2. Tập trung vào động từ và giới từ\n3. Loại trừ đáp án sai rõ ràng\n4. Chú ý thì của động từ',
    order: 1,
    isPremium: true,
    lessonId: '3',
    lessonName: 'Part 1 - Photo Description',
    createdAt: '2024-01-18T09:30:00Z',
    updatedAt: '2024-11-20T12:15:00Z',
    lessonContentItemsCount: 5,
    studyTasksCount: 3,
    vocabulariesCount: 12
  },
  {
    id: '4',
    type: LessonContentType.QUIZ,
    content: 'Quiz: 10 câu hỏi trắc nghiệm về thì hiện tại đơn và hiện tại tiếp diễn',
    order: 3,
    isPremium: false,
    lessonId: '1',
    lessonName: 'Present Simple vs Present Continuous',
    createdAt: '2024-01-15T14:00:00Z',
    updatedAt: '2024-01-25T10:20:00Z',
    lessonContentItemsCount: 10,
    studyTasksCount: 1,
    vocabulariesCount: 0
  },
  {
    id: '5',
    type: LessonContentType.VOCABULARY,
    content: '📚 **Từ vựng bài học:**\n\n- **Present** (adj): hiện tại\n- **Simple** (adj): đơn giản\n- **Continuous** (adj): tiếp diễn\n- **Tense** (n): thì (ngữ pháp)',
    order: 1,
    isPremium: false,
    lessonId: '1',
    lessonName: 'Present Simple vs Present Continuous',
    createdAt: '2024-01-16T08:15:00Z',
    updatedAt: '2024-01-28T13:40:00Z',
    lessonContentItemsCount: 0,
    studyTasksCount: 0,
    vocabulariesCount: 25
  },
  {
    id: '6',
    type: LessonContentType.EXPLANATION,
    content: '💡 **Giải thích chi tiết:**\n\nCâu 1: Đáp án đúng là A vì...\nCâu 2: Đáp án đúng là C vì...',
    order: 4,
    isPremium: true,
    lessonId: '1',
    lessonName: 'Present Simple vs Present Continuous',
    createdAt: '2024-01-15T16:30:00Z',
    updatedAt: '2024-11-22T09:10:00Z',
    lessonContentItemsCount: 2,
    studyTasksCount: 0,
    vocabulariesCount: 0
  }
];

const LessonContentsPage = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams<{ lessonId: string }>();
  const [lessonContents, setLessonContents] = useState<LessonContent[]>(mockLessonContents);
  const [lessons] = useState<Lesson[]>(mockLessons);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPremium, setFilterPremium] = useState<string>('all');
  const [filterLesson, setFilterLesson] = useState<string>(lessonId || 'all');
  const [selectedContent, setSelectedContent] = useState<LessonContent | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // New content form
  const [newContent, setNewContent] = useState<Partial<LessonContent>>({
    type: LessonContentType.THEORY,
    content: '',
    order: 0,
    isPremium: false,
    lessonId: lessonId || ''
  });

  // Filter contents
  const filteredContents = lessonContents.filter(content => {
    const matchesSearch = content.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || content.type === filterType;
    const matchesPremium = filterPremium === 'all' ||
      (filterPremium === 'premium' && content.isPremium) ||
      (filterPremium === 'free' && !content.isPremium);
    const matchesLesson = filterLesson === 'all' || content.lessonId === filterLesson;
    return matchesSearch && matchesType && matchesPremium && matchesLesson;
  }).sort((a, b) => a.order - b.order);

  // Calculate stats
  const totalContents = filteredContents.length;
  const premiumContents = filteredContents.filter(c => c.isPremium).length;
  const videoContents = filteredContents.filter(c => c.type === LessonContentType.VIDEO).length;
  const quizContents = filteredContents.filter(c => c.type === LessonContentType.QUIZ).length;

  const getTypeColor = (type: LessonContentTypeType) => {
    switch (type) {
      case LessonContentType.VIDEO: return 'bg-red-100 text-red-800';
      case LessonContentType.THEORY: return 'bg-blue-100 text-blue-800';
      case LessonContentType.STRATEGY: return 'bg-purple-100 text-purple-800';
      case LessonContentType.VOCABULARY: return 'bg-green-100 text-green-800';
      case LessonContentType.QUIZ: return 'bg-orange-100 text-orange-800';
      case LessonContentType.EXPLANATION: return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: LessonContentTypeType) => {
    switch (type) {
      case LessonContentType.VIDEO: return <Video className="w-4 h-4" />;
      case LessonContentType.THEORY: return <Book className="w-4 h-4" />;
      case LessonContentType.STRATEGY: return <Lightbulb className="w-4 h-4" />;
      case LessonContentType.VOCABULARY: return <BookOpen className="w-4 h-4" />;
      case LessonContentType.QUIZ: return <Target className="w-4 h-4" />;
      case LessonContentType.EXPLANATION: return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: LessonContentTypeType) => {
    switch (type) {
      case LessonContentType.VIDEO: return 'Video';
      case LessonContentType.THEORY: return 'Lý thuyết';
      case LessonContentType.STRATEGY: return 'Mẹo làm bài';
      case LessonContentType.VOCABULARY: return 'Từ vựng';
      case LessonContentType.QUIZ: return 'Quiz/Bài tập';
      case LessonContentType.EXPLANATION: return 'Giải thích';
      default: return type;
    }
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const handleCreateContent = async () => {
    try {
      // TODO: Call API to create content
      const content: LessonContent = {
        ...newContent as LessonContent,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lessonContentItemsCount: 0,
        studyTasksCount: 0,
        vocabulariesCount: 0
      };
      setLessonContents([...lessonContents, content]);
      setIsCreateOpen(false);
      setNewContent({
        type: LessonContentType.THEORY,
        content: '',
        order: 0,
        isPremium: false,
        lessonId: lessonId || ''
      });
    } catch (error) {
      console.error('Failed to create content:', error);
    }
  };

  const handleEditContent = async () => {
    try {
      // TODO: Call API to update content
      setLessonContents(lessonContents.map(content =>
        content.id === selectedContent?.id ? { ...selectedContent, updatedAt: new Date().toISOString() } : content
      ));
      setIsEditOpen(false);
      setSelectedContent(null);
    } catch (error) {
      console.error('Failed to update content:', error);
    }
  };

  const handleDeleteContent = async () => {
    try {
      // TODO: Call API to delete content
      setLessonContents(lessonContents.filter(content => content.id !== selectedContent?.id));
      setIsDeleteOpen(false);
      setSelectedContent(null);
    } catch (error) {
      console.error('Failed to delete content:', error);
    }
  };

  const handleUpdateOrder = async (contentId: string, direction: 'up' | 'down') => {
    try {
      // TODO: Implement order update logic
      const contentIndex = lessonContents.findIndex(c => c.id === contentId);
      if (
        (direction === 'up' && contentIndex > 0) ||
        (direction === 'down' && contentIndex < lessonContents.length - 1)
      ) {
        const newContents = [...lessonContents];
        const targetIndex = direction === 'up' ? contentIndex - 1 : contentIndex + 1;
        [newContents[contentIndex], newContents[targetIndex]] = [newContents[targetIndex], newContents[contentIndex]];

        // Update order values
        newContents[contentIndex].order = targetIndex + 1;
        newContents[targetIndex].order = contentIndex + 1;

        setLessonContents(newContents);
      }
    } catch (error) {
      console.error('Failed to update content order:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý Nội dung Bài học</h1>
            <p className="text-gray-600">
              Quản lý các nội dung trong bài học
              {lessonId && ` - ${lessons.find(l => l.id === lessonId)?.name}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate('/lessons')}>
              ← Quay lại Bài học
            </Button>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Tạo nội dung mới
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckSquare className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng nội dung</p>
                  <p className="text-2xl font-bold text-gray-900">{totalContents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Crown className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Premium</p>
                  <p className="text-2xl font-bold text-gray-900">{premiumContents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Video className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Video</p>
                  <p className="text-2xl font-bold text-gray-900">{videoContents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Target className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Quiz</p>
                  <p className="text-2xl font-bold text-gray-900">{quizContents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Danh sách nội dung</CardTitle>
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Tìm kiếm nội dung..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>

                {/* Type Filter */}
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Loại nội dung" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="theory">Lý thuyết</SelectItem>
                    <SelectItem value="strategy">Mẹo làm bài</SelectItem>
                    <SelectItem value="vocabulary">Từ vựng</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="explanation">Giải thích</SelectItem>
                  </SelectContent>
                </Select>

                {/* Premium Filter */}
                <Select value={filterPremium} onValueChange={setFilterPremium}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Premium" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="free">Miễn phí</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>

                {/* Lesson Filter */}
                {!lessonId && (
                  <Select value={filterLesson} onValueChange={setFilterLesson}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Bài học" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả bài học</SelectItem>
                      {lessons.map((lesson) => (
                        <SelectItem key={lesson.id} value={lesson.id}>
                          {lesson.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thứ tự</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead>Premium</TableHead>
                  {!lessonId && <TableHead>Bài học</TableHead>}
                  <TableHead>Items</TableHead>
                  <TableHead>Tasks</TableHead>
                  <TableHead>Vocabularies</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContents.map((content, index) => (
                  <TableRow key={content.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-lg">{content.order}</span>
                        <div className="flex flex-col gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => handleUpdateOrder(content.id, 'up')}
                            disabled={index === 0}
                          >
                            <ArrowUp className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => handleUpdateOrder(content.id, 'down')}
                            disabled={index === filteredContents.length - 1}
                          >
                            <ArrowDown className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(content.type)}>
                        <div className="flex items-center gap-1">
                          {getTypeIcon(content.type)}
                          {getTypeLabel(content.type)}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm truncate">{truncateContent(content.content, 80)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {content.isPremium ? (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Crown className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">
                          Free
                        </Badge>
                      )}
                    </TableCell>
                    {!lessonId && (
                      <TableCell>
                        <span className="text-sm text-gray-600">{content.lessonName}</span>
                      </TableCell>
                    )}
                    <TableCell>{content.lessonContentItemsCount || 0}</TableCell>
                    <TableCell>{content.studyTasksCount || 0}</TableCell>
                    <TableCell>{content.vocabulariesCount || 0}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedContent(content);
                              setIsViewOpen(true);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedContent(content);
                              setIsEditOpen(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setSelectedContent(content);
                              setIsDeleteOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredContents.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CheckSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Không tìm thấy nội dung nào.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Content Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Tạo nội dung mới</DialogTitle>
              <DialogDescription>
                Thêm nội dung mới vào bài học
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Loại nội dung</Label>
                  <Select
                    value={newContent.type}
                    onValueChange={(value) => setNewContent({ ...newContent, type: value as LessonContentTypeType })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="theory">Lý thuyết</SelectItem>
                      <SelectItem value="strategy">Mẹo làm bài</SelectItem>
                      <SelectItem value="vocabulary">Từ vựng</SelectItem>
                      <SelectItem value="quiz">Quiz/Bài tập</SelectItem>
                      <SelectItem value="explanation">Giải thích</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="order">Thứ tự</Label>
                  <Input
                    id="order"
                    type="number"
                    value={newContent.order}
                    onChange={(e) => setNewContent({ ...newContent, order: parseInt(e.target.value) })}
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPremium"
                  checked={newContent.isPremium}
                  onChange={(e) => setNewContent({ ...newContent, isPremium: e.target.checked })}
                />
                <Label htmlFor="isPremium">Nội dung Premium</Label>
              </div>

              <div>
                <Label htmlFor="content">Nội dung</Label>
                <Textarea
                  id="content"
                  value={newContent.content}
                  onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
                  placeholder="Nhập nội dung bài học (hỗ trợ Markdown)"
                  rows={10}
                  className="font-mono"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Hỗ trợ Markdown syntax. Với video: nhập URL YouTube/Vimeo
                </p>
              </div>

              {!lessonId && (
                <div>
                  <Label htmlFor="lessonId">Bài học</Label>
                  <Select
                    value={newContent.lessonId}
                    onValueChange={(value) => setNewContent({ ...newContent, lessonId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn bài học" />
                    </SelectTrigger>
                    <SelectContent>
                      {lessons.map((lesson) => (
                        <SelectItem key={lesson.id} value={lesson.id}>
                          {lesson.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleCreateContent}>
                Tạo nội dung
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Content Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedContent && getTypeIcon(selectedContent.type)}
                Xem nội dung - {selectedContent && getTypeLabel(selectedContent.type)}
              </DialogTitle>
              <DialogDescription>
                {selectedContent?.lessonName}
              </DialogDescription>
            </DialogHeader>
            {selectedContent && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className={getTypeColor(selectedContent.type)}>
                    {getTypeLabel(selectedContent.type)}
                  </Badge>
                  {selectedContent.isPremium && (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                  <Badge variant="outline">
                    Thứ tự: {selectedContent.order}
                  </Badge>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="whitespace-pre-wrap font-mono text-sm">
                    {selectedContent.content}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Items:</span> {selectedContent.lessonContentItemsCount || 0}
                  </div>
                  <div>
                    <span className="font-medium">Tasks:</span> {selectedContent.studyTasksCount || 0}
                  </div>
                  <div>
                    <span className="font-medium">Vocabularies:</span> {selectedContent.vocabulariesCount || 0}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewOpen(false)}>
                Đóng
              </Button>
              <Button onClick={() => {
                setIsViewOpen(false);
                setIsEditOpen(true);
              }}>
                Chỉnh sửa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Content Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa nội dung</DialogTitle>
              <DialogDescription>
                Cập nhật nội dung bài học
              </DialogDescription>
            </DialogHeader>
            {selectedContent && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-type">Loại nội dung</Label>
                    <Select
                      value={selectedContent.type}
                      onValueChange={(value) => setSelectedContent({ ...selectedContent, type: value as LessonContentTypeType })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="theory">Lý thuyết</SelectItem>
                        <SelectItem value="strategy">Mẹo làm bài</SelectItem>
                        <SelectItem value="vocabulary">Từ vựng</SelectItem>
                        <SelectItem value="quiz">Quiz/Bài tập</SelectItem>
                        <SelectItem value="explanation">Giải thích</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-order">Thứ tự</Label>
                    <Input
                      id="edit-order"
                      type="number"
                      value={selectedContent.order}
                      onChange={(e) => setSelectedContent({ ...selectedContent, order: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-isPremium"
                    checked={selectedContent.isPremium}
                    onChange={(e) => setSelectedContent({ ...selectedContent, isPremium: e.target.checked })}
                  />
                  <Label htmlFor="edit-isPremium">Nội dung Premium</Label>
                </div>

                <div>
                  <Label htmlFor="edit-content">Nội dung</Label>
                  <Textarea
                    id="edit-content"
                    value={selectedContent.content}
                    onChange={(e) => setSelectedContent({ ...selectedContent, content: e.target.value })}
                    rows={10}
                    className="font-mono"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleEditContent}>
                Cập nhật
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận xóa</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa nội dung này?
                Hành động này không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleDeleteContent}>
                Xóa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default LessonContentsPage;