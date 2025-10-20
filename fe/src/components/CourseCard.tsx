"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PaymentButton from "@/components/PaymentButton";
import { Clock, Users, Star, BookOpen, Award } from "lucide-react";

interface CourseCardProps {
  course: {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    duration: string;
    lessons: number;
    level: string;
    rating: number;
    students: number;
    isPurchased?: boolean;
  };
  userId?: string;
}

export default function CourseCard({ course, userId }: CourseCardProps) {
  const discountPercent = course.originalPrice
    ? Math.round(
        ((course.originalPrice - course.price) / course.originalPrice) * 100
      )
    : 0;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-4">
          <BookOpen className="w-12 h-12 text-blue-600" />
        </div>

        <CardTitle className="text-lg font-semibold line-clamp-2">
          {course.name}
        </CardTitle>

        <p className="text-sm text-gray-600 line-clamp-3">
          {course.description}
        </p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {/* Course Stats */}
        <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{course.students.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500" />
            <span>{course.rating}/5</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="w-3 h-3" />
            <span>{course.lessons} bài</span>
          </div>
        </div>

        {/* Level Badge */}
        <Badge variant="secondary" className="w-fit mb-4">
          {course.level}
        </Badge>

        {/* Pricing */}
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl font-bold text-blue-600">
              {course.price.toLocaleString("vi-VN")}đ
            </span>
            {course.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {course.originalPrice.toLocaleString("vi-VN")}đ
              </span>
            )}
            {discountPercent > 0 && (
              <Badge variant="destructive" className="text-xs">
                -{discountPercent}%
              </Badge>
            )}
          </div>

          {/* Payment Button */}
          {course.isPurchased ? (
            <button className="w-full bg-green-100 text-green-800 font-semibold py-3 px-6 rounded-lg">
              Đã sở hữu
            </button>
          ) : (
            <PaymentButton
              courseId={course.id}
              courseName={course.name}
              amount={course.price}
              userId={userId}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
