import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Layers3,
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Play,
  CheckCircle,
  Lock,
  ArrowUp,
  ArrowDown,
  BookOpen
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
type PhaseStatus = 'locked' | 'active' | 'done';

interface Phase {
  id: string;
  title: string;
  status: PhaseStatus;
  order: number;
  flag?: string;
  startAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  courseId: string;
  courseName?: string;
  // Stats from relations
  lessonsCount?: number;
  completedLessonsCount?: number;
}

interface Course {
  id: string;
  title: string;
}

// Mock data
const mockCourses: Course[] = [
  { id: '1', title: 'TOEIC Complete Course - Beginner to Advanced' },
  { id: '2', title: 'TOEIC Reading Mastery' },
  { id: '3', title: 'TOEIC Speaking & Writing Premium' }
];

const mockPhases: Phase[] = [
  {
    id: '1',
    title: 'Foundation Grammar',
    status: 'done',
    order: 1,
    flag: 'foundation',
    startAt: '2024-01-15T10:00:00Z',
    completedAt: '2024-01-25T15:30:00Z',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-25T15:30:00Z',
    courseId: '1',
    courseName: 'TOEIC Complete Course - Beginner to Advanced',
    lessonsCount: 12,
    completedLessonsCount: 12
  },
  {
    id: '2',
    title: 'Basic Listening Skills',
    status: 'active',
    order: 2,
    flag: 'listening',
    startAt: '2024-01-26T10:00:00Z',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-11-20T14:20:00Z',
    courseId: '1',
    courseName: 'TOEIC Complete Course - Beginner to Advanced',
    lessonsCount: 15,
    completedLessonsCount: 8
  },
  {
    id: '3',
    title: 'Reading Comprehension',
    status: 'locked',
    order: 3,
    flag: 'reading',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z',
    courseId: '1',
    courseName: 'TOEIC Complete Course - Beginner to Advanced',
    lessonsCount: 18,
    completedLessonsCount: 0
  },
  {
    id: '4',
    title: 'Mock Test Practice',
    status: 'locked',
    order: 4,
    flag: 'mock_test',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z',
    courseId: '1',
    courseName: 'TOEIC Complete Course - Beginner to Advanced',
    lessonsCount: 6,
    completedLessonsCount: 0
  }
];

