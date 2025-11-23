import { useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  Activity,
  BookOpen,
  FileText,
  BarChart3,
} from "lucide-react";

// New refactored components
import {
  PageContainer,
  PageHeader,
  ContentWrapper,
  StatsGrid,
  StatCard,
  Panel,
  FlexContainer,
  GridContainer,
} from "@/components/common";

// Custom hooks
import { useAdminDashboard, usePage } from "@/hooks/useAdmin";
import { useResponsive } from "@/hooks/useAdmin";

// Chart components (keep existing)
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Table component (keep existing)
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

// Mock data (in real app, this would come from API)
const attemptTrend = [
  { day: "Mon", practice: 120, test: 48, review: 18 },
  { day: "Tue", practice: 140, test: 55, review: 26 },
  { day: "Wed", practice: 138, test: 60, review: 22 },
  { day: "Thu", practice: 152, test: 62, review: 29 },
  { day: "Fri", practice: 160, test: 75, review: 32 },
  { day: "Sat", practice: 190, test: 88, review: 35 },
  { day: "Sun", practice: 172, test: 70, review: 28 },
];

const orderStatusData = [
  { name: "Đã thanh toán", value: 68, color: "#22c55e" },
  { name: "Đang chờ", value: 21, color: "#f97316" },
  { name: "Thất bại", value: 11, color: "#ef4444" },
];

const recentOrders = [
  {
    code: "ORD-20250113-01",
    user: "Nguyễn Minh Anh",
    course: "Premium 750+",
    amount: "899,000đ",
    status: "Đã thanh toán",
    date: "13/01/2025",
  },
  {
    code: "ORD-20250113-02",
    user: "Trần Văn Đức",
    course: "Fundamentals 550+",
    amount: "599,000đ",
    status: "Đang chờ",
    date: "13/01/2025",
  },
];

export default function DashboardPage() {
  const { stats, loading, error } = useAdminDashboard();
  const { setPage } = usePage();
  const { isMobile } = useResponsive();

  useEffect(() => {
    setPage("Dashboard", [{ title: "Dashboard" }]);
  }, []); // Empty dependency array to prevent infinite loop

  if (loading) {
    return (
      <PageContainer>
        <ContentWrapper>
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </ContentWrapper>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <p className="text-red-600">Lỗi: {error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <PageHeader
          title="Dashboard quản trị TUKI TOEIC"
          description="Theo dõi người dùng, khóa học, lần làm bài và doanh thu được đồng bộ từ backend NestJS."
        >
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
        </PageHeader>

        {/* Stats Overview */}
        <StatsGrid cols={isMobile ? 2 : 4}>
          <StatCard
            title="Người dùng"
            value={stats.users.toLocaleString()}
            subtitle={`${Math.floor(stats.users * 0.65).toLocaleString()} active`}
            icon={Users}
            trend={{ value: "+4.2%", isPositive: true }}
          />
          <StatCard
            title="Học viên Premium"
            value={stats.premiumUsers.toLocaleString()}
            subtitle={`+${Math.floor(stats.premiumUsers * 0.04).toLocaleString()} tuần này`}
            icon={ShieldCheck}
            trend={{ value: "+3.9%", isPositive: true }}
          />
          <StatCard
            title="Lần làm bài"
            value={stats.tests.toLocaleString()}
            subtitle={`${Math.floor(stats.tests * 0.2).toLocaleString()} bài review`}
            icon={TrendingUp}
            trend={{ value: "+6.1%", isPositive: true }}
          />
          <StatCard
            title="Doanh thu VNPAY"
            value={`${(stats.revenue / 1000000).toFixed(1)} triệu`}
            subtitle={`${Math.floor(stats.revenue / 3600).toLocaleString()} đơn thành công`}
            icon={CreditCard}
            trend={{ value: "+12%", isPositive: true }}
          />
        </StatsGrid>

        {/* Charts Section */}
        <GridContainer cols={isMobile ? 1 : 2}>
          <Panel
            title="Hoạt động làm bài"
            description="Dữ liệu tổng hợp từ bảng attempts theo từng chế độ"
            variant="card"
            headerActions={
              <Button variant="outline" size="sm">
                Xuất báo cáo
              </Button>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attemptTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="practice"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Luyện tập"
                />
                <Line
                  type="monotone"
                  dataKey="test"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Thi thử"
                />
                <Line
                  type="monotone"
                  dataKey="review"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="Ôn tập"
                />
              </LineChart>
            </ResponsiveContainer>
          </Panel>

          <Panel
            title="Đơn hàng & VNPAY"
            description="Dữ liệu orders & webhook VNPAY"
            variant="card"
            headerActions={
              <div className="text-right">
                <div className="text-2xl font-bold">100</div>
                <div className="text-sm text-gray-500">đơn trong 30 ngày</div>
              </div>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6 flex justify-center gap-6">
              {orderStatusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">
                    {item.name}: {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        </GridContainer>

        {/* Bottom Section */}
        <GridContainer cols={isMobile ? 1 : 2}>
          <Panel
            title="Top khóa học"
            description="Dữ liệu từ bảng courses & user_courses"
            variant="card"
          >
            <div className="space-y-4">
              {[
                { name: "Fundamentals 550+", enrolled: 428, completion: 82 },
                { name: "Premium 750+", enrolled: 312, completion: 74 },
                { name: "Fast Track 900", enrolled: 188, completion: 69 },
              ].map((course, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{course.name}</p>
                    <p className="text-sm text-gray-500">{course.enrolled} học viên</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{course.completion}%</p>
                    <p className="text-sm text-gray-500">hoàn thành</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            title="Từ vựng & ôn tập"
            description="Dữ liệu từ vocabularies & user_vocabularies"
            variant="card"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">4,820</div>
                <div className="text-sm text-gray-600">Tổng từ vựng</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">1,720</div>
                <div className="text-sm text-gray-600">Đã thuộc</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">640</div>
                <div className="text-sm text-gray-600">Cần ôn</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">320</div>
                <div className="text-sm text-gray-600">Từ mới</div>
              </div>
            </div>
          </Panel>
        </GridContainer>

        {/* Recent Orders Table */}
        <Panel title="Đơn hàng gần nhất" variant="card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn</TableHead>
                <TableHead>Người dùng</TableHead>
                <TableHead>Khóa học</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.code}>
                  <TableCell className="font-medium">{order.code}</TableCell>
                  <TableCell>{order.user}</TableCell>
                  <TableCell>{order.course}</TableCell>
                  <TableCell>{order.amount}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'Đã thanh toán'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-orange-100 text-orange-800'
                      }`}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Panel>
      </ContentWrapper >
    </PageContainer >
  );
}