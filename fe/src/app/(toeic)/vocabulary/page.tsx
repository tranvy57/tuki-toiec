"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { WeakVocabulary } from "@/types/implements/vocabulary";
import { mockWeakVocabularies } from "@/data/mockVocabulary";
import {
  StatsOverview,
  SearchAndFilter,
  VocabularyCard,
  ReviewSession,
} from "@/components/vocabulary";
import { useVocabularyReview } from "@/hooks/use-vocabulary";
import { useGetVocabularies } from "@/api/useVocabulary";

export default function VocabularyPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const [filterLevel, setFilterLevel] = useState<string>("all");
  const data = useGetVocabularies();
  const [vocabularies, setVocabularies] = useState<any[]>([]);

  useEffect(() => {
    if (data?.data?.data) {
      setVocabularies(data?.data?.data);
    }
  }, [data.data]);

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
  } = useVocabularyReview(vocabularies, setVocabularies);

  const filteredVocabularies = vocabularies.filter((vocab) => {
    console.log("vocab", vocab);
    const matchesSearch =
      vocab?.word?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vocab?.meaning?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterLevel === "all" || vocab?.weaknessLevel === filterLevel;
    return matchesSearch && matchesFilter;
  });

  console.log("filteredVocabularies", filteredVocabularies);

  const markedForReview = vocabularies.filter(
    (v) => v.isMarkedForReview
  ).length;

  if (isReviewMode && currentReviewWord) {
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

      <SearchAndFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterLevel={filterLevel}
        setFilterLevel={setFilterLevel}
        markedForReview={markedForReview}
        onStartFlashcard={startFlashcardSession}
        onStartQuiz={startQuizSession}
      />

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
