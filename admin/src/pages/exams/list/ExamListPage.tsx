import { useState } from 'react';
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Link } from 'react-router-dom';

// Mock data
const mockExams = [
  {
    id: '1',
    title: 'TOEIC Practice Test 01',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    totalQuestions: 200,
    parts: 7,
    status: 'active',
    students: 45,
  },
  {
    id: '2',
    title: 'TOEIC Mock Test 08',
    createdAt: '2024-01-14T09:15:00Z',
    updatedAt: '2024-01-14T16:45:00Z',
    totalQuestions: 200,
    parts: 7,
    status: 'draft',
    students: 0,
  },
  {
    id: '3',
    title: 'TOEIC Sample Test 22',
    createdAt: '2024-01-13T11:00:00Z',
    updatedAt: '2024-01-13T15:30:00Z',
    totalQuestions: 200,
    parts: 7,
    status: 'completed',
    students: 58,
  },
  {
    id: '4',
    title: 'TOEIC Practice Test 14',
    createdAt: '2024-01-12T08:45:00Z',
    updatedAt: '2024-01-12T17:20:00Z',
    totalQuestions: 200,
    parts: 7,
    status: 'active',
    students: 41,
  },
];

export default function ExamListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredExams = mockExams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || exam.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Đang hoạt động', className: 'bg-success-light text-success' },
      draft: { label: 'Nháp', className: 'bg-warning-light text-warning' },
      completed: { label: 'Hoàn thành', className: 'bg-warm-gray-100 text-warm-gray-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-warm-gray-900">Danh sách đề thi</h1>
          <p className="text-warm-gray-600">Quản lý tất cả các đề thi TOEIC</p>
        </div>
        <Link to="/exams/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tạo đề thi mới
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm và lọc</CardTitle>
          <CardDescription>
            Tìm kiếm đề thi theo tên hoặc lọc theo trạng thái
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-warm-gray-400" />
                <Input
                  placeholder="Tìm kiếm đề thi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background text-sm"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="draft">Nháp</option>
              <option value="completed">Hoàn thành</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Exams Table */}
      <Card>
        <CardHeader>
          <CardTitle>Đề thi ({filteredExams.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên đề thi</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Câu hỏi</TableHead>
                <TableHead>Thí sinh</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Ngày cập nhật</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{exam.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {exam.parts} phần thi
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(exam.status)}
                  </TableCell>
                  <TableCell>{exam.totalQuestions}</TableCell>
                  <TableCell>{exam.students}</TableCell>
                  <TableCell>{formatDate(exam.createdAt)}</TableCell>
                  <TableCell>{formatDate(exam.updatedAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredExams.length === 0 && (
            <div className="text-center py-8">
              <p className="text-warm-gray-500">
                {searchTerm || selectedStatus !== 'all' 
                  ? 'Không tìm thấy đề thi nào phù hợp với bộ lọc.' 
                  : 'Chưa có đề thi nào. Hãy tạo đề thi đầu tiên!'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
