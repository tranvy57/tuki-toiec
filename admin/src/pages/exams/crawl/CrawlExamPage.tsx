import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Download, Globe, FileText, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface CrawlFormData {
  url: string;
  examTitle: string;
}

interface CrawlResult {
  id: string;
  url: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  questionsFound: number;
  error?: string;
  createdAt: string;
}

export default function CrawlExamPage() {
  const [crawlResults, setCrawlResults] = useState<CrawlResult[]>([
    {
      id: '1',
      url: 'https://example.com/toeic-test-1',
      title: 'TOEIC Practice Test từ ETS',
      status: 'completed',
      progress: 100,
      questionsFound: 200,
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      url: 'https://example.com/toeic-test-2',
      title: 'TOEIC Sample Test 2024',
      status: 'processing',
      progress: 65,
      questionsFound: 130,
      createdAt: '2024-01-15T11:15:00Z',
    },
    {
      id: '3',
      url: 'https://example.com/toeic-test-3',
      title: 'TOEIC Mock Test Series',
      status: 'error',
      progress: 0,
      questionsFound: 0,
      error: 'Không thể truy cập website',
      createdAt: '2024-01-15T09:45:00Z',
    },
  ]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CrawlFormData>();

  const onSubmit = (data: CrawlFormData) => {
    const newCrawl: CrawlResult = {
      id: Date.now().toString(),
      url: data.url,
      title: data.examTitle || 'Đề thi từ ' + new URL(data.url).hostname,
      status: 'pending',
      progress: 0,
      questionsFound: 0,
      createdAt: new Date().toISOString(),
    };

    setCrawlResults([newCrawl, ...crawlResults]);
    reset();

    // Simulate crawling process
    simulateCrawling(newCrawl.id);
  };

  const simulateCrawling = (id: string) => {
    // Update to processing
    setTimeout(() => {
      setCrawlResults(prev => prev.map(item => 
        item.id === id ? { ...item, status: 'processing' as const } : item
      ));
    }, 1000);

    // Simulate progress updates
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setCrawlResults(prev => prev.map(item => 
          item.id === id ? { 
            ...item, 
            status: 'completed' as const, 
            progress: 100,
            questionsFound: 200 
          } : item
        ));
      } else {
        setCrawlResults(prev => prev.map(item => 
          item.id === id ? { 
            ...item, 
            progress: Math.round(progress),
            questionsFound: Math.round(progress * 2)
          } : item
        ));
      }
    }, 500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'processing':
        return <Download className="h-5 w-5 text-warning animate-pulse" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-error" />;
      default:
        return <FileText className="h-5 w-5 text-warm-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      pending: 'Đang chờ',
      processing: 'Đang cào dữ liệu',
      completed: 'Hoàn thành',
      error: 'Lỗi',
    };
    return statusMap[status as keyof typeof statusMap] || status;
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/exams/list">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-warm-gray-900">Cào đề thi</h1>
            <p className="text-warm-gray-600">Tự động cào đề thi TOEIC từ các website</p>
          </div>
        </div>
      </div>

      {/* Crawl Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Cào đề thi mới
          </CardTitle>
          <CardDescription>
            Nhập URL của trang web chứa đề thi TOEIC để tự động cào dữ liệu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="url">URL trang web</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/toeic-practice-test"
                {...register('url', {
                  required: 'URL là bắt buộc',
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: 'URL không hợp lệ'
                  }
                })}
              />
              {errors.url && (
                <p className="text-sm text-error mt-1">{errors.url.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="examTitle">Tên đề thi (tùy chọn)</Label>
              <Input
                id="examTitle"
                placeholder="Tên đề thi sẽ được tự động tạo nếu để trống"
                {...register('examTitle')}
              />
            </div>

            <Button type="submit" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Bắt đầu cào dữ liệu
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Hướng dẫn sử dụng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-warm-gray-600">
            <div className="flex items-start space-x-2">
              <span className="flex-shrink-0 w-5 h-5 bg-brand-coral-100 text-brand-coral-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
              <span>Nhập URL của trang web chứa đề thi TOEIC</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="flex-shrink-0 w-5 h-5 bg-brand-coral-100 text-brand-coral-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
              <span>Hệ thống sẽ tự động phân tích và cào các câu hỏi, đáp án</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="flex-shrink-0 w-5 h-5 bg-brand-coral-100 text-brand-coral-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
              <span>Kiểm tra và chỉnh sửa dữ liệu đã cào nếu cần thiết</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="flex-shrink-0 w-5 h-5 bg-brand-coral-100 text-brand-coral-600 rounded-full flex items-center justify-center text-xs font-bold">4</span>
              <span>Lưu thành đề thi hoàn chỉnh trong hệ thống</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Crawl Results */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử cào dữ liệu</CardTitle>
          <CardDescription>
            Danh sách các lần cào dữ liệu đề thi gần đây
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {crawlResults.map((result) => (
              <div key={result.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <h4 className="font-medium">{result.title}</h4>
                      <p className="text-sm text-warm-gray-500">{result.url}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{getStatusText(result.status)}</p>
                    <p className="text-xs text-warm-gray-500">{formatDate(result.createdAt)}</p>
                  </div>
                </div>

                {result.status === 'processing' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tiến độ: {result.progress}%</span>
                      <span>Đã tìm thấy: {result.questionsFound} câu hỏi</span>
                    </div>
                    <div className="w-full bg-warm-gray-200 rounded-full h-2">
                      <div 
                        className="bg-brand-coral-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${result.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {result.status === 'completed' && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-success">
                      Đã cào thành công {result.questionsFound} câu hỏi
                    </span>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Xem chi tiết
                    </Button>
                  </div>
                )}

                {result.status === 'error' && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-error">
                      Lỗi: {result.error}
                    </span>
                    <Button size="sm" variant="outline">
                      Thử lại
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {crawlResults.length === 0 && (
              <div className="text-center py-8">
                <Globe className="h-12 w-12 text-warm-gray-300 mx-auto mb-4" />
                <p className="text-warm-gray-500">
                  Chưa có lịch sử cào dữ liệu. Hãy thử cào đề thi đầu tiên!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
