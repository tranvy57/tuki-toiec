"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  Users, 
  FileText, 
  Play,
  Eye,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { useParams } from "next/navigation";

// Mock data for test details
const testData = {
  224: {
    id: 224,
    title: "New Economy TOEIC Test 1",
    description: "Đề thi TOEIC theo format mới với 7 phần thi và 200 câu hỏi",
    duration: 120,
    totalQuestions: 200,
    parts: 7,
    totalAttempts: 2523255,
    difficulty: "medium" as const,
    tags: ["#TOEIC"],
    note: "Chú ý: đề được quy đổi sang scaled score (ví dụ trên thang điểm 990 cho TOEIC hoặc 9.0 cho IELTS), vui lòng chọn chế độ làm FULL TEST.",
    results: [
      {
        date: "09/08/2025",
        score: "0/200",
        time: "0:00:07",
        status: "Full test" as const
      }
    ],
    sections: {
      listening: {
        name: "Listening",
        parts: 4,
        questions: 100,
        duration: 45
      },
      reading: {
        name: "Reading", 
        parts: 3,
        questions: 100,
        duration: 75
      }
    }
  }
};

export default function TestDetailPage() {
  const params = useParams();
  const testId = params.id as string;
  
  const test = testData[Number(testId) as keyof typeof testData];
  const [activeTab, setActiveTab] = useState("info");
  
  if (!test) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Không tìm thấy đề thi</h2>
            <p className="text-muted-foreground">ID đề thi không hợp lệ</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Badge variant="outline" className="w-fit">
                {test.tags[0]}
              </Badge>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {test.title}
                <CheckCircle className="h-6 w-6 text-green-500" />
              </h1>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Test Stats */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Thời gian làm bài: {test.duration} phút</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>{test.parts} phần thi</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>{test.totalQuestions} câu hỏi</span>
            </div>
            
          </div>

          {/* Note */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 italic">
              {test.note}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">Thông tin đề thi</TabsTrigger>
          <TabsTrigger value="answers">Đáp án/transcript</TabsTrigger>
          <TabsTrigger value="practice">Luyện tập</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          {/* Test Results */}
          <Card>
            <CardHeader>
              <CardTitle>Kết quả làm bài của bạn:</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Ngày làm</th>
                      <th className="text-left py-3 px-4 font-medium">Kết quả</th>
                      <th className="text-left py-3 px-4 font-medium">Thời gian làm bài</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {test.results.map((result, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div>{result.date}</div>
                            <Badge variant="secondary" className="text-xs">
                              {result.status}
                            </Badge>
                          </div>
                        </td>
                        <td className="py-3 px-4 ">{result.score}</td>
                        <td className="py-3 px-4 ">{result.time}</td>
                        <td className="py-3 px-4">
                          <Button variant="link" size="sm" className="h-auto p-0">
                            Xem chi tiết
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Test Structure */}
          <Card>
            <CardHeader>
              <CardTitle>Cấu trúc đề thi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.values(test.sections).map((section, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">{section.name}</h4>
                    <Badge variant="outline">{section.parts} phần</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>{section.questions} câu hỏi</p>
                    <p>Thời gian: {section.duration} phút</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="answers">
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Đáp án và Transcript</h3>
              <p className="text-muted-foreground mb-4">
                Hoàn thành bài thi để xem đáp án chi tiết và transcript
              </p>
              <Button variant="outline">
                Xem đáp án
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="practice">
          <Card>
            <CardContent className="p-8 text-center">
              <Play className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Chế độ luyện tập</h3>
              <p className="text-muted-foreground mb-4">
                Chọn chế độ luyện tập phù hợp với mục tiêu của bạn
              </p>
              <div className="space-y-3">
                <Button className="w-full" size="lg" onClick={() => window.location.href = `/tests/01fbcb1a-b93d-490d-b99a-344017b7a030/start`}>
                  Làm full test (120 phút)
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  Luyện từng phần
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Warning and Start Button */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-yellow-800">
                <strong>Sẵn sàng để bắt đầu làm full test?</strong> Để đạt được kết quả tốt nhất, 
                bạn cần dành ra 120 phút cho bài test này.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="flex justify-center">
        <Button 
          size="lg" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
          onClick={() => window.location.href = `/tests/${testId}/start`}
        >
          BẮT ĐẦU THI
        </Button>
      </div>
    </div>
  );
}
