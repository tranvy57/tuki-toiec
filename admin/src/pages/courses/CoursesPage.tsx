import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from '@/hooks/useCourses';
import type { Course as ApiCourse, CreateCourseDto } from '@/types/api';
import {
  BookOpen,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Users,
  DollarSign,
  Target,
  Calendar
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import {
  PageContainer,
  PageHeader,
  ListContainer,
  StatsCard,
  FilterBar,
  EmptyState
} from '@/components/common';
import { ROUTES, UI_COLORS } from '@/constants';

// Types
const CourseBand = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert'
} as const;

type CourseBandType = typeof CourseBand[keyof typeof CourseBand];

// Use API Course type
type Course = ApiCourse;

// Course band mapping for API
const mapBandToApi = (band: CourseBandType): Course['band'] => {
  switch (band) {
    case CourseBand.BEGINNER: return 'beginner';
    case CourseBand.INTERMEDIATE: return 'intermediate';
    case CourseBand.ADVANCED: return 'advanced';
    case CourseBand.EXPERT: return 'expert';
    default: return 'beginner';
  }
};

const mapBandFromApi = (band: Course['band']): CourseBandType => {
  switch (band) {
    case 'beginner': return CourseBand.BEGINNER;
    case 'intermediate': return CourseBand.INTERMEDIATE;
    case 'advanced': return CourseBand.ADVANCED;
    case 'expert': return CourseBand.EXPERT;
    default: return CourseBand.BEGINNER;
  }
};

