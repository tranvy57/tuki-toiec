"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Headphones, 
  BookOpen, 
  Mic, 
  PenTool,
  Clock,
  Target,
  TrendingUp,
  Award
} from "lucide-react";
import Link from "next/link";

export default function ToeicHomePage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Promo Banner */}
      <Card className="bg-gradient-to-r from-[#ff776f] to-[#ff9b94] text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Luyện thi TOEIC hiệu quả</h2>
              <p className="text-white/90">Đạt điểm cao với phương pháp học tập khoa học</p>
            </div>
            <div className="hidden md:block">
              <Award className="h-16 w-16 text-white/80" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Practice Section */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4">Luyện tập</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/toeic/study-plan">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Headphones className="h-8 w-8 text-[#ff776f] mx-auto mb-2" />
                <p className="text-sm font-medium">Nghe Hiểu</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/toeic/study-plan">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <BookOpen className="h-8 w-8 text-[#ff776f] mx-auto mb-2" />
                <p className="text-sm font-medium">Đọc Hiểu</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/toeic/study-plan">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Mic className="h-8 w-8 text-[#ff776f] mx-auto mb-2" />
                <p className="text-sm font-medium">Luyện nói</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/toeic/study-plan">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <PenTool className="h-8 w-8 text-[#ff776f] mx-auto mb-2" />
                <p className="text-sm font-medium">Viết</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Exam Section */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4">Đề thi</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/toeic/tests">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold mb-1">Đề thi thực hành</h4>
                    <p className="text-sm text-muted-foreground">Luyện tập với đề thi mô phỏng</p>
                  </div>
                  <Badge variant="secondary">Mới</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/toeic/tests">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold mb-1">Đề thi chính thức</h4>
                    <p className="text-sm text-muted-foreground">Đề thi với format chuẩn TOEIC</p>
                  </div>
                  <Badge variant="outline">Hot</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Progress Section */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4">Tiến độ học tập</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Target className="h-4 w-4 mr-2 text-[#ff776f]" />
                Mục tiêu tuần
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>5/7 ngày</span>
                  <span>71%</span>
                </div>
                <Progress value={71} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="h-4 w-4 mr-2 text-[#ff776f]" />
                Thời gian học
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2h 30m</div>
              <div className="text-sm text-muted-foreground">Hôm nay</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-[#ff776f]" />
                Điểm trung bình
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">750</div>
              <div className="text-sm text-muted-foreground">+50 từ lần trước</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/toeic/tests" className="flex-1">
          <Button className="w-full bg-[#ff776f] hover:bg-[#e55a52]">
            Bắt đầu luyện thi
          </Button>
        </Link>
        <Link href="/toeic/vocabulary" className="flex-1">
          <Button variant="outline" className="w-full">
            Học từ vựng
          </Button>
        </Link>
      </div>
    </div>
  );
}
