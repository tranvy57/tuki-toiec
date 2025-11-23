import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ShoppingCart,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Plus,
  DollarSign,
  Calendar,
  Users,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Download,
  RefreshCw
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

// Types based on backend entities
interface Order {
  id: string;
  code: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  bankCode?: string;
  vnpTransactionNo?: string;
  vnpPayDate?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  course: {
    id: string;
    title: string;
    price: number;
    duration: number;
    level: string;
  };
}

interface UserCourse {
  id: string;
  status: 'active' | 'completed' | 'expired' | 'trial';
  purchaseDate: string;
  expireDate?: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  course: {
    id: string;
    title: string;
    price: number;
    duration: number;
  };
}

interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  paidOrders: number;
  failedOrders: number;
  cancelledOrders: number;
}

// Mock data
const mockOrders: Order[] = [
  {
    id: '1',
    code: 'ORD-2024-001',
    amount: 299000,
    status: 'paid',
    bankCode: 'NCB',
    vnpTransactionNo: 'VNP123456',
    vnpPayDate: '20241122103000',
    createdAt: '2024-11-22T03:30:00Z',
    updatedAt: '2024-11-22T03:35:00Z',
    user: {
      id: 'user1',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe'
    },
    course: {
      id: 'course1',
      title: 'TOEIC Complete Course - Beginner to Advanced',
      price: 299000,
      duration: 90,
      level: 'All Levels'
    }
  },
  {
    id: '2',
    code: 'ORD-2024-002',
    amount: 199000,
    status: 'pending',
    createdAt: '2024-11-22T02:15:00Z',
    updatedAt: '2024-11-22T02:15:00Z',
    user: {
      id: 'user2',
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith'
    },
    course: {
      id: 'course2',
      title: 'TOEIC Reading Mastery',
      price: 199000,
      duration: 60,
      level: 'Intermediate'
    }
  },
  {
    id: '3',
    code: 'ORD-2024-003',
    amount: 399000,
    status: 'failed',
    createdAt: '2024-11-21T08:45:00Z',
    updatedAt: '2024-11-21T08:50:00Z',
    user: {
      id: 'user3',
      email: 'mike.johnson@example.com',
      firstName: 'Mike',
      lastName: 'Johnson'
    },
    course: {
      id: 'course3',
      title: 'TOEIC Premium Package - 6 Months',
      price: 399000,
      duration: 180,
      level: 'All Levels'
    }
  }
];