// Helper functions
const getBandColor = (band: CourseBandType) => {
  switch (band) {
    case CourseBand.BEGINNER: return UI_COLORS.STATUS.ACTIVE;
    case CourseBand.INTERMEDIATE: return 'bg-blue-100 text-blue-800';
    case CourseBand.ADVANCED: return 'bg-orange-100 text-orange-800';
    case CourseBand.EXPERT: return 'bg-red-100 text-red-800';
    default: return UI_COLORS.STATUS.INACTIVE;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const CoursesPage = () => {
  const navigate = useNavigate();

  // API hooks
  const { data: courses = [], isLoading, error } = useCourses();
  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse();
  const deleteMutation = useDeleteCourse();

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<ApiCourse | null>(null);
  const [filterBand, setFilterBand] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form data
  const [newCourse, setNewCourse] = useState<CreateCourseDto>({
    title: '',
    band: 'beginner',
    durationDays: 60,
    price: 0,
    description: ''
  });

  // Apply filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesBand = filterBand === 'all' || course.band === filterBand;
    return matchesSearch && matchesBand;
  });

  // Calculate stats
  const stats = {
    totalCourses: courses.length,
    totalRevenue: courses.reduce((sum, course) => sum + (course.price * (course.ordersCount || 0)), 0),
    totalStudents: courses.reduce((sum, course) => sum + (course.userCoursesCount || 0), 0),
    avgPrice: courses.length > 0 ? courses.reduce((sum, course) => sum + course.price, 0) / courses.length : 0
  };

  // Event handlers
  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync(newCourse);
      setIsCreateOpen(false);
      setNewCourse({
        title: '',
        band: 'beginner',
        durationDays: 60,
        price: 0,
        description: ''
      });
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleEdit = async () => {
    if (!selectedCourse) return;

    try {
      await updateMutation.mutateAsync({
        id: selectedCourse.id,
        title: selectedCourse.title,
        band: selectedCourse.band,
        durationDays: selectedCourse.durationDays,
        price: selectedCourse.price,
        description: selectedCourse.description
      });
      setIsEditOpen(false);
      setSelectedCourse(null);
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedCourse) return;

    try {
      await deleteMutation.mutateAsync(selectedCourse.id);
      setIsDeleteOpen(false);
      setSelectedCourse(null);
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const openEdit = (course: ApiCourse) => {
    setSelectedCourse(course);
    setIsEditOpen(true);
  };

  const openDelete = (course: ApiCourse) => {
    setSelectedCourse(course);
    setIsDeleteOpen(true);
  };

  if (error) {
    return (
      <PageContainer>
        <EmptyState
          title="Có lỗi xảy ra"
          description="Không thể tải danh sách khóa học"
          icon={<Users className="h-12 w-12" />}
          action={<Button onClick={() => window.location.reload()}>Thử lại</Button>}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Quản lý Khóa học"
        description="Quản lý các khóa học TOEIC trên hệ thống"
      >
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo khóa học mới
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Tổng khóa học"
          value={stats.totalCourses}
          icon={<BookOpen className="h-8 w-8" />}
          description="Khóa học hoạt động"
        />
        <StatsCard
          title="Tổng học viên"
          value={stats.totalStudents}
          icon={<Users className="h-8 w-8" />}
          description="Học viên đã đăng ký"
        />
        <StatsCard
          title="Doanh thu"
          value={formatCurrency(stats.totalRevenue)}
          icon={<DollarSign className="h-8 w-8" />}
          description="Tổng doanh thu"
        />
        <StatsCard
          title="Giá trung bình"
          value={formatCurrency(stats.avgPrice)}
          icon={<Target className="h-8 w-8" />}
          description="Giá TB mỗi khóa học"
        />
      </div>

      {/* Course List */}
      <ListContainer
        title="Danh sách khóa học"
        description="Quản lý tất cả khóa học trên hệ thống"
      >
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Tìm kiếm khóa học..."
        >
          <Select value={filterBand} onValueChange={setFilterBand}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Mức độ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </FilterBar>

        {filteredCourses.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên khóa học</TableHead>
                <TableHead>Mức độ</TableHead>
                <TableHead>Thời lượng</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Học viên</TableHead>
                <TableHead>Phases</TableHead>
                <TableHead>Đơn hàng</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{course.title}</p>
                      <p className="text-sm text-gray-500">{course.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getBandColor(course.band)}>
                      {course.band}
                    </Badge>
                  </TableCell>
                  <TableCell>{course.durationDays} ngày</TableCell>
                  <TableCell>{formatCurrency(course.price)}</TableCell>
                  <TableCell>{course.userCoursesCount || 0}</TableCell>
                  <TableCell>{course.phasesCount || 0}</TableCell>
                  <TableCell>{course.ordersCount || 0}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => navigate(`${ROUTES.PHASES}?courseId=${course.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Xem phases
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedCourse(course);
                            setIsEditOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setSelectedCourse(course);
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
        ) : (
          <EmptyState
            icon={<BookOpen className="w-12 h-12" />}
            title="Không có khóa học"
            description="Chưa có khóa học nào được tạo. Hãy tạo khóa học đầu tiên."
            action={
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Tạo khóa học mới
              </Button>
            }
          />
        )}
      </ListContainer>

      {/* Dialogs */}

      {/* Create Course Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tạo khóa học mới</DialogTitle>
            <DialogDescription>
              Thêm khóa học TOEIC mới vào hệ thống
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Tên khóa học</Label>
              <Input
                id="title"
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                placeholder="Nhập tên khóa học"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="band">Cấp độ</Label>
                <Select
                  value={newCourse.band}
                  onValueChange={(value) => setNewCourse({ ...newCourse, band: value as CourseBandType })}
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

              <div className="grid gap-2">
                <Label htmlFor="duration">Thời lượng (ngày)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={newCourse.durationDays}
                  onChange={(e) => setNewCourse({ ...newCourse, durationDays: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">Giá (VNĐ)</Label>
              <Input
                id="price"
                type="number"
                value={newCourse.price}
                onChange={(e) => setNewCourse({ ...newCourse, price: parseInt(e.target.value) })}
                placeholder="0"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                placeholder="Mô tả chi tiết về khóa học"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Đang tạo...' : 'Tạo khóa học'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Course Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa khóa học</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin khóa học
            </DialogDescription>
          </DialogHeader>
          {selectedCourse && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Tên khóa học</Label>
                <Input
                  id="edit-title"
                  value={selectedCourse.title}
                  onChange={(e) => setSelectedCourse({ ...selectedCourse, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-band">Cấp độ</Label>
                  <Select
                    value={selectedCourse.band}
                    onValueChange={(value) => setSelectedCourse({ ...selectedCourse, band: value as CourseBandType })}
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

                <div className="grid gap-2">
                  <Label htmlFor="edit-duration">Thời lượng (ngày)</Label>
                  <Input
                    id="edit-duration"
                    type="number"
                    value={selectedCourse.durationDays}
                    onChange={(e) => setSelectedCourse({ ...selectedCourse, durationDays: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-price">Giá (VNĐ)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={selectedCourse.price}
                  onChange={(e) => setSelectedCourse({ ...selectedCourse, price: parseInt(e.target.value) })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-description">Mô tả</Label>
                <Textarea
                  id="edit-description"
                  value={selectedCourse.description}
                  onChange={(e) => setSelectedCourse({ ...selectedCourse, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleEdit} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật'}
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
              Bạn có chắc chắn muốn xóa khóa học "{selectedCourse?.title}"?
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default CoursesPage;