const PhasesPage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const [phases, setPhases] = useState<Phase[]>(mockPhases);
  const [courses] = useState<Course[]>(mockCourses);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCourse, setFilterCourse] = useState<string>(courseId || 'all');
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // New phase form
  const [newPhase, setNewPhase] = useState<Partial<Phase>>({
    title: '',
    status: 'locked',
    order: 0,
    flag: '',
    courseId: courseId || ''
  });

  // Filter phases
  const filteredPhases = phases.filter(phase => {
    const matchesSearch = phase.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phase.flag?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || phase.status === filterStatus;
    const matchesCourse = filterCourse === 'all' || phase.courseId === filterCourse;
    return matchesSearch && matchesStatus && matchesCourse;
  }).sort((a, b) => a.order - b.order);

  // Calculate stats
  const totalPhases = filteredPhases.length;
  const activePhases = filteredPhases.filter(p => p.status === 'active').length;
  const completedPhases = filteredPhases.filter(p => p.status === 'done').length;
  const lockedPhases = filteredPhases.filter(p => p.status === 'locked').length;

  const getStatusColor = (status: PhaseStatus) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'locked': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: PhaseStatus) => {
    switch (status) {
      case 'done': return <CheckCircle className="w-4 h-4" />;
      case 'active': return <Play className="w-4 h-4" />;
      case 'locked': return <Lock className="w-4 h-4" />;
      default: return <Lock className="w-4 h-4" />;
    }
  };

  const getFlagColor = (flag?: string) => {
    switch (flag) {
      case 'foundation': return 'bg-blue-100 text-blue-800';
      case 'listening': return 'bg-green-100 text-green-800';
      case 'reading': return 'bg-purple-100 text-purple-800';
      case 'speaking': return 'bg-orange-100 text-orange-800';
      case 'writing': return 'bg-red-100 text-red-800';
      case 'mock_test': return 'bg-yellow-100 text-yellow-800';
      case 'review': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressPercentage = (completed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const handleCreatePhase = async () => {
    try {
      // TODO: Call API to create phase
      const phase: Phase = {
        ...newPhase as Phase,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lessonsCount: 0,
        completedLessonsCount: 0
      };
      setPhases([...phases, phase]);
      setIsCreateOpen(false);
      setNewPhase({
        title: '',
        status: 'locked',
        order: 0,
        flag: '',
        courseId: courseId || ''
      });
    } catch (error) {
      console.error('Failed to create phase:', error);
    }
  };

  const handleEditPhase = async () => {
    try {
      // TODO: Call API to update phase
      setPhases(phases.map(phase =>
        phase.id === selectedPhase?.id ? { ...selectedPhase, updatedAt: new Date().toISOString() } : phase
      ));
      setIsEditOpen(false);
      setSelectedPhase(null);
    } catch (error) {
      console.error('Failed to update phase:', error);
    }
  };

  const handleDeletePhase = async () => {
    try {
      // TODO: Call API to delete phase
      setPhases(phases.filter(phase => phase.id !== selectedPhase?.id));
      setIsDeleteOpen(false);
      setSelectedPhase(null);
    } catch (error) {
      console.error('Failed to delete phase:', error);
    }
  };

  const handleUpdateOrder = async (phaseId: string, direction: 'up' | 'down') => {
    try {
      // TODO: Implement order update logic
      const phaseIndex = phases.findIndex(p => p.id === phaseId);
      if (
        (direction === 'up' && phaseIndex > 0) ||
        (direction === 'down' && phaseIndex < phases.length - 1)
      ) {
        const newPhases = [...phases];
        const targetIndex = direction === 'up' ? phaseIndex - 1 : phaseIndex + 1;
        [newPhases[phaseIndex], newPhases[targetIndex]] = [newPhases[targetIndex], newPhases[phaseIndex]];

        // Update order values
        newPhases[phaseIndex].order = targetIndex + 1;
        newPhases[targetIndex].order = phaseIndex + 1;

        setPhases(newPhases);
      }
    } catch (error) {
      console.error('Failed to update phase order:', error);
    }
  };

  const handleStatusChange = async (phaseId: string, newStatus: PhaseStatus) => {
    try {
      // TODO: Call API to update phase status
      setPhases(phases.map(phase => {
        if (phase.id === phaseId) {
          const updates: Partial<Phase> = {
            status: newStatus,
            updatedAt: new Date().toISOString()
          };

          if (newStatus === 'active' && !phase.startAt) {
            updates.startAt = new Date().toISOString();
          }

          if (newStatus === 'done' && !phase.completedAt) {
            updates.completedAt = new Date().toISOString();
          }

          return { ...phase, ...updates };
        }
        return phase;
      }));
    } catch (error) {
      console.error('Failed to update phase status:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý Phase</h1>
            <p className="text-gray-600">
              Quản lý các giai đoạn học tập trong khóa học
              {courseId && ` - ${courses.find(c => c.id === courseId)?.title}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate('/courses')}>
              ← Quay lại Khóa học
            </Button>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Tạo Phase mới
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Layers3 className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng phases</p>
                  <p className="text-2xl font-bold text-gray-900">{totalPhases}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Play className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                  <p className="text-2xl font-bold text-gray-900">{activePhases}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Hoàn thành</p>
                  <p className="text-2xl font-bold text-gray-900">{completedPhases}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Lock className="h-8 w-8 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Khóa</p>
                  <p className="text-2xl font-bold text-gray-900">{lockedPhases}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Danh sách Phase</CardTitle>
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Tìm kiếm phase..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>

                {/* Status Filter */}
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="locked">Khóa</SelectItem>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="done">Hoàn thành</SelectItem>
                  </SelectContent>
                </Select>

                {/* Course Filter */}
                {!courseId && (
                  <Select value={filterCourse} onValueChange={setFilterCourse}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Khóa học" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả khóa học</SelectItem>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
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
                  <TableHead>Tên Phase</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Flag</TableHead>
                  <TableHead>Tiến độ</TableHead>
                  <TableHead>Ngày bắt đầu</TableHead>
                  <TableHead>Ngày hoàn thành</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPhases.map((phase, index) => (
                  <TableRow key={phase.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-lg">{phase.order}</span>
                        <div className="flex flex-col gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => handleUpdateOrder(phase.id, 'up')}
                            disabled={index === 0}
                          >
                            <ArrowUp className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => handleUpdateOrder(phase.id, 'down')}
                            disabled={index === filteredPhases.length - 1}
                          >
                            <ArrowDown className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{phase.title}</p>
                        {!courseId && (
                          <p className="text-sm text-gray-500">{phase.courseName}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(phase.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(phase.status)}
                          {phase.status.toUpperCase()}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {phase.flag && (
                        <Badge className={getFlagColor(phase.flag)}>
                          {phase.flag}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${getProgressPercentage(phase.completedLessonsCount || 0, phase.lessonsCount || 0)}%`
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {phase.completedLessonsCount || 0}/{phase.lessonsCount || 0}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(phase.startAt)}</TableCell>
                    <TableCell>{formatDate(phase.completedAt)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => navigate(`/phases/${phase.id}/lessons`)}
                          >
                            <BookOpen className="mr-2 h-4 w-4" />
                            Quản lý Lessons
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(phase.id, 'active')}
                            disabled={phase.status === 'active'}
                          >
                            <Play className="mr-2 h-4 w-4" />
                            Kích hoạt
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(phase.id, 'done')}
                            disabled={phase.status === 'done'}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Đánh dấu hoàn thành
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(phase.id, 'locked')}
                            disabled={phase.status === 'locked'}
                          >
                            <Lock className="mr-2 h-4 w-4" />
                            Khóa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedPhase(phase);
                              setIsEditOpen(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setSelectedPhase(phase);
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

            {filteredPhases.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Layers3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Không tìm thấy phase nào.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Phase Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tạo Phase mới</DialogTitle>
              <DialogDescription>
                Thêm giai đoạn học tập mới vào khóa học
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="title">Tên Phase</Label>
                <Input
                  id="title"
                  value={newPhase.title}
                  onChange={(e) => setNewPhase({ ...newPhase, title: e.target.value })}
                  placeholder="Nhập tên phase"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select
                    value={newPhase.status}
                    onValueChange={(value) => setNewPhase({ ...newPhase, status: value as PhaseStatus })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="locked">Khóa</SelectItem>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="done">Hoàn thành</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="order">Thứ tự</Label>
                  <Input
                    id="order"
                    type="number"
                    value={newPhase.order}
                    onChange={(e) => setNewPhase({ ...newPhase, order: parseInt(e.target.value) })}
                    placeholder="1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="flag">Flag (tùy chọn)</Label>
                <Input
                  id="flag"
                  value={newPhase.flag}
                  onChange={(e) => setNewPhase({ ...newPhase, flag: e.target.value })}
                  placeholder="foundation, listening, reading, ..."
                />
              </div>
              {!courseId && (
                <div>
                  <Label htmlFor="courseId">Khóa học</Label>
                  <Select
                    value={newPhase.courseId}
                    onValueChange={(value) => setNewPhase({ ...newPhase, courseId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn khóa học" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
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
              <Button onClick={handleCreatePhase}>
                Tạo Phase
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Phase Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa Phase</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin phase {selectedPhase?.title}
              </DialogDescription>
            </DialogHeader>
            {selectedPhase && (
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="edit-title">Tên Phase</Label>
                  <Input
                    id="edit-title"
                    value={selectedPhase.title}
                    onChange={(e) => setSelectedPhase({ ...selectedPhase, title: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-status">Trạng thái</Label>
                    <Select
                      value={selectedPhase.status}
                      onValueChange={(value) => setSelectedPhase({ ...selectedPhase, status: value as PhaseStatus })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="locked">Khóa</SelectItem>
                        <SelectItem value="active">Hoạt động</SelectItem>
                        <SelectItem value="done">Hoàn thành</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-order">Thứ tự</Label>
                    <Input
                      id="edit-order"
                      type="number"
                      value={selectedPhase.order}
                      onChange={(e) => setSelectedPhase({ ...selectedPhase, order: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-flag">Flag</Label>
                  <Input
                    id="edit-flag"
                    value={selectedPhase.flag || ''}
                    onChange={(e) => setSelectedPhase({ ...selectedPhase, flag: e.target.value })}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleEditPhase}>
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
                Bạn có chắc chắn muốn xóa phase "{selectedPhase?.title}"?
                Hành động này không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleDeletePhase}>
                Xóa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PhasesPage;