import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    Filter
} from 'lucide-react';

// New refactored components
import {
    PageContainer,
    PageHeader,
    ContentWrapper,
    StatsGrid,
    StatCard,
    Panel,
    FlexContainer,
    EmptyState
} from '@/components/common';

// UI Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
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

// Custom hooks
import { usePage, useModal } from '@/hooks/useAdmin';

// Constants
import { ADMIN_ROUTES } from '@/constants';

interface Course {
    id: string;
    title: string;
    description: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    price: number;
    enrollments: number;
    status: 'active' | 'inactive' | 'draft';
    createdAt: string;
}

// Custom hook for courses data
const useCourses = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Mock data - replace with actual API call
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                const mockCourses: Course[] = [
                    {
                        id: '1',
                        title: 'TOEIC Fundamentals 550+',
                        description: 'Khóa học cơ bản cho người mới bắt đầu',
                        level: 'Beginner',
                        price: 599000,
                        enrollments: 428,
                        status: 'active',
                        createdAt: '2024-01-15',
                    },
                    {
                        id: '2',
                        title: 'TOEIC Premium 750+',
                        description: 'Khóa học nâng cao cho mục tiêu 750+',
                        level: 'Intermediate',
                        price: 899000,
                        enrollments: 312,
                        status: 'active',
                        createdAt: '2024-02-10',
                    },
                ];

                setCourses(mockCourses);
            } catch (err) {
                setError('Không thể tải dữ liệu khóa học');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return { courses, loading, error, refetch: () => { } };
};

export function CoursesPage() {
    const navigate = useNavigate();
    const { setPage } = usePage();
    // const { isOpen, open, close } = useModal();
    const { courses, loading, error } = useCourses();

    // Local state for filters
    const [filters, setFilters] = useState({
        search: '',
        level: '',
        status: '',
    });

    useEffect(() => {
        setPage('Quản lý khóa học', [
            { title: 'Dashboard', href: ADMIN_ROUTES.DASHBOARD },
            { title: 'Nội dung học tập' },
            { title: 'Khóa học' },
        ]);
    }, []); // Empty dependency array since setPage is stable

    // Statistics
    const stats = {
        total: courses.length,
        active: courses.filter(c => c.status === 'active').length,
        totalEnrollments: courses.reduce((sum, c) => sum + c.enrollments, 0),
        revenue: courses.reduce((sum, c) => sum + (c.price * c.enrollments), 0),
    };

    // Filtered courses
    const filteredCourses = courses.filter(course => {
        const matchSearch = course.title.toLowerCase().includes(filters.search.toLowerCase());
        const matchLevel = !filters.level || course.level === filters.level;
        const matchStatus = !filters.status || course.status === filters.status;
        return matchSearch && matchLevel && matchStatus;
    });

    const handleDelete = (courseId: string) => {
        // Implement delete logic
        console.log('Delete course:', courseId);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'inactive': return 'bg-red-100 text-red-800';
            case 'draft': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Beginner': return 'bg-blue-100 text-blue-800';
            case 'Intermediate': return 'bg-purple-100 text-purple-800';
            case 'Advanced': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <PageContainer>
                <ContentWrapper>
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                        <div className="grid grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-24 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                        <div className="h-96 bg-gray-200 rounded"></div>
                    </div>
                </ContentWrapper>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer>
                <EmptyState
                    title="Có lỗi xảy ra"
                    description={error}
                    action={
                        <Button onClick={() => window.location.reload()}>
                            Thử lại
                        </Button>
                    }
                />
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <ContentWrapper>
                <PageHeader
                    title="Quản lý khóa học"
                    description="Quản lý tất cả khóa học TOEIC trong hệ thống"
                >
                    <Button onClick={() => navigate('/courses/create')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Tạo khóa học
                    </Button>
                </PageHeader>

                {/* Statistics */}
                <StatsGrid cols={4}>
                    <StatCard
                        title="Tổng khóa học"
                        value={stats.total}
                        icon={BookOpen}
                        variant="minimal"
                    />
                    <StatCard
                        title="Đang hoạt động"
                        value={stats.active}
                        icon={Target}
                        variant="minimal"
                    />
                    <StatCard
                        title="Học viên đăng ký"
                        value={stats.totalEnrollments.toLocaleString()}
                        icon={Users}
                        variant="minimal"
                    />
                    <StatCard
                        title="Doanh thu"
                        value={`${(stats.revenue / 1000000).toFixed(1)}M`}
                        icon={DollarSign}
                        variant="minimal"
                    />
                </StatsGrid>

                {/* Filters */}
                <Panel>
                    <FlexContainer wrap gap="md" align="end">
                        <div className="flex-1 min-w-0">
                            <Input
                                placeholder="Tìm kiếm khóa học..."
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                className="max-w-sm"
                            />
                        </div>

                        <Select
                            value={filters.level}
                            onValueChange={(value) => setFilters(prev => ({ ...prev, level: value }))}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Mức độ" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">Tất cả mức độ</SelectItem>
                                <SelectItem value="Beginner">Beginner</SelectItem>
                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                <SelectItem value="Advanced">Advanced</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.status}
                            onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">Tất cả trạng thái</SelectItem>
                                <SelectItem value="active">Hoạt động</SelectItem>
                                <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                                <SelectItem value="draft">Bản nháp</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="outline" size="sm">
                            <Filter className="w-4 h-4 mr-2" />
                            Lọc nâng cao
                        </Button>
                    </FlexContainer>
                </Panel>

                {/* Courses Table */}
                <Panel title={`Khóa học (${filteredCourses.length})`} variant="card">
                    {filteredCourses.length === 0 ? (
                        <EmptyState
                            title="Không có khóa học nào"
                            description="Chưa có khóa học nào được tạo hoặc không có khóa học nào phù hợp với bộ lọc."
                            action={
                                <Button onClick={() => navigate('/courses/create')}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Tạo khóa học đầu tiên
                                </Button>
                            }
                        />
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Khóa học</TableHead>
                                    <TableHead>Mức độ</TableHead>
                                    <TableHead>Giá</TableHead>
                                    <TableHead>Học viên</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead>Ngày tạo</TableHead>
                                    <TableHead className="w-20"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCourses.map((course) => (
                                    <TableRow key={course.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{course.title}</p>
                                                <p className="text-sm text-gray-500">{course.description}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getLevelColor(course.level)}>
                                                {course.level}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{course.price.toLocaleString()}đ</TableCell>
                                        <TableCell>{course.enrollments}</TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(course.status)}>
                                                {course.status === 'active' ? 'Hoạt động' :
                                                    course.status === 'inactive' ? 'Ngừng hoạt động' : 'Bản nháp'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{course.createdAt}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => navigate(`/courses/${course.id}`)}>
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        Xem chi tiết
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => navigate(`/courses/${course.id}/edit`)}>
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Chỉnh sửa
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(course.id)}
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Xóa
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </Panel>
            </ContentWrapper>
        </PageContainer>
    );
}