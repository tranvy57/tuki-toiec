import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Clock, TrendingUp } from 'lucide-react';

const stats = [
  {
    name: 'Tổng số đề thi',
    value: '124',
    change: '+12%',
    changeType: 'increase',
    icon: FileText,
  },
  {
    name: 'Thí sinh đã làm bài',
    value: '2,847',
    change: '+18%',
    changeType: 'increase',
    icon: Users,
  },
  {
    name: 'Thời gian trung bình',
    value: '98 phút',
    change: '-5%',
    changeType: 'decrease',
    icon: Clock,
  },
  {
    name: 'Điểm trung bình',
    value: '745',
    change: '+8%',
    changeType: 'increase',
    icon: TrendingUp,
  },
];

const recentExams = [
  {
    id: '1',
    title: 'TOEIC Practice Test 15',
    createdAt: '2024-01-15',
    students: 45,
    status: 'active',
  },
  {
    id: '2',
    title: 'TOEIC Mock Test 08',
    createdAt: '2024-01-14',
    students: 32,
    status: 'active',
  },
  {
    id: '3',
    title: 'TOEIC Sample Test 22',
    createdAt: '2024-01-13',
    students: 58,
    status: 'completed',
  },
  {
    id: '4',
    title: 'TOEIC Practice Test 14',
    createdAt: '2024-01-12',
    students: 41,
    status: 'completed',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <p className='' style={{color: 'red'}}>hello</p>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-warm-gray-900">Dashboard</h1>
        <p className="text-warm-gray-600">Chào mừng bạn đến với hệ thống quản lý đề thi TOEIC</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${
                stat.changeType === 'increase' ? 'text-success' : 'text-warning'
              }`}>
                {stat.change} so với tháng trước
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Exams */}
        <Card>
          <CardHeader>
            <CardTitle>Đề thi gần đây</CardTitle>
            <CardDescription>
              Các đề thi được tạo gần đây nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentExams.map((exam) => (
                <div key={exam.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {exam.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(exam.createdAt).toLocaleDateString('vi-VN')} • {exam.students} thí sinh
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      exam.status === 'active' 
                        ? 'bg-success-light text-success' 
                        : 'bg-warm-gray-100 text-warm-gray-800'
                    }`}>
                      {exam.status === 'active' ? 'Đang hoạt động' : 'Hoàn thành'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Thao tác nhanh</CardTitle>
            <CardDescription>
              Các thao tác thường được sử dụng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center space-x-4 rounded-md border p-4">
                <FileText className="h-5 w-5 text-brand-coral-500" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Tạo đề thi mới
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Tạo một đề thi TOEIC mới từ đầu
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 rounded-md border p-4">
                <Users className="h-5 w-5 text-teal" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Quản lý thí sinh
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Xem và quản lý danh sách thí sinh
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 rounded-md border p-4">
                <TrendingUp className="h-5 w-5 text-success" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Báo cáo thống kê
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Xem báo cáo chi tiết về kết quả thi
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
