import {
  TrendingDown,
  Target,
  Clock,
  Star,
  BookOpen,
  Gauge,
  Trophy,
} from "lucide-react";
import { WeakVocabulary } from "@/types/implements/vocabulary";

interface StatsOverviewProps {
  vocabularies: WeakVocabulary[];
  totalCards?: number;
  totalReviews?: number;
  dueCount?: number;
  accuracy?: number;
}

const defaultStats = {
  totalCards: 0,
  totalReviews: 0,
  dueCount: 0,
  accuracy: 0,
};

export default function StatsOverview({
  vocabularies,
  totalCards = defaultStats.totalCards,
  totalReviews = defaultStats.totalReviews,
  dueCount = defaultStats.dueCount,
  accuracy = defaultStats.accuracy,
}: StatsOverviewProps) {
  const criticalWords = vocabularies.filter(
    (v) => v.weaknessLevel === "critical"
  ).length;
  const moderateWords = vocabularies.filter(
    (v) => v.weaknessLevel === "moderate"
  ).length;
  const mildWords = vocabularies.filter(
    (v) => v.weaknessLevel === "mild"
  ).length;
  const markedForReview = vocabularies.filter(
    (v) => v.isMarkedForReview
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* --- NHÓM 1: THỐNG KÊ HỌC TẬP --- */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Thống Kê Học Tập
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <StatRow
            icon={<Gauge className="text-blue-600 w-5 h-5" />}
            label="Tổng số Thẻ"
            value={totalCards}
          />
          <StatRow
            icon={<BookOpen className="text-indigo-600 w-5 h-5" />}
            label="Tổng số Lần Ôn tập"
            value={totalReviews}
          />
          <StatRow
            icon={<TrendingDown className="text-orange-600 w-5 h-5" />}
            label="Đến Hạn"
            value={dueCount}
          />
          <StatRow
            icon={<Trophy className="text-green-600 w-5 h-5" />}
            label="Độ Chính xác"
            value={`${accuracy}%`}
          />
        </div>
      </div>

      {/* --- NHÓM 2: TỪ VỰNG YẾU --- */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Thống Kê Từ Vựng Yếu
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <StatRow
            icon={<Star className="text-blue-600 w-5 h-5" />}
            label="Từ mới"
            value={50}
          />
          <StatRow
            icon={<Target className="text-orange-600 w-5 h-5" />}
            label="Trung bình"
            value={moderateWords}
          />
          <StatRow
            icon={<Clock className="text-yellow-600 w-5 h-5" />}
            label="Hơi yếu"
            value={mildWords}
          />
          <StatRow
            icon={<TrendingDown className="text-red-600 w-5 h-5" />}
            label="Rất yếu"
            value={criticalWords}
          />
        </div>
      </div>
    </div>
  );
}

interface StatRowProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

function StatRow({ icon, label, value }: StatRowProps) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-xl hover:shadow-sm transition">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <span className="text-xl font-semibold text-gray-800">{value}</span>
    </div>
  );
}
