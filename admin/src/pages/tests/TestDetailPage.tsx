import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useTest, useUpdateTest } from '@/hooks/useTests';
import type { Test } from '@/types/api';
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Edit,
  FileText,
  Image,
  MessageSquare,
  Save,
  Users,
  Volume2,
  XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

// Extended types based on backend entity relations
interface TestDetailPart {
  id: string;
  partNumber: number;
  direction: string;
  groups?: TestDetailGroup[];
}

interface TestDetailGroup {
  id: string;
  orderIndex: number;
  paragraphEn?: string;
  paragraphVn?: string;
  imageUrl?: string;
  audioUrl?: string;
  questions?: TestDetailQuestion[];
}

interface TestDetailQuestion {
  id: string;
  numberLabel: number;
  content: string;
  explanation?: string;
  answers?: TestDetailAnswer[];
}

interface TestDetailAnswer {
  id: string;
  content: string;
  isCorrect: boolean;
  answerKey: string;
}

interface TestDetail extends Test {
  audioUrl?: string;
  isReview?: boolean;
  parts?: TestDetailPart[];
  attemptsCount?: number;
}

const TestDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [editedData, setEditedData] = useState<Partial<TestDetail>>({});

  // Use real API hooks
  const { data: testDetail, isLoading, error } = useTest(id!) as {
    data: TestDetail | undefined;
    isLoading: boolean;
    error: any;
  };
  const updateMutation = useUpdateTest();

  useEffect(() => {
    if (testDetail && Object.keys(editedData).length === 0) {
      setEditedData({
        title: testDetail.title,
        audioUrl: (testDetail as any)?.audioUrl || '',
        isReview: (testDetail as any)?.isReview || false,
      });
    }
  }, [testDetail, editedData]);

  const handleSave = async () => {
    if (!id || Object.keys(editedData).length === 0) return;

    try {
      await updateMutation.mutateAsync({ id, data: editedData });
      setIsEditing(false);
      toast.success('Cập nhật đề thi thành công!', {
        description: 'Thông tin đề thi đã được lưu.'
      });
    } catch (error) {
      console.error('Failed to update test:', error);
      toast.error('Có lỗi xảy ra khi cập nhật', {
        description: 'Vui lòng kiểm tra lại và thử lại.'
      });
    }
  };

  const getPartTypeLabel = (partNumber: number) => {
    const partLabels: { [key: number]: string } = {
      1: 'Photographs',
      2: 'Question-Response',
      3: 'Conversations',
      4: 'Short Talks',
      5: 'Incomplete Sentences',
      6: 'Text Completion',
      7: 'Reading Comprehension'
    };
    return partLabels[partNumber] || `Part ${partNumber}`;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !testDetail) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {error ? 'Lỗi khi tải dữ liệu' : 'Đề thi không tồn tại'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {error ? 'Không thể tải thông tin đề thi.' : 'Đề thi bạn tìm kiếm không tồn tại.'}
          </p>
          <div className="mt-6">
            <Button onClick={() => navigate('/tests')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay về danh sách
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats from actual data
  const totalQuestions = testDetail?.parts?.reduce((acc: number, part: TestDetailPart) =>
    acc + (part.groups?.reduce((groupAcc: number, group: TestDetailGroup) =>
      groupAcc + (group.questions?.length || 0), 0
    ) || 0), 0
  ) || 0;

  const totalParts = testDetail?.parts?.length || 0;
  const totalGroups = testDetail?.parts?.reduce((acc: number, part: TestDetailPart) =>
    acc + (part.groups?.length || 0), 0
  ) || 0;

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/tests')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tests
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{testDetail.title}</h1>
              <p className="text-sm text-gray-500">Test ID: {testDetail.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Test
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng số câu hỏi</p>
                  <p className="text-2xl font-bold text-gray-900">{totalQuestions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Phần thi</p>
                  <p className="text-2xl font-bold text-gray-900">{totalParts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Nhóm</p>
                  <p className="text-2xl font-bold text-gray-900">{totalGroups}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Lần làm</p>
                  <p className="text-2xl font-bold text-gray-900">{testDetail.attemptsCount || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Test Information</CardTitle>
                <CardDescription>
                  Basic information about this test
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Tiêu đề</Label>
                    {isEditing ? (
                      <Input
                        id="title"
                        value={editedData?.title || ''}
                        onChange={(e) => setEditedData({ ...editedData, title: e.target.value })}
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{testDetail.title}</p>
                    )}
                  </div>
                  <div>
                    <Label>Trạng thái</Label>
                    <div className="mt-1">
                      <Badge variant={(testDetail as any)?.isReview ? 'secondary' : 'default'}>
                        {(testDetail as any)?.isReview ? 'Đề ôn luyện' : 'Đề thường'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label>Ngày tạo</Label>
                    <p className="mt-1 text-sm text-gray-900">
                      {testDetail.createdAt ? new Date(testDetail.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <Label>Cập nhật</Label>
                    <p className="mt-1 text-sm text-gray-900">
                      {testDetail.updatedAt ? new Date(testDetail.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </p>
                  </div>
                </div>
                {(testDetail as any)?.audioUrl && (
                  <div>
                    <Label>Audio URL</Label>
                    <div className="mt-1 flex items-center space-x-2">
                      <Input
                        value={(testDetail as any)?.audioUrl || ''}
                        readOnly={!isEditing}
                        onChange={(e) => setEditedData({ ...editedData, audioUrl: e.target.value })}
                      />
                      {!isEditing && (
                        <Button size="sm" variant="outline">
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <div className="space-y-6">
              {testDetail?.parts?.length ? (
                testDetail.parts.map((part: TestDetailPart, partIndex: number) => (
                  <Card key={part.id || partIndex}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Part {part.partNumber}: {getPartTypeLabel(part.partNumber)}</span>
                        <Badge variant="outline">{part.groups?.length || 0} Groups</Badge>
                      </CardTitle>
                      <CardDescription>{part.direction}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {part.groups?.map((group: TestDetailGroup, groupIndex: number) => (
                          <Collapsible key={group.id || groupIndex} className="border rounded-lg">
                            <CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-gray-50">
                              <span className="font-medium">
                                Group {group.orderIndex} ({group.questions?.length || 0} questions)
                              </span>
                              <div className="flex items-center space-x-2">
                                {group.audioUrl && <Volume2 className="h-4 w-4 text-blue-500" />}
                                {group.imageUrl && <Image className="h-4 w-4 text-green-500" />}
                                {group.paragraphEn && <FileText className="h-4 w-4 text-purple-500" />}
                              </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="px-4 pb-4">
                              <div className="space-y-4">
                                {/* Group content */}
                                {group.paragraphEn && (
                                  <div>
                                    <Label className="text-sm font-medium">Reading Passage (EN)</Label>
                                    <p className="mt-1 text-sm text-gray-700 bg-gray-50 p-3 rounded">
                                      {group.paragraphEn}
                                    </p>
                                  </div>
                                )}
                                {group.paragraphVn && (
                                  <div>
                                    <Label className="text-sm font-medium">Reading Passage (VN)</Label>
                                    <p className="mt-1 text-sm text-gray-700 bg-blue-50 p-3 rounded">
                                      {group.paragraphVn}
                                    </p>
                                  </div>
                                )}

                                {/* Questions */}
                                <div className="space-y-3">
                                  {group.questions?.map((question: TestDetailQuestion) => (
                                    <div key={question.id} className="border-l-4 border-blue-500 pl-4">
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <p className="font-medium text-sm">
                                            Question {question.numberLabel}: {question.content}
                                          </p>
                                          <div className="mt-2 space-y-1">
                                            {question.answers?.map((answer: TestDetailAnswer) => (
                                              <div
                                                key={answer.id}
                                                className={`flex items-center space-x-2 text-sm p-2 rounded ${answer.isCorrect
                                                    ? 'bg-green-50 text-green-800'
                                                    : 'bg-gray-50 text-gray-700'
                                                  }`}
                                              >
                                                {answer.isCorrect ? (
                                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                                ) : (
                                                  <XCircle className="h-4 w-4 text-red-400" />
                                                )}
                                                <span className="font-medium">{answer.answerKey}.</span>
                                                <span>{answer.content}</span>
                                              </div>
                                            ))}
                                          </div>
                                          {question.explanation && (
                                            <div className="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400">
                                              <p className="text-sm text-yellow-800">
                                                <strong>Explanation:</strong> {question.explanation}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Chưa có nội dung cho đề thi này.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Test Settings</CardTitle>
                <CardDescription>
                  Configure test properties and behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isReview"
                    checked={editedData.isReview || false}
                    onChange={(e) => setEditedData({ ...editedData, isReview: e.target.checked })}
                    disabled={!isEditing}
                  />
                  <Label htmlFor="isReview">Mark as Review Test</Label>
                </div>
                <div>
                  <Label htmlFor="audioUrl">Main Audio URL</Label>
                  <Input
                    id="audioUrl"
                    value={editedData.audioUrl || ''}
                    onChange={(e) => setEditedData({ ...editedData, audioUrl: e.target.value })}
                    placeholder="https://example.com/audio.mp3"
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TestDetailPage;