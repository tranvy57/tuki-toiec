import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, Zap } from "lucide-react";

interface SearchAndFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterLevel: string;
  setFilterLevel: (level: string) => void;
  markedForReview: number;
  onStartFlashcard: () => void;
  onStartQuiz: () => void;
}

export default function SearchAndFilter({
  searchQuery,
  setSearchQuery,
  filterLevel,
  setFilterLevel,
  markedForReview,
  onStartFlashcard,
  onStartQuiz,
}: SearchAndFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex gap-2">
        <Button
          onClick={onStartFlashcard}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={markedForReview === 0}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Flashcard ({markedForReview} từ)
        </Button>

        <Button
          onClick={onStartQuiz}
          className="bg-toeic-primary hover:bg-red-600"
          disabled={markedForReview === 0}
        >
          <Zap className="h-4 w-4 mr-2" />
          Quiz ({markedForReview} từ)
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
  );
}

