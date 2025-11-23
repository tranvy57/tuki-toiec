import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Book,
  Target,
  Brain,
  TestTube,
  ArrowUp,
  ArrowDown,
  FileText,
  Boxes
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
type LessonType = 'plan' | 'exercise' | 'mock' | 'review' | 'ai';

interface Lesson {
  id: string;
  name: string;
  description?: string;
  type: LessonType;
  level?: string;
  order: number;
  unitId?: string;
  unitName?: string;
  createdAt: string;
  updatedAt: string;
  // Stats from relations
  contentsCount?: number;
  skillsCount?: number;
  studyTasksCount?: number;
}

interface Unit {
  id: string;
  name: string;
}

// Mock data
const mockUnits: Unit[] = [
  { id: '1', name: 'Grammar Fundamentals' },
  { id: '2', name: 'Listening Skills' },
  { id: '3', name: 'Reading Comprehension' },
  { id: '4', name: 'Speaking Practice' }
];

const mockLessons: Lesson[] = [
  {
    id: '1',
    name: 'Present Simple vs Present Continuous',
    description: 'Học cách phân biệt và sử dụng thì hiện tại đơn và hiện tại tiếp diễn',
    type: 'plan',
    level: 'beginner',
    order: 1,
    unitId: '1',
    unitName: 'Grammar Fundamentals',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    contentsCount: 5,
    skillsCount: 2,
    studyTasksCount: 3
  },
  {
    id: '2',
    name: 'Grammar Exercise Set 1',
    description: 'Bài tập thực hành về thì hiện tại',
    type: 'exercise',
    level: 'beginner',
    order: 2,
    unitId: '1',
    unitName: 'Grammar Fundamentals',
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-22T11:15:00Z',
    contentsCount: 8,
    skillsCount: 1,
    studyTasksCount: 6
  },
  {
    id: '3',
    name: 'Part 1 - Photo Description',
    description: 'Luyện nghe và mô tả hình ảnh Part 1 TOEIC',
    type: 'plan',
    level: 'intermediate',
    order: 1,
    unitId: '2',
    unitName: 'Listening Skills',
    createdAt: '2024-01-18T08:30:00Z',
    updatedAt: '2024-11-20T16:45:00Z',
    contentsCount: 7,
    skillsCount: 3,
    studyTasksCount: 4
  },
  {
    id: '4',
    name: 'Mock Test - Listening Section',
    description: 'Đề thi thử phần Listening hoàn chỉnh',
    type: 'mock',
    level: 'intermediate',
    order: 5,
    unitId: '2',
    unitName: 'Listening Skills',
    createdAt: '2024-01-20T14:00:00Z',
    updatedAt: '2024-01-25T10:20:00Z',
    contentsCount: 12,
    skillsCount: 4,
    studyTasksCount: 10
  },
  {
    id: '5',
    name: 'AI Speaking Practice',
    description: 'Luyện nói với AI mentor',
    type: 'ai',
    level: 'advanced',
    order: 1,
    unitId: '4',
    unitName: 'Speaking Practice',
    createdAt: '2024-02-01T11:30:00Z',
    updatedAt: '2024-11-22T09:10:00Z',
    contentsCount: 3,
    skillsCount: 2,
    studyTasksCount: 5
  }
];

