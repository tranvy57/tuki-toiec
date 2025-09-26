import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TOEIC_COLORS } from "@/constants/toeic";

export function QuickActions() {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Link href="/toeic/tests" className="flex-1">
        <Button 
          className="w-full"
          style={{ 
            backgroundColor: TOEIC_COLORS.primary,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = TOEIC_COLORS.primaryHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = TOEIC_COLORS.primary;
          }}
        >
          Bắt đầu luyện thi
        </Button>
      </Link>
      <Link href="/toeic/vocabulary" className="flex-1">
        <Button variant="outline" className="w-full">
          Học từ vựng
        </Button>
      </Link>
    </div>
  );
}