const mockUserCourses: UserCourse[] = [
  {
    id: '1',
    status: 'active',
    purchaseDate: '2024-11-22T03:35:00Z',
    expireDate: '2025-02-20T03:35:00Z',
    user: {
      id: 'user1',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe'
    },
    course: {
      id: 'course1',
      title: 'TOEIC Complete Course - Beginner to Advanced',
      price: 299000,
      duration: 90
    }
  }
];

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [userCourses, setUserCourses] = useState<UserCourse[]>(mockUserCourses);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');

  // Calculate stats
  const stats: OrderStats = {
    totalOrders: orders.length,
    totalRevenue: orders.filter(o => o.status === 'paid').reduce((sum, o) => sum + o.amount, 0),
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    paidOrders: orders.filter(o => o.status === 'paid').length,
    failedOrders: orders.filter(o => o.status === 'failed').length,
    cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getUserCourseStatusColor = (status: UserCourse['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'trial': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      // TODO: Call API to update order status
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý Đơn hàng</h1>
            <p className="text-gray-600">Theo dõi và quản lý đơn hàng khóa học</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tạo đơn hàng mới
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Doanh thu</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stats.totalRevenue)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Đã thanh toán</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.paidOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Chờ thanh toán</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
            <TabsTrigger value="enrollments">Lộ trình học</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Danh sách đơn hàng</CardTitle>
                  <div className="flex items-center gap-4">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Tìm kiếm đơn hàng..."
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
                        <SelectItem value="pending">Chờ thanh toán</SelectItem>
                        <SelectItem value="paid">Đã thanh toán</SelectItem>
                        <SelectItem value="failed">Thất bại</SelectItem>
                        <SelectItem value="cancelled">Đã hủy</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Xuất Excel
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã đơn hàng</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Khóa học</TableHead>
                      <TableHead>Số tiền</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.code}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.user.firstName} {order.user.lastName}</p>
                            <p className="text-sm text-gray-500">{order.user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.course.title}</p>
                            <p className="text-sm text-gray-500">{order.course.duration} ngày - {order.course.level}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-bold">{formatCurrency(order.amount)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(order.status)}
                              {order.status.toUpperCase()}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
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
                                  setSelectedOrder(order);
                                  setIsDetailOpen(true);
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleUpdateOrderStatus(order.id, 'paid')}
                                disabled={order.status === 'paid'}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Đánh dấu đã thanh toán
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateOrderStatus(order.id, 'failed')}
                                disabled={order.status === 'failed'}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Đánh dấu thất bại
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                                disabled={order.status === 'cancelled'}
                              >
                                <AlertCircle className="mr-2 h-4 w-4" />
                                Hủy đơn hàng
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredOrders.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Không tìm thấy đơn hàng nào.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Courses Tab */}
          <TabsContent value="enrollments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Lộ trình học đã mua</CardTitle>
                <CardDescription>
                  Theo dõi trạng thái học tập của học viên
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Học viên</TableHead>
                      <TableHead>Khóa học</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày mua</TableHead>
                      <TableHead>Ngày hết hạn</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userCourses.map((enrollment) => (
                      <TableRow key={enrollment.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{enrollment.user.firstName} {enrollment.user.lastName}</p>
                            <p className="text-sm text-gray-500">{enrollment.user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{enrollment.course.title}</p>
                            <p className="text-sm text-gray-500">{enrollment.course.duration} ngày</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getUserCourseStatusColor(enrollment.status)}>
                            {enrollment.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(enrollment.purchaseDate)}</TableCell>
                        <TableCell>
                          {enrollment.expireDate ? formatDate(enrollment.expireDate) : 'Không giới hạn'}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Xem tiến độ
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Gia hạn khóa học
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Order Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chi tiết đơn hàng</DialogTitle>
              <DialogDescription>
                Thông tin chi tiết về đơn hàng {selectedOrder?.code}
              </DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Mã đơn hàng</Label>
                    <p className="text-sm font-mono bg-gray-100 p-2 rounded">{selectedOrder.code}</p>
                  </div>
                  <div>
                    <Label>Trạng thái</Label>
                    <div className="mt-1">
                      <Badge className={getStatusColor(selectedOrder.status)}>
                        {getStatusIcon(selectedOrder.status)}
                        <span className="ml-1">{selectedOrder.status.toUpperCase()}</span>
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Thông tin khách hàng</Label>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="font-medium">{selectedOrder.user.firstName} {selectedOrder.user.lastName}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.user.email}</p>
                  </div>
                </div>

                <div>
                  <Label>Thông tin khóa học</Label>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="font-medium">{selectedOrder.course.title}</p>
                    <p className="text-sm text-gray-600">
                      {selectedOrder.course.duration} ngày - {selectedOrder.course.level}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Số tiền</Label>
                    <p className="text-lg font-bold text-green-600">{formatCurrency(selectedOrder.amount)}</p>
                  </div>
                  <div>
                    <Label>Ngày tạo</Label>
                    <p className="text-sm">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                </div>

                {selectedOrder.vnpTransactionNo && (
                  <div>
                    <Label>Thông tin thanh toán</Label>
                    <div className="bg-gray-50 p-3 rounded space-y-1">
                      <p className="text-sm"><span className="font-medium">Mã giao dịch:</span> {selectedOrder.vnpTransactionNo}</p>
                      <p className="text-sm"><span className="font-medium">Ngân hàng:</span> {selectedOrder.bankCode}</p>
                      <p className="text-sm"><span className="font-medium">Ngày thanh toán:</span> {selectedOrder.vnpPayDate}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                Đóng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default OrdersPage;