const LessonsPage = () => {
  const navigate = useNavigate();
  const { phaseId } = useParams<{ phaseId: string }>();
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons);
  const [units] = useState<Unit[]>(mockUnits);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterUnit, setFilterUnit] = useState<string>('all');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // New lesson form
  const [newLesson, setNewLesson] = useState<Partial<Lesson>>({
    name: '',
    description: '',
    type: 'plan',
    level: 'beginner',
    order: 0,
    unitId: ''
  });

  // Filter lessons
  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || lesson.type === filterType;
    const matchesLevel = filterLevel === 'all' || lesson.level === filterLevel;
    const matchesUnit = filterUnit === 'all' || lesson.unitId === filterUnit;
    return matchesSearch && matchesType && matchesLevel && matchesUnit;
  }).sort((a, b) => a.order - b.order);

  // Calculate stats
  const totalLessons = filteredLessons.length;
  const planLessons = filteredLessons.filter(l => l.type === 'plan').length;
  const exerciseLessons = filteredLessons.filter(l => l.type === 'exercise').length;
  const mockLessonsCount = filteredLessons.filter(l => l.type === 'mock').length;

  const getTypeColor = (type: LessonType) => {
    switch (type) {
      case 'plan': return 'bg-blue-100 text-blue-800';
      case 'exercise': return 'bg-green-100 text-green-800';
      case 'mock': return 'bg-red-100 text-red-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'ai': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: LessonType) => {
    switch (type) {
      case 'plan': return <Book className="w-4 h-4" />;
      case 'exercise': return <Target className="w-4 h-4" />;
      case 'mock': return <TestTube className="w-4 h-4" />;
      case 'review': return <FileText className="w-4 h-4" />;
      case 'ai': return <Brain className="w-4 h-4" />;
      default: return <Book className="w-4 h-4" />;
    }
  };

  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateLesson = async () => {
    try {
      // TODO: Call API to create lesson
      const lesson: Lesson = {
        ...newLesson as Lesson,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        contentsCount: 0,
        skillsCount: 0,
        studyTasksCount: 0
      };
      setLessons([...lessons, lesson]);
      setIsCreateOpen(false);
      setNewLesson({
        name: '',
        description: '',
        type: 'plan',
        level: 'beginner',
        order: 0,
        unitId: ''
      });
    } catch (error) {
      console.error('Failed to create lesson:', error);
    }
  };

  const handleEditLesson = async () => {
    try {
      // TODO: Call API to update lesson
      setLessons(lessons.map(lesson =>
        lesson.id === selectedLesson?.id ? { ...selectedLesson, updatedAt: new Date().toISOString() } : lesson
      ));
      setIsEditOpen(false);
      setSelectedLesson(null);
    } catch (error) {
      console.error('Failed to update lesson:', error);
    }
  };

  const handleDeleteLesson = async () => {
    try {
      // TODO: Call API to delete lesson
      setLessons(lessons.filter(lesson => lesson.id !== selectedLesson?.id));
      setIsDeleteOpen(false);
      setSelectedLesson(null);
    } catch (error) {
      console.error('Failed to delete lesson:', error);
    }
  };

  const handleUpdateOrder = async (lessonId: string, direction: 'up' | 'down') => {
    try {
      // TODO: Implement order update logic
      const lessonIndex = lessons.findIndex(l => l.id === lessonId);
      if (
        (direction === 'up' && lessonIndex > 0) ||
        (direction === 'down' && lessonIndex < lessons.length - 1)
      ) {
        const newLessons = [...lessons];
        const targetIndex = direction === 'up' ? lessonIndex - 1 : lessonIndex + 1;
        [newLessons[lessonIndex], newLessons[targetIndex]] = [newLessons[targetIndex], newLessons[lessonIndex]];

        // Update order values
        newLessons[lessonIndex].order = targetIndex + 1;
        newLessons[targetIndex].order = lessonIndex + 1;

        setLessons(newLessons);
      }
    } catch (error) {
      console.error('Failed to update lesson order:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý Bài học</h1>
            <p className="text-gray-600">
              Quản lý các bài học trong course
              {phaseId && ` - Phase ID: ${phaseId}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate('/phases')}>
              ← Quay lại Phases
            </Button>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Tạo bài học mới
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Boxes className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng bài học</p>
                  <p className="text-2xl font-bold text-gray-900">{totalLessons}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Book className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Lý thuyết</p>
                  <p className="text-2xl font-bold text-gray-900">{planLessons}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Target className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Bài tập</p>
                  <p className="text-2xl font-bold text-gray-900">{exerciseLessons}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TestTube className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Mock Test</p>
                  <p className="text-2xl font-bold text-gray-900">{mockLessonsCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Danh sách bài học</CardTitle>
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Tìm kiếm bài học..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>

                {/* Type Filter */}
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Loại bài học" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="plan">Lý thuyết</SelectItem>
                    <SelectItem value="exercise">Bài tập</SelectItem>
                    <SelectItem value="mock">Mock Test</SelectItem>
                    <SelectItem value="review">Ôn tập</SelectItem>
                    <SelectItem value="ai">AI Practice</SelectItem>
                  </SelectContent>
                </Select>

                {/* Level Filter */}
                <Select value={filterLevel} onValueChange={setFilterLevel}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Cấp độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>

                {/* Unit Filter */}
                <Select value={filterUnit} onValueChange={setFilterUnit}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả Units</SelectItem>
                    {units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thứ tự</TableHead>
                  <TableHead>Tên bài học</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Cấp độ</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Tasks</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLessons.map((lesson, index) => (
                  <TableRow key={lesson.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-lg">{lesson.order}</span>
                        <div className="flex flex-col gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => handleUpdateOrder(lesson.id, 'up')}
                            disabled={index === 0}
                          >
                            <ArrowUp className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => handleUpdateOrder(lesson.id, 'down')}
                            disabled={index === filteredLessons.length - 1}
                          >
                            <ArrowDown className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{lesson.name}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {lesson.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(lesson.type)}>
                        <div className="flex items-center gap-1">
                          {getTypeIcon(lesson.type)}
                          {lesson.type.toUpperCase()}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {lesson.level && (
                        <Badge className={getLevelColor(lesson.level)}>
                          {lesson.level.toUpperCase()}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{lesson.unitName}</span>
                    </TableCell>
                    <TableCell>{lesson.contentsCount || 0}</TableCell>
                    <TableCell>{lesson.skillsCount || 0}</TableCell>
                    <TableCell>{lesson.studyTasksCount || 0}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => navigate(`/lessons/${lesson.id}/contents`)}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Quản lý Nội dung
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedLesson(lesson);
                              setIsEditOpen(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setSelectedLesson(lesson);
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

            {filteredLessons.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Boxes className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Không tìm thấy bài học nào.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Lesson Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tạo bài học mới</DialogTitle>
              <DialogDescription>
                Thêm bài học mới vào hệ thống
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="name">Tên bài học</Label>
                <Input
                  id="name"
                  value={newLesson.name}
                  onChange={(e) => setNewLesson({ ...newLesson, name: e.target.value })}
                  placeholder="Nhập tên bài học"
                />
              </div>
              <div>
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={newLesson.description}
                  onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                  placeholder="Nhập mô tả bài học"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Loại bài học</Label>
                  <Select
                    value={newLesson.type}
                    onValueChange={(value) => setNewLesson({ ...newLesson, type: value as LessonType })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plan">Lý thuyết</SelectItem>
                      <SelectItem value="exercise">Bài tập</SelectItem>
                      <SelectItem value="mock">Mock Test</SelectItem>
                      <SelectItem value="review">Ôn tập</SelectItem>
                      <SelectItem value="ai">AI Practice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="level">Cấp độ</Label>
                  <Select
                    value={newLesson.level}
                    onValueChange={(value) => setNewLesson({ ...newLesson, level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn cấp độ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="order">Thứ tự</Label>
                  <Input
                    id="order"
                    type="number"
                    value={newLesson.order}
                    onChange={(e) => setNewLesson({ ...newLesson, order: parseInt(e.target.value) })}
                    placeholder="1"
                  />
                </div>
                <div>
                  <Label htmlFor="unitId">Unit</Label>
                  <Select
                    value={newLesson.unitId}
                    onValueChange={(value) => setNewLesson({ ...newLesson, unitId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleCreateLesson}>
                Tạo bài học
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Lesson Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa bài học</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin bài học {selectedLesson?.name}
              </DialogDescription>
            </DialogHeader>
            {selectedLesson && (
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="edit-name">Tên bài học</Label>
                  <Input
                    id="edit-name"
                    value={selectedLesson.name}
                    onChange={(e) => setSelectedLesson({ ...selectedLesson, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Mô tả</Label>
                  <Textarea
                    id="edit-description"
                    value={selectedLesson.description || ''}
                    onChange={(e) => setSelectedLesson({ ...selectedLesson, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-type">Loại bài học</Label>
                    <Select
                      value={selectedLesson.type}
                      onValueChange={(value) => setSelectedLesson({ ...selectedLesson, type: value as LessonType })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plan">Lý thuyết</SelectItem>
                        <SelectItem value="exercise">Bài tập</SelectItem>
                        <SelectItem value="mock">Mock Test</SelectItem>
                        <SelectItem value="review">Ôn tập</SelectItem>
                        <SelectItem value="ai">AI Practice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-level">Cấp độ</Label>
                    <Select
                      value={selectedLesson.level || ''}
                      onValueChange={(value) => setSelectedLesson({ ...selectedLesson, level: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-order">Thứ tự</Label>
                  <Input
                    id="edit-order"
                    type="number"
                    value={selectedLesson.order}
                    onChange={(e) => setSelectedLesson({ ...selectedLesson, order: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleEditLesson}>
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
                Bạn có chắc chắn muốn xóa bài học "{selectedLesson?.name}"?
                Hành động này không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleDeleteLesson}>
                Xóa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default LessonsPage;