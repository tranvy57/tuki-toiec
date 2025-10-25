"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Search,
  Filter,
  Play,
  Clock,
  Target,
  Volume2,
  AlertCircle,
  Loader2,
  RefreshCw,
  BookOpen,
  Headphones,
  Award,
} from "lucide-react";
import DictationPracticePage from "./DictationPracticePage";
import { useItems } from "@/api/useItems";
import { Item } from "@/types/implements/item";

interface DictationItem {
  id: string;
  modality: string;
  difficulty: string;
  bandHint: number;
  title?: string;
  promptJsonb: any;
  solutionJsonb: any;
  rubric: any;
  duration?: number; // in minutes
  tags?: string[];
  level?: string;
}

interface DictationExerciseListProps {
  onBack: () => void;
}

export default function DictationExerciseList({
  onBack,
}: DictationExerciseListProps) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");

  const props = {
    modality: "dictation",
  };

  const { data, isLoading, isError, error, refetch } = useItems(props);

  // Normalize items
  const items: Item[] = Array.isArray(data?.items) ? data?.items : [];

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      !searchTerm ||
      item.promptJsonb?.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.promptJsonb?.instructions
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesDifficulty =
      selectedDifficulty === "all" || item.difficulty === selectedDifficulty;
    const matchesLevel =
      selectedLevel === "all" || item.bandHint?.toString() === selectedLevel;

    return matchesSearch && matchesDifficulty && matchesLevel;
  });

  const handleItemSelect = (item: Item, index: number) => {
    setSelectedItem(item);
    setCurrentIndex(index);
  };

  const handleBackToList = () => {
    setSelectedItem(null);
    setCurrentIndex(0);
  };

  const handleNext = () => {
    if (currentIndex < filteredItems.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelectedItem(filteredItems[nextIndex]);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setSelectedItem(filteredItems[prevIndex]);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getBandColor = (band: number) => {
    if (band <= 3) return "bg-orange-100 text-orange-800";
    if (band <= 6) return "bg-blue-100 text-blue-800";
    return "bg-purple-100 text-purple-800";
  };

  // If an item is selected, show the practice page
  if (selectedItem) {
    return (
      <DictationPracticePage
        item={selectedItem}
        itemIndex={currentIndex + 1}
        totalItems={filteredItems.length}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        onNext={handleNext}
        onPrevious={currentIndex > 0 ? handlePrevious : undefined}
        onBack={handleBackToList}
      />
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <Badge variant="outline">Đang tải...</Badge>
          </div>

          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-blue-500 rounded-xl">
                <Volume2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Bài tập Dictation
              </h1>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              <span className="text-gray-600">
                Đang tải danh sách bài tập...
              </span>
            </div>
          </div>

          {/* Loading skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-12"></div>
                    </div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <Badge variant="outline" className="text-red-600">
              Lỗi
            </Badge>
          </div>

          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-red-500 rounded-xl">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Lỗi tải bài tập
              </h1>
            </div>

            <Alert className="max-w-md mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error?.message || "Có lỗi xảy ra khi tải danh sách bài tập"}
              </AlertDescription>
            </Alert>

            <Button onClick={() => refetch()} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <Badge variant="outline">Trống</Badge>
          </div>

          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-gray-500 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Chưa có bài tập
              </h1>
            </div>

            <p className="text-gray-600 max-w-md mx-auto">
              Hiện tại chưa có bài tập Dictation nào. Vui lòng thử lại sau.
            </p>

            <Button onClick={() => refetch()} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Tải lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {filteredItems.length} bài tập
          </Badge>
        </div>

        {/* Title & Stats */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Headphones className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Bài tập Dictation
            </h1>
          </motion.div>

          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Luyện tập kỹ năng nghe và chép chính tả với các bài tập tương tác
          </p>

          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>Cải thiện kỹ năng nghe</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>Phản hồi tức thì</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Luyện tập linh hoạt</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm bài tập..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Difficulty Filter */}
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả độ khó</option>
                <option value="easy">Dễ</option>
                <option value="medium">Trung bình</option>
                <option value="hard">Khó</option>
              </select>

              {/* Level Filter */}
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả cấp độ</option>
                <option value="1">Band 1-2</option>
                <option value="3">Band 3-4</option>
                <option value="5">Band 5-6</option>
                <option value="7">Band 7+</option>
              </select>

              {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedDifficulty("all");
                  setSelectedLevel("all");
                }}
                className="gap-2"
              >
                <Filter className="w-4 h-4" />
                Xóa bộ lọc
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Exercise List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {filteredItems.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không tìm thấy bài tập
                </h3>
                <p className="text-gray-500">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    onClick={() => handleItemSelect(item, index)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {item.promptJsonb?.title ||
                              `Dictation Exercise ${index + 1}`}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {item.promptJsonb?.instructions ||
                              "Luyện tập chép chính tả"}
                          </p>
                        </div>
                        <div className="ml-3">
                          <Play className="w-8 h-8 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Badges */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant="outline"
                          className={getDifficultyColor(item.difficulty)}
                        >
                          {item.difficulty === "easy"
                            ? "Dễ"
                            : item.difficulty === "medium"
                              ? "Trung bình"
                              : "Khó"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={getBandColor(item.bandHint)}
                        >
                          Band {item.bandHint}
                        </Badge>
                        {item.solutionJsonb?.sentences && (
                          <Badge variant="outline" className="text-xs">
                            {item.solutionJsonb.sentences.length} câu
                          </Badge>
                        )}
                      </div>

                      {/* Progress Info */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Volume2 className="w-3 h-3" />
                          <span>Audio included</span>
                        </div>
                        {/* {item.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>~{item.duration}min</span>
                          </div>
                        )} */}
                      </div>

                      {/* Action Button */}
                      <Button
                        className="w-full group-hover:bg-blue-600 transition-colors"
                        size="sm"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Bắt đầu luyện tập
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Pagination or Load More could go here */}
        {filteredItems.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Hiển thị {filteredItems.length} trên tổng số {items.length} bài
              tập
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
