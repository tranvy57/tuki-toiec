"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Search, Zap } from "lucide-react";
import { WeakVocabulary } from "@/types/implements/vocabulary";
import { mockWeakVocabularies } from "@/data/mockVocabulary";
import {
  StatsOverview,
  SearchAndFilter,
  VocabularyCard,
  ReviewSession,
} from "@/components/vocabulary";
import { useVocabularyReview } from "@/hooks/use-vocabulary";
import {
  useGetReviewVocabularies,
  useGetVocabularies,
} from "@/api/useVocabulary";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function VocabularyPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const [filterLevel, setFilterLevel] = useState<string>("all");
  const data = useGetVocabularies();
  const dataReview = useGetReviewVocabularies();
  const [vocabularies, setVocabularies] = useState<any[]>([]);
  const [vocabularyReviews, setVocabularyReviews] = useState<any[]>([]);

  const [quizItems, setQuizItems] = useState([]);

  useEffect(() => {
    if (data?.data?.data) {
      setVocabularies(data?.data?.data);
    }
  }, [data.data]);

  useEffect(() => {
    console.log("dataReview", dataReview?.data?.data?.items);
    if (dataReview?.data?.data) {
      // setVocabularyReviews(dataReview?.data?.data?.items || []);
      setVocabularyReviews(dataReview?.data?.data || { items: [] });
    }
  }, [dataReview?.data?.data]);

  const {
    currentReviewIndex,
    isReviewMode,
    showAnswer,
    reviewSession,
    reviewMode,
    currentQuizType,
    showQuiz,
    quizAnswer,
    quizOptions,
    selectedOption,
    quizCompleted,
    currentReviewWord,
    startFlashcardSession,
    startQuizSession,
    endReviewSession,
    handleQuizSubmit,
    proceedToNextWord,
    handleShowAnswer,
    handleFlashcardNext,
    toggleMarkForReview,
    setQuizAnswer,
    setSelectedOption,
  } = useVocabularyReview(
    vocabularies,
    setVocabularies,
    dataReview?.data?.data || {}
  );

  const filteredVocabularies = vocabularies.filter((vocab) => {
    console.log("vocab", vocab);
    const matchesSearch =
      vocab?.word?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vocab?.meaning?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterLevel === "all" || vocab?.weaknessLevel === filterLevel;
    return matchesSearch && matchesFilter;
  });

  const markedForReview = vocabularies.filter(
    (v) => v.isMarkedForReview
  ).length;

  console.log("reviewSession", reviewSession);

  if (isReviewMode && currentReviewWord) {
    console.log("currentReviewWord", currentReviewWord);
    return (
      <ReviewSession
        reviewMode={reviewMode}
        currentWord={currentReviewWord}
        reviewSession={reviewSession}
        currentReviewIndex={currentReviewIndex}
        allVocabularies={vocabularies}
        onEndSession={endReviewSession}
        showAnswer={showAnswer}
        onShowAnswer={handleShowAnswer}
        onFlashcardNext={handleFlashcardNext}
        showQuiz={showQuiz}
        currentQuizType={currentQuizType}
        quizOptions={quizOptions}
        selectedOption={selectedOption}
        onSelectOption={setSelectedOption}
        quizAnswer={quizAnswer}
        onAnswerChange={setQuizAnswer}
        quizCompleted={quizCompleted}
        onQuizSubmit={handleQuizSubmit}
        onProceedToNext={proceedToNextWord}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <StatsOverview vocabularies={vocabularies} />

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2">
          <Button
            onClick={startFlashcardSession}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={markedForReview === 0}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Flashcard ({markedForReview} từ)
          </Button>

          <Button
            onClick={startQuizSession}
            className="bg-toeic-primary hover:bg-red-600"
          >
            <Zap className="h-4 w-4 mr-2" />
            Ôn tập
          </Button>
        </div>

        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm từ vựng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">Tất cả</option>
            <option value="critical">Rất yếu</option>
            <option value="moderate">Trung bình</option>
            <option value="mild">Hơi yếu</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {filteredVocabularies.map((vocab) => {
          return (
            <VocabularyCard
              key={vocab.id}
              vocabulary={vocab}
              onToggleMarkForReview={toggleMarkForReview}
            />
          );
        })}
      </div>

      {filteredVocabularies.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              Không tìm thấy từ vựng
            </h3>
            <p className="text-sm text-muted-foreground">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
