import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useTests, useCreateTest, useDeleteTest } from '@/hooks/useTests';
import type { Test as ApiTest } from '@/types/api';
import { toast } from 'sonner';
import {
  FileText,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Test {
  id: string;
  title: string;
  type: 'listening' | 'reading' | 'speaking' | 'writing' | 'full';
  questionsCount: number;
  duration: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

const mockTests: Test[] = [
  {
    id: '1',
    title: 'TOEIC Practice Test - Part 1',
    type: 'listening',
    questionsCount: 30,
    duration: 45,
    difficulty: 'medium',
    status: 'published',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    title: 'Reading Comprehension Test',
    type: 'reading',
    questionsCount: 50,
    duration: 75,
    difficulty: 'hard',
    status: 'published',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  },
  {
    id: '3',
    title: 'Full TOEIC Mock Test',
    type: 'full',
    questionsCount: 200,
    duration: 120,
    difficulty: 'hard',
    status: 'draft',
    createdAt: '2024-01-22',
    updatedAt: '2024-01-22'
  }
];

const TestsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // API hooks - sử dụng API thực thay vì mock data
  const { data: apiTests = [], isLoading, error } = useTests();
  const createMutation = useCreateTest();
  const deleteMutation = useDeleteTest();

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa đề thi "${title}"?`)) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success('Xóa đề thi thành công!', {
          description: `Đề thi "${title}" đã được xóa khỏi hệ thống.`
        });
      } catch (error) {
        toast.error('Có lỗi xảy ra khi xóa đề thi', {
          description: 'Vui lòng thử lại sau.'
        });
      }
    }
  };

  // Convert API data to display format
  const tests: Test[] = apiTests.map(test => ({
    id: test.id,
    title: test.title,
    type: test.type || 'full' as const,
    questionsCount: test.questionsCount || 0,
    duration: test.duration || 120,
    difficulty: test.difficulty || 'medium' as const,
    status: test.status || 'draft' as const,
    createdAt: test.createdAt,
    updatedAt: test.updatedAt || test.createdAt,
  }));

  const getTypeColor = (type: Test['type']) => {
    switch (type) {
      case 'listening': return 'bg-blue-100 text-blue-800';
      case 'reading': return 'bg-green-100 text-green-800';
      case 'speaking': return 'bg-yellow-100 text-yellow-800';
      case 'writing': return 'bg-purple-100 text-purple-800';
      case 'full': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: Test['status']) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: Test['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || test.type === filterType;
    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">Lỗi tải dữ liệu đề thi</p>
            <Button onClick={() => window.location.reload()}>Thử lại</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý đề thi</h1>
        </div>
        <div className="flex gap-3">
          <Button className="flex items-center gap-2" onClick={() => navigate('/tests/create')}>
            <Plus className="w-4 h-4" />
            Tạo đề thi mới
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách đề thi</CardTitle>
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search tests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              {/* Type Filter */}
              {/* <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="listening">Listening</option>
                <option value="reading">Reading</option>
                <option value="speaking">Speaking</option>
                <option value="writing">Writing</option>
                <option value="full">Full Test</option>
              </select> */}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên đề thi</TableHead>
                <TableHead>Loại đề thi</TableHead>
                <TableHead>Số câu hỏi</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Khó khăn</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày cập nhật</TableHead>
                <TableHead className="w-[100px]">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      {test.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(test.type)}>
                      {test.type.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>200</TableCell>
                  <TableCell>{test.duration} min</TableCell>
                  <TableCell>
                    <Badge className={getDifficultyColor(test.difficulty)}>
                      {test.difficulty.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(test.status)}>
                      {test.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(test.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="flex items-center gap-2"
                          onClick={() => navigate(`/tests/${test.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Edit className="w-4 h-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(test.id, test.title)}
                          className="flex items-center gap-2 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredTests.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No tests found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestsPage;