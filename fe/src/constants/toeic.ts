import { 
  Headphones, 
  BookOpen, 
  Mic, 
  PenTool,
  Clock,
  Target,
  TrendingUp,
  Award,
  LucideIcon
} from "lucide-react";

export const TOEIC_COLORS = {
  primary: "#ff776f",
  primaryHover: "#e55a52",
  secondary: "#ff9b94",
} as const;

export interface PracticeSkill {
  id: string;
  title: string;
  href: string;
  icon: LucideIcon;
}

export interface ExamType {
  id: string;
  title: string;
  description: string;
  href: string;
  badge: {
    text: string;
    variant: "secondary" | "outline" | "default" | "destructive";
  };
}

export interface ProgressStat {
  id: string;
  title: string;
  icon: LucideIcon;
  value: string;
  subtitle: string;
  progress?: number;
}

export const PRACTICE_SKILLS: PracticeSkill[] = [
  {
    id: "listening",
    title: "Nghe Hiểu",
    href: "/toeic/study-plan",
    icon: Headphones,
  },
  {
    id: "reading",
    title: "Đọc Hiểu",
    href: "/toeic/study-plan",
    icon: BookOpen,
  },
  {
    id: "speaking",
    title: "Luyện nói",
    href: "/toeic/study-plan",
    icon: Mic,
  },
  {
    id: "writing",
    title: "Viết",
    href: "/toeic/study-plan",
    icon: PenTool,
  },
];

export const EXAM_TYPES: ExamType[] = [
  {
    id: "practice",
    title: "Đề thi thực hành",
    description: "Luyện tập với đề thi mô phỏng",
    href: "/toeic/tests",
    badge: {
      text: "Mới",
      variant: "secondary",
    },
  },
  {
    id: "official",
    title: "Đề thi chính thức",
    description: "Đề thi với format chuẩn TOEIC",
    href: "/toeic/tests",
    badge: {
      text: "Hot",
      variant: "outline",
    },
  },
];

export const PROGRESS_STATS: ProgressStat[] = [
  {
    id: "weekly-goal",
    title: "Mục tiêu tuần",
    icon: Target,
    value: "5/7 ngày",
    subtitle: "71%",
    progress: 71,
  },
  {
    id: "study-time",
    title: "Thời gian học",
    icon: Clock,
    value: "2h 30m",
    subtitle: "Hôm nay",
  },
  {
    id: "average-score",
    title: "Điểm trung bình",
    icon: TrendingUp,
    value: "750",
    subtitle: "+50 từ lần trước",
  },
